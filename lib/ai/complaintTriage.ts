// ==============================================================================
// OSMIDA AI: COMPLAINT TRIAGE ENGINE (PHASE B)
// Analyzes customer complaint text + photos + job record using Claude API
// Input: { complaintText, photos, jobRecord }
// Output: { recommended_action: 'refund' | 'partial' | 'redo' | 'dismiss', confidence: 0-1, reasoning: string }
// Admin approves in one click
// ==============================================================================

import { PRONTO_SERVICES } from "../prontoServices";

export interface ComplaintJobRecord {
  referenceId: string;
  serviceName: string;
  totalAmount: number;
  durationHours: number;
  customerName: string;
  locality: string;
  beforePhotoUrl?: string | null;
  afterPhotoUrl?: string | null;
}

export interface ComplaintTriageInput {
  complaintText: string;
  photos?: string[];
  jobRecord: ComplaintJobRecord;
}

export interface ComplaintTriageOutput {
  recommended_action: "refund" | "partial" | "redo" | "dismiss";
  confidence: number; // 0 to 1
  reasoning: string;
}

/**
 * Triages customer complaints against standardized service scope.
 * Provides a 1-click executable resolution recommendation for the admin.
 */
export async function triageComplaint(
  input: ComplaintTriageInput
): Promise<ComplaintTriageOutput> {
  const { complaintText, photos, jobRecord } = input;

  if (!complaintText || !complaintText.trim()) {
    return {
      recommended_action: "dismiss",
      confidence: 1.0,
      reasoning: "Complaint description was empty or not specified.",
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (apiKey) {
    try {
      const scopeSummary = PRONTO_SERVICES.map(
        (s) => `Service: ${s.name}
Included: ${s.included.join(", ")}
Not Included: ${s.notIncluded.join(", ")}`
      ).join("\n\n");

      const prompt = `You are Osmida's AI Customer Dispute Resolution Specialist for residential services in Nellore, India.
Service Standards & Strict Scope:
${scopeSummary}

Booking Details:
- Reference ID: ${jobRecord.referenceId}
- Service: ${jobRecord.serviceName}
- Total Amount: ₹${jobRecord.totalAmount}
- Duration: ${jobRecord.durationHours} hours
- Customer: ${jobRecord.customerName}
- Locality: ${jobRecord.locality}

Customer Complaint:
"${complaintText}"

Attached Complaint Photos: ${photos && photos.length > 0 ? photos.join(", ") : "None"}

Your job is to recommend the single most fair and commercially sound resolution action:
- "refund": For complete failure of service, worker no-show, or severe property damage.
- "partial": For partial task completion or minor inconvenience where full redo is unnecessary (e.g. ₹50-₹100 refund).
- "redo": When worker missed specific tasks that ARE included in scope (e.g. sink wasn't scrubbed, reachable tiles missed) and customer wants a quick touchup.
- "dismiss": When the customer's complaint concerns tasks that are EXPLICITLY NOT INCLUDED in scope (e.g. grout restoration, inside cabinet dismantling, ladder work, industrial chimney baking) OR if the complaint is frivolous.

Respond ONLY with a JSON object strictly matching this schema:
{
  "recommended_action": "refund" | "partial" | "redo" | "dismiss",
  "confidence": number between 0.0 and 1.0,
  "reasoning": "Clear, objective explanation referencing the service scope (2-3 sentences)"
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 400,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const contentText = data.content?.[0]?.text || "";
        const jsonMatch = contentText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const validActions = ["refund", "partial", "redo", "dismiss"];
          const action = validActions.includes(parsed.recommended_action)
            ? parsed.recommended_action
            : "redo";

          return {
            recommended_action: action,
            confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.88,
            reasoning: String(parsed.reasoning || "AI analysis of service scope completed."),
          };
        }
      }
    } catch (err) {
      console.warn("Claude API Complaint Triage note:", err);
    }
  }

  // Resilient Heuristic Rule Engine (evaluates scope keywords if API key is not present)
  const lower = complaintText.toLowerCase();

  // 1. Check if complaint is for EXCLUDED items -> DISMISS
  const excludedKeywords = [
    "grout",
    "acid",
    "hard water",
    "inside cabinet",
    "chimney",
    "heavy furniture",
    "ladder",
    "burnt",
    "broken glass",
  ];
  const matchedExcluded = excludedKeywords.filter((kw) => lower.includes(kw));

  if (matchedExcluded.length > 0) {
    return {
      recommended_action: "dismiss",
      confidence: 0.94,
      reasoning: `Complaint concerns '${matchedExcluded.join(", ")}' which is explicitly listed as NOT INCLUDED in Osmida's fixed service scope. Polite scope clarification recommended.`,
    };
  }

  // 2. Check for serious issues / no-show -> REFUND
  if (lower.includes("no show") || lower.includes("didn't come") || lower.includes("damaged") || lower.includes("cancel")) {
    return {
      recommended_action: "refund",
      confidence: 0.95,
      reasoning: "Critical service defect or pro attendance issue reported. Full escrow refund recommended to maintain resident trust.",
    };
  }

  // 3. Check for missed included areas -> REDO
  if (lower.includes("missed") || lower.includes("sink") || lower.includes("dirty") || lower.includes("stain") || lower.includes("again") || lower.includes("touchup")) {
    return {
      recommended_action: "redo",
      confidence: 0.91,
      reasoning: "Customer reported missed areas that are part of the standard cleaning checklist. Dispatching a 30-minute pro touchup visit recommended.",
    };
  }

  // 4. Default: Partial settlement
  return {
    recommended_action: "partial",
    confidence: 0.85,
    reasoning: "Customer expressed dissatisfaction with service duration or thoroughness. Partial credit/refund recommended to ensure customer retention.",
  };
}
