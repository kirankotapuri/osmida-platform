"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Loader2,
  ExternalLink,
  ShieldCheck,
  KeyRound,
  Clock,
  Phone,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  time?: string;
  quickReplies?: string[];
  actionPayload?: {
    type: string;
    url?: string;
  };
  bookingContext?: any;
}

interface OsmidaSupportChatProps {
  referenceId?: string;
}

const DEFAULT_QUICK_REPLIES = [
  "What is included in Bathroom Cleaning?",
  "What is included in Kitchen Cleaning?",
  "How much does it cost?",
  "Where are my Start & End OTPs?",
  "Which Nellore apartments are covered?",
];

export function OsmidaSupportChat({ referenceId }: OsmidaSupportChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm Sita, your Osmida Nellore concierge. We provide 4 standard home services at flat ₹199/hr (Bathroom, Kitchen, Dishes, & House Help). How can I assist you today?`,
      time: "Just now",
      quickReplies: referenceId
        ? ["Show my Start & End OTPs", "Track Worker ETA", "What is included?"]
        : DEFAULT_QUICK_REPLIES.slice(0, 3),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/ai/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          referenceId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: Message = {
          role: "assistant",
          content: data.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          quickReplies: data.suggestedQuickReplies || [],
          actionPayload: data.actionPayload,
          bookingContext: data.bookingContext,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I had trouble processing that. You can also reach our Nellore helpline directly on WhatsApp.",
            time: "Just now",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network issue. Please check your connection and try again.",
          time: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 shadow-xl hover:shadow-2xl transition-all border border-slate-700/50 group"
          aria-label="Open Osmida AI Concierge Support"
        >
          <div className="relative">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0C6266] text-white">
              <Sparkles className="h-4 w-4 text-[#E68A00]" />
            </span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#16A34A]" />
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-tight text-white">Ask Sita AI</p>
            <p className="text-[10px] text-slate-400 font-medium">Nellore Apartment Help</p>
          </div>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[94vw] sm:w-[400px] h-[580px] max-h-[90vh] rounded-2xl bg-white border border-[#DFE8E8] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#072426] text-white p-3.5 flex items-center justify-between border-b border-[#0C4144] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0C6266] text-white">
                  <Sparkles className="h-4 w-4 text-[#E68A00]" />
                </span>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#16A34A] border-2 border-[#072426]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">Sita — Osmida Concierge</h4>
                  <span className="text-[9px] bg-[#E68A00]/20 text-[#E68A00] border border-[#E68A00]/40 px-1.5 py-0.2 rounded-full font-bold">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">Nellore Apartment Support • Flat ₹199/hr</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-2xs ${
                    m.role === "user"
                      ? "bg-primary text-white rounded-br-xs font-medium"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed text-xs">{m.content}</p>

                  {/* Context Badge if active booking attached */}
                  {m.bookingContext && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="font-bold flex items-center gap-1">
                        <KeyRound className="h-3 w-3 text-primary" />
                        Ref: {m.bookingContext.referenceId}
                      </span>
                      {m.bookingContext.startOtp && (
                        <span className="bg-slate-100 font-mono font-bold px-1.5 py-0.5 rounded text-slate-800">
                          OTP: {m.bookingContext.startOtp}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Link if provided */}
                  {m.actionPayload && m.actionPayload.url && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <Link
                        href={m.actionPayload.url}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                        onClick={() => setIsOpen(false)}
                      >
                        <span>Open Details</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>

                {m.time && (
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
                )}

                {/* Quick reply buttons below latest assistant message */}
                {idx === messages.length - 1 && m.quickReplies && m.quickReplies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                    {m.quickReplies.map((qr, qIdx) => (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => handleSendMessage(qr)}
                        disabled={isLoading}
                        className="text-[10px] bg-white hover:bg-primary/10 hover:text-primary border border-slate-200 hover:border-primary/30 rounded-full px-2.5 py-1 text-slate-700 font-semibold transition-all shadow-2xs text-left"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Sita is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything (e.g. scope, pricing, OTP)..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-300 py-2 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="flex items-center justify-center h-8 w-8 rounded-xl bg-[#E68A00] hover:bg-[#CC7A00] text-white disabled:opacity-40 transition-colors shrink-0 shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
