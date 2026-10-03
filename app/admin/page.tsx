"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Calendar,
  IndianRupee,
  AlertTriangle,
  Settings as SettingsIcon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Search,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Lock,
  LogOut,
  KeyRound,
  ShieldAlert,
  Camera,
  Download,
  Radio,
  X,
  MessageSquare,
  UserCheck,
  UserX,
  Edit3,
  RotateCcw,
} from "lucide-react";
import { OSMIDA_SERVICES, DEFAULT_APP_SETTINGS } from "@/lib/osmidaServices";
import { broadcastLocationsUpdated, DEFAULT_NELLORE_LOCALITIES } from "@/lib/serviceLocations";

export default function AdminDashboardPage() {
  // Admin Auth Gate State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "bookings" | "workers" | "finance" | "complaints" | "settings"
  >("bookings");

  useEffect(() => {
    // Check server session cookie
    fetch("/api/admin/auth")
      .then((res) => {
        if (res.ok) {
          setIsAdminAuthenticated(true);
        } else {
          setIsAdminAuthenticated(false);
        }
      })
      .catch(() => setIsAdminAuthenticated(false))
      .finally(() => setIsCheckingAuth(false));
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: adminUsername.trim(),
          password: adminPassword.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminAuthenticated(true);
      } else {
        setAuthError(data.error || "Access Denied: Invalid credentials.");
      }
    } catch {
      setAuthError("Authentication service connection error. Please try again.");
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {}
    setIsAdminAuthenticated(false);
    setAdminUsername("");
    setAdminPassword("");
  };

  // Bookings Tab State
  const [bookings, setBookings] = useState<any[]>([]);
  const [availableWorkers, setAvailableWorkers] = useState<any[]>([]);
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  // Workers Tab State
  const [workers, setWorkers] = useState<any[]>([]);

  // Finance Tab State
  const [financeStats, setFinanceStats] = useState<any>(null);
  const [revenueByService, setRevenueByService] = useState<any>({});
  const [payouts, setPayouts] = useState<any[]>([]);
  const [txRefInputs, setTxRefInputs] = useState<Record<string, string>>({});

  // Complaints Tab State
  const [complaints, setComplaints] = useState<any[]>([]);

  // Settings Tab State
  const [hourlyRateInput, setHourlyRateInput] = useState<number>(199);
  const [workerPayoutInput, setWorkerPayoutInput] = useState<number>(140);
  const [zones, setZones] = useState<string[]>(DEFAULT_APP_SETTINGS.service_zones);
  const [newZoneInput, setNewZoneInput] = useState("");
  const [editingZone, setEditingZone] = useState<{ original: string; current: string } | null>(null);
  const [zoneSearchQuery, setZoneSearchQuery] = useState("");
  const [zoneActionMsg, setZoneActionMsg] = useState("");
  const [settingsSavedMsg, setSettingsSavedMsg] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Photo Audit Inspection Modal State
  const [inspectingPhotos, setInspectingPhotos] = useState<{
    referenceId: string;
    customerName: string;
    workerName: string;
    serviceName: string;
    beforePhotoUrl?: string;
    afterPhotoUrl?: string;
  } | null>(null);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch bookings & workers
      const bRes = await fetch("/api/admin/bookings");
      const bData = await bRes.json();
      if (bData.success) {
        setBookings(bData.bookings || []);
        setAvailableWorkers(bData.workers || []);
        setWorkers(bData.workers || []);
      }

      // 2. Fetch finance
      const fRes = await fetch("/api/admin/finance");
      const fData = await fRes.json();
      if (fData.success) {
        setFinanceStats(fData.stats);
        setRevenueByService(fData.revenueByService || {});
        setPayouts(fData.payouts || []);
      }

      // 3. Fetch complaints
      const cRes = await fetch("/api/admin/complaints");
      const cData = await cRes.json();
      if (cData.success) {
        setComplaints(cData.complaints || []);
      }

      // 4. Fetch settings & live locations with cache-busting
      const [sRes, lRes] = await Promise.all([
        fetch(`/api/settings?t=${Date.now()}`, { cache: "no-store" }),
        fetch(`/api/locations?t=${Date.now()}`, { cache: "no-store" }),
      ]);
      const sData = await sRes.json();
      const lData = await lRes.json();
      if (sData.success && sData.settings) {
        setHourlyRateInput(Number(sData.settings.hourly_rate) || 199);
        setWorkerPayoutInput(Number(sData.settings.worker_payout_rate) || 140);
      }
      if (lData.success && Array.isArray(lData.locations) && lData.locations.length > 0) {
        setZones(lData.locations);
      } else if (sData.success && Array.isArray(sData.settings?.service_zones)) {
        setZones(sData.settings.service_zones);
      }
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Live Radar: Auto-refresh every 15s when authenticated and active
  useEffect(() => {
    if (!isAdminAuthenticated || !isAutoRefresh) return;
    const interval = setInterval(() => {
      fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, [isAdminAuthenticated, isAutoRefresh]);

  // Action: Manual Worker Assignment
  const handleAssignWorker = async (referenceId: string, workerPhone: string) => {
    const selectedWorker = availableWorkers.find((w) => w.phone === workerPhone);
    if (!selectedWorker) return;

    setIsAssigning(referenceId);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId,
          workerId: selectedWorker.id,
          workerName: selectedWorker.name,
          workerPhone: selectedWorker.phone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b.reference_id === referenceId
              ? {
                  ...b,
                  worker_name: selectedWorker.name,
                  worker_phone: selectedWorker.phone,
                  status: "assigned",
                }
              : b
          )
        );
      }
    } catch (err) {
      console.error("Assign worker error:", err);
    } finally {
      setIsAssigning(null);
    }
  };

  // Action: Mark Payout as Paid
  const handleMarkPayoutPaid = async (payoutId: string, referenceId: string) => {
    const txRef = txRefInputs[payoutId] || `UPI/NEL/${Date.now().toString().slice(-6)}`;
    try {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutId, referenceId, transactionRef: txRef }),
      });
      const data = await res.json();
      if (data.success) {
        setPayouts((prev) =>
          prev.map((p) =>
            p.id === payoutId ? { ...p, status: "paid", transaction_ref: txRef } : p
          )
        );
      }
    } catch (err) {
      console.error("Mark paid error:", err);
    }
  };

  // Action: Update Partner KYC / Approval Status
  const handleUpdateWorkerStatus = async (workerId: string, phone: string, approvalStatus: string) => {
    try {
      const res = await fetch("/api/admin/workers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, phone, approvalStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkers((prev) =>
          prev.map((w) =>
            w.id === workerId || w.phone === phone
              ? { ...w, approval_status: approvalStatus }
              : w
          )
        );
      }
    } catch (err) {
      console.error("Worker status update error:", err);
    }
  };

  // Action: Export Bank / RazorpayX Payout Sheet CSV
  const handleExportPayoutsCsv = () => {
    if (!payouts || payouts.length === 0) {
      alert("No payouts available to export.");
      return;
    }
    const headers = ["Reference_ID", "Worker_Name", "Worker_UPI", "Payout_Amount_INR", "Status", "Transaction_Ref", "Export_Date"];
    const rows = payouts.map((p) => [
      `"${p.reference_id || ""}"`,
      `"${p.partner_name || ""}"`,
      `"${p.partner_upi || ""}"`,
      p.amount || 0,
      `"${p.status || "pending"}"`,
      `"${p.transaction_ref || ""}"`,
      `"${new Date().toLocaleDateString("en-IN")}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Osmida_Nellore_Payouts_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Action: Resolve Complaint
  const handleResolveComplaint = async (
    referenceId: string,
    action: "refund" | "partial" | "redo" | "dismiss"
  ) => {
    try {
      const res = await fetch("/api/admin/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceId, resolutionAction: action }),
      });
      const data = await res.json();
      if (data.success) {
        setComplaints((prev) =>
          prev.map((c) =>
            c.reference_id === referenceId ? { ...c, complaint_status: action } : c
          )
        );
      }
    } catch (err) {
      console.error("Complaint action error:", err);
    }
  };

  const [triagingRef, setTriagingRef] = useState<string | null>(null);

  // Action: Trigger AI Complaint Triage
  const handleTriggerTriage = async (c: any) => {
    setTriagingRef(c.reference_id);
    try {
      const res = await fetch("/api/ai/complaint-triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId: c.reference_id,
          complaintText: c.complaint_text,
          photos: c.complaint_photos,
        }),
      });
      const data = await res.json();
      if (data.success && data.triage) {
        setComplaints((prev) =>
          prev.map((item) =>
            item.reference_id === c.reference_id
              ? { ...item, ai_recommendation: data.triage }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Trigger triage error:", err);
    } finally {
      setTriagingRef(null);
    }
  };

  // Action: Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSavedMsg("");

    let finalZones = [...zones];
    const pendingInput = newZoneInput.trim();
    if (pendingInput && !finalZones.some((z) => z.toLowerCase() === pendingInput.toLowerCase())) {
      finalZones.push(pendingInput);
      setZones(finalZones);
      setNewZoneInput("");
    }

    try {
      const [resSettings] = await Promise.all([
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hourly_rate: Number(hourlyRateInput),
            worker_payout_rate: Number(workerPayoutInput),
            service_zones: finalZones,
          }),
        }),
        fetch("/api/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locations: finalZones }),
        }),
      ]);

      const data = await resSettings.json();
      if (data.success) {
        broadcastLocationsUpdated(finalZones);
        setSettingsSavedMsg("Settings & Service Locations updated successfully! Synced live across webapp.");
        setTimeout(() => setSettingsSavedMsg(""), 4000);
      }
    } catch (err) {
      console.error("Save settings error:", err);
    }
  };

  const handleAddZone = async (locationToAdd?: string) => {
    const clean = (typeof locationToAdd === "string" ? locationToAdd : newZoneInput).trim();
    if (!clean) return;
    if (zones.some((z) => z.toLowerCase() === clean.toLowerCase())) {
      setZoneActionMsg(`"${clean}" already exists in active locations!`);
      setTimeout(() => setZoneActionMsg(""), 3000);
      return;
    }
    const nextZones = [...zones, clean];
    setZones(nextZones);
    setNewZoneInput("");
    broadcastLocationsUpdated(nextZones);

    try {
      const [resLoc] = await Promise.all([
        fetch("/api/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: clean }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hourly_rate: Number(hourlyRateInput),
            worker_payout_rate: Number(workerPayoutInput),
            service_zones: nextZones,
          }),
        }),
      ]);

      const data = await resLoc.json();
      if (data.success && Array.isArray(data.locations)) {
        setZones(data.locations);
        broadcastLocationsUpdated(data.locations);
      }
      setZoneActionMsg(`Added "${clean}"! Synced live across entire webapp.`);
      setTimeout(() => setZoneActionMsg(""), 3500);
    } catch {
      broadcastLocationsUpdated(nextZones);
    }
  };

  const handleStartEditZone = (zone: string) => {
    setEditingZone({ original: zone, current: zone });
  };

  const handleSaveEditZone = async () => {
    if (!editingZone) return;
    const oldName = editingZone.original.trim();
    const newName = editingZone.current.trim();
    if (!newName || oldName === newName) {
      setEditingZone(null);
      return;
    }
    const nextZones = zones.map((z) => (z === oldName ? newName : z));
    setZones(nextZones);
    setEditingZone(null);
    broadcastLocationsUpdated(nextZones);

    try {
      const [resLoc] = await Promise.all([
        fetch("/api/locations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldLocation: oldName, newLocation: newName }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hourly_rate: Number(hourlyRateInput),
            worker_payout_rate: Number(workerPayoutInput),
            service_zones: nextZones,
          }),
        }),
      ]);

      const data = await resLoc.json();
      if (data.success && Array.isArray(data.locations)) {
        setZones(data.locations);
        broadcastLocationsUpdated(data.locations);
      }
      setZoneActionMsg(`Updated "${oldName}" to "${newName}" live across webapp.`);
      setTimeout(() => setZoneActionMsg(""), 3500);
    } catch {
      broadcastLocationsUpdated(nextZones);
    }
  };

  const handleRemoveZone = async (zone: string) => {
    if (zones.length <= 1) {
      alert("At least one service location must remain.");
      return;
    }
    if (!confirm(`Are you sure you want to remove "${zone}" from active service locations?`)) {
      return;
    }
    const nextZones = zones.filter((z) => z !== zone);
    setZones(nextZones);
    broadcastLocationsUpdated(nextZones);

    try {
      const [resLoc] = await Promise.all([
        fetch(`/api/locations?location=${encodeURIComponent(zone)}`, {
          method: "DELETE",
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hourly_rate: Number(hourlyRateInput),
            worker_payout_rate: Number(workerPayoutInput),
            service_zones: nextZones,
          }),
        }),
      ]);

      const data = await resLoc.json();
      if (data.success && Array.isArray(data.locations)) {
        setZones(data.locations);
        broadcastLocationsUpdated(data.locations);
      }
      setZoneActionMsg(`Removed "${zone}". Updated everywhere.`);
      setTimeout(() => setZoneActionMsg(""), 3500);
    } catch {
      broadcastLocationsUpdated(nextZones);
    }
  };

  const handleResetZones = async () => {
    if (!confirm("Reset service locations back to standard Nellore hubs?")) return;
    try {
      await Promise.all([
        fetch("/api/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locations: DEFAULT_NELLORE_LOCALITIES }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hourly_rate: Number(hourlyRateInput),
            worker_payout_rate: Number(workerPayoutInput),
            service_zones: DEFAULT_NELLORE_LOCALITIES,
          }),
        }),
      ]);
      setZones(DEFAULT_NELLORE_LOCALITIES);
      broadcastLocationsUpdated(DEFAULT_NELLORE_LOCALITIES);
      setZoneActionMsg("Restored standard Nellore coverage hubs.");
      setTimeout(() => setZoneActionMsg(""), 3500);
    } catch {}
  };

  // Normalize status across dispatch lifecycle
  const normalizeStatus = (status: string | undefined): string => {
    const s = String(status || "").toLowerCase().trim();
    if (s === "in-progress" || s === "in_progress" || s === "started") return "in_progress";
    if (s === "assigned" || s === "accepted" || s === "dispatched" || s === "reach_gate" || s === "at_gate") return "assigned";
    if (s === "pending" || s === "offered" || s === "confirmed") return "pending";
    if (s === "completed" || s === "done") return "completed";
    if (s === "disputed" || s === "complaint") return "disputed";
    return s || "pending";
  };

  const getStatusCount = (filterKey: string): number => {
    if (filterKey === "all") return bookings.length;
    return bookings.filter((b) => normalizeStatus(b.status) === filterKey).length;
  };

  const filteredBookings = bookings.filter((b) => {
    const norm = normalizeStatus(b.status);
    if (bookingFilter !== "all" && norm !== bookingFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.reference_id?.toLowerCase().includes(q) ||
        b.customer_name?.toLowerCase().includes(q) ||
        b.phone?.includes(q) ||
        b.locality?.toLowerCase().includes(q) ||
        b.worker_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Render Loading while checking session
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-[#E68A00]" />
      </div>
    );
  }

  // SCREEN: STRONG ADMIN AUTHENTICATION GATE
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-7 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="relative h-11 w-44 mx-auto mb-3 flex items-center justify-center">
              <Image
                src="/assets/branding/osmida-wordmark-white.png"
                alt="Osmida"
                width={176}
                height={45}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-lg font-black tracking-wider text-white uppercase">
                Osmida Operations Control
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Restricted Access • Nellore Internal Admin Portal Only
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 font-semibold">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-300 tracking-wider mb-1.5">
                Admin Username
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#0C6266] font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-300 tracking-wider mb-1.5">
                Master Security Key / Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#0C6266] font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#E68A00] hover:bg-[#CC7A00] text-white py-3 text-xs font-black transition-all shadow-md active:scale-98"
            >
              <Lock className="h-4 w-4" />
              <span>Authorize & Access Dashboard</span>
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-500 font-medium">
            Authorized personnel only. All access attempts and dispatch commands are logged.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-7 w-28 shrink-0">
              <Image
                src="/assets/branding/osmida-wordmark-white.png"
                alt="Osmida"
                width={120}
                height={31}
                className="h-full w-auto object-contain object-left"
                priority
              />
            </div>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-bold bg-[#0C6266]/30 text-[#38B2AC] border border-[#0C6266]/50 px-2 py-0.5 rounded-full">
                Operations Control • Nellore
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Radar Auto-Refresh Toggle */}
            <button
              type="button"
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                isAutoRefresh
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/30"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
              }`}
              title={isAutoRefresh ? "Live Radar Active: Polling every 15s" : "Live Radar Paused"}
            >
              <Radio className={`w-3.5 h-3.5 ${isAutoRefresh ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
              <span className="hidden xs:inline">{isAutoRefresh ? "Live Radar (15s)" : "Radar Paused"}</span>
            </button>

            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-300 transition cursor-pointer"
              title="End Admin Session"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-400" />
              <span className="hidden xs:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Nav Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 pt-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
              activeTab === "bookings"
                ? "bg-[#0C6266] text-white font-bold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>1. Bookings Table ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("workers")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
              activeTab === "workers"
                ? "bg-[#0C6266] text-white font-bold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>2. Worker Roster ({workers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("finance")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
              activeTab === "finance"
                ? "bg-[#0C6266] text-white font-bold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <IndianRupee className="h-4 w-4" />
            <span>3. Finance & Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab("complaints")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
              activeTab === "complaints"
                ? "bg-[#0C6266] text-white font-bold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>4. Complaints Queue ({complaints.filter((c) => c.complaint_status === "open").length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
              activeTab === "settings"
                ? "bg-[#0C6266] text-white font-bold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <SettingsIcon className="h-4 w-4" />
            <span>5. Settings</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: BOOKINGS TABLE & MANUAL WORKER ASSIGNMENT               */}
        {/* ============================================================== */}
        {activeTab === "bookings" && (
          <div className="mt-6 space-y-4">
            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto w-full sm:w-auto">
                {["all", "pending", "assigned", "in_progress", "completed", "disputed"].map((st) => {
                  const count = getStatusCount(st);
                  return (
                    <button
                      key={st}
                      onClick={() => setBookingFilter(st)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition font-bold flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        bookingFilter === st
                          ? "bg-slate-800 text-white shadow-xs"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>{st.replace(/_/g, " ")}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          bookingFilter === st
                            ? "bg-[#0C6266] text-white"
                            : "bg-slate-900 text-slate-400 border border-slate-800"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search ref, customer, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#0C6266]"
                />
              </div>
            </div>

            {/* Bookings Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="p-3.5">Ref / Date</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Apartment & Locality</th>
                      <th className="p-3.5">Tasks & Duration</th>
                      <th className="p-3.5">Amount (₹)</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Assigned Worker</th>
                      <th className="p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-medium">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((b) => (
                        <tr key={b.reference_id} className="hover:bg-slate-900/50 transition">
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-white block">
                              {b.reference_id}
                            </span>
                            <span className="text-[10px] text-slate-400">{b.time_slot}</span>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center justify-between gap-1.5">
                              <div>
                                <span className="text-white font-bold block">{b.customer_name}</span>
                                <span className="text-[10px] text-slate-400">{b.phone}</span>
                              </div>
                              {b.phone && (
                                <a
                                  href={`https://wa.me/91${String(b.phone).replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                                    `Hello ${b.customer_name}, regarding your Osmida booking (${b.reference_id}): ${b.worker_name ? `Technician ${b.worker_name} (${b.worker_phone}) is on dispatch.` : "A verified technician is being assigned."} Nellore Hub Hotline: 9490122849.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="WhatsApp Customer"
                                  className="p-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition shrink-0"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5 max-w-[180px]">
                            <span className="text-slate-200 block truncate font-bold">
                              {b.apartment_name || b.locality}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate block">
                              {b.site_address}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-[#E68A00] font-bold block">
                              {b.duration_hours || 1.5} Hours
                            </span>
                            <span className="text-[10px] text-slate-400 block max-w-[160px] truncate">
                              {b.selected_service}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-black text-white text-sm">₹{b.total_amount}</span>
                            <span className="text-[10px] text-slate-400 block uppercase">
                              {b.escrow_status || "held"}
                            </span>
                          </td>
                          <td className="p-3.5">
                            {(() => {
                              const norm = normalizeStatus(b.status);
                              const isDispatched = b.status === "dispatched" || b.status === "at_gate" || b.status === "reach_gate";
                              return (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide inline-block ${
                                    norm === "completed"
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                      : norm === "in_progress"
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                                      : norm === "disputed"
                                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                      : isDispatched
                                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                                      : norm === "assigned"
                                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold"
                                      : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  }`}
                                >
                                  {isDispatched ? (b.status === "at_gate" || b.status === "reach_gate" ? "AT GATE" : "ON THE WAY") : norm.replace(/_/g, " ")}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="p-3.5">
                            {b.worker_name ? (
                              <div className="flex items-center justify-between gap-1.5">
                                <div>
                                  <span className="text-white font-bold block">{b.worker_name}</span>
                                  <span className="text-[10px] text-slate-400">{b.worker_phone}</span>
                                </div>
                                {b.worker_phone && (
                                  <a
                                    href={`https://wa.me/91${String(b.worker_phone).replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                                      `Hi ${b.worker_name}, please confirm dispatch status for Osmida booking ${b.reference_id} at ${b.locality || "Nellore"}. Customer: ${b.customer_name} (${b.phone}).`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="WhatsApp Technician"
                                    className="p-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition shrink-0"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-amber-400 font-bold">
                                ⚠ Unassigned
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            {/* Manual Assign Worker Dropdown */}
                            <select
                              disabled={isAssigning === b.reference_id}
                              value={b.worker_phone || ""}
                              onChange={(e) => handleAssignWorker(b.reference_id, e.target.value)}
                              className="bg-slate-900 border border-slate-700 text-[11px] rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-[#0C6266] w-full"
                            >
                              <option value="">-- Assign Worker --</option>
                              {availableWorkers.map((w) => (
                                <option key={w.phone} value={w.phone}>
                                  {w.name} ({w.phone})
                                </option>
                              ))}
                            </select>

                            {/* Before & After Photo Quality Audit Button for Completed Bookings */}
                            {(b.status === "completed" || b.before_photo_url || b.after_photo_url) && (
                              <button
                                type="button"
                                onClick={() => {
                                  const cart = b.cart_items && typeof b.cart_items === "object" ? b.cart_items : {};
                                  setInspectingPhotos({
                                    referenceId: b.reference_id,
                                    customerName: b.customer_name,
                                    workerName: b.worker_name || "Assigned Worker",
                                    serviceName: b.selected_service || "Home Service",
                                    beforePhotoUrl: b.before_photo_url || cart.before_photo_url || "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500&auto=format&fit=crop&q=80",
                                    afterPhotoUrl: b.after_photo_url || cart.after_photo_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80",
                                  });
                                }}
                                className="flex items-center justify-center gap-1 w-full px-2 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-[10px] font-bold transition mt-1.5 cursor-pointer"
                                title="Audit Before & After Photos"
                              >
                                <Camera className="w-3 h-3 text-blue-400" />
                                <span>Audit Photos</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          No bookings found for the selected filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: WORKER ROSTER                                           */}
        {/* ============================================================== */}
        {activeTab === "workers" && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Nellore Worker Roster</h3>
                <p className="text-xs text-slate-400">
                  Registered pros for Bathroom, Kitchen, Dishwashing, and House Help.
                </p>
              </div>
              <span className="text-xs font-bold text-[#0C6266] bg-[#0C6266]/20 px-3 py-1 rounded-full border border-[#0C6266]/35">
                {workers.length} Active Partners
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map((w) => (
                <div
                  key={w.id || w.phone}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#0C6266]/25 border border-[#0C6266]/35 flex items-center justify-center font-black text-[#0C6266]">
                        {w.name ? w.name[0] : "W"}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{w.name}</h4>
                        <span className="text-xs text-slate-400 font-mono">+91 {w.phone}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-[#0C6266]/30 text-[#E68A00] px-2 py-0.5 rounded-full uppercase">
                      {w.approval_status || "Active"}
                    </span>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-2.5 text-xs space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rating:</span>
                      <span className="font-bold text-amber-400">★ {w.rating || 5.0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Completed Jobs:</span>
                      <span className="font-bold text-white">{w.completed_jobs_count || 12}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payout UPI:</span>
                      <span className="font-mono text-[#E68A00] font-bold">{w.upi_id || `${w.phone}@upi`}</span>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Assigned Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(w.skills || OSMIDA_SERVICES.map((s) => s.name)).map((sk: string) => (
                        <span
                          key={sk}
                          className="text-[10px] bg-white/10 text-slate-200 px-2 py-0.5 rounded-md"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* KYC Approval & Status Actions */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-800 text-[11px]">
                    <span className="text-[10px] font-bold text-slate-400">KYC Status:</span>
                    <div className="flex items-center gap-1.5">
                      {w.approval_status !== "active" ? (
                        <button
                          onClick={() => handleUpdateWorkerStatus(w.id, w.phone, "active")}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition cursor-pointer shadow-xs"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>Approve Active</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleUpdateWorkerStatus(w.id, w.phone, "pending")}
                            className="px-2 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-bold text-[10px] transition cursor-pointer"
                            title="Put partner application on review"
                          >
                            Hold
                          </button>
                          <button
                            onClick={() => handleUpdateWorkerStatus(w.id, w.phone, "suspended")}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-[10px] transition cursor-pointer"
                            title="Temporarily suspend partner"
                          >
                            <UserX className="w-3 h-3" />
                            <span>Suspend</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: FINANCE & WORKER PAYOUT LEDGER                          */}
        {/* ============================================================== */}
        {activeTab === "finance" && (
          <div className="mt-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Gross GMV</span>
                <p className="text-2xl font-black text-white">₹{financeStats?.totalGrossRevenue || 3480}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Worker Payouts</span>
                <p className="text-2xl font-black text-[#0C6266]">₹{financeStats?.totalWorkerPayouts || 2450}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Platform Margin</span>
                <p className="text-2xl font-black text-blue-400">₹{financeStats?.netMargin || 1030}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Pending Settlement</span>
                <p className="text-2xl font-black text-amber-400">{financeStats?.payoutsPendingCount || 1} Jobs</p>
              </div>
            </div>

            {/* Revenue by Service */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
              <h3 className="text-sm font-black text-white">Revenue by Service (Nellore)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(revenueByService).map(([svc, data]: [string, any]) => (
                  <div key={svc} className="bg-slate-900 rounded-xl p-3 space-y-1">
                    <span className="text-xs font-bold text-slate-300 block">{svc}</span>
                    <span className="text-lg font-black text-white block">₹{data.total}</span>
                    <span className="text-[10px] text-slate-500">{data.count} bookings</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Worker Payout Ledger */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl space-y-2">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-black text-white">Worker Payout Ledger</h3>
                  <span className="text-xs text-slate-400">Settled via Instant UPI to Workers</span>
                </div>
                <button
                  type="button"
                  onClick={handleExportPayoutsCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Payout Sheet (CSV)</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-[10px] uppercase text-slate-400 font-black">
                    <tr>
                      <th className="p-3">Ref ID</th>
                      <th className="p-3">Worker Name</th>
                      <th className="p-3">Worker UPI ID</th>
                      <th className="p-3">Payout Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Transaction Ref</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-white">{p.reference_id}</td>
                        <td className="p-3 font-bold text-slate-200">{p.partner_name}</td>
                        <td className="p-3 font-mono text-[#E68A00]">{p.partner_upi || "sujatha@okaxis"}</td>
                        <td className="p-3 font-black text-white">₹{p.amount}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              p.status === "paid"
                                ? "bg-[#0C6266]/30 text-[#E68A00]"
                                : p.status === "pending"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {p.status === "paid" ? (
                            <span className="font-mono text-[10px] text-slate-400">
                              {p.transaction_ref}
                            </span>
                          ) : (
                            <input
                              type="text"
                              placeholder="e.g. UPI/20260925/8921"
                              value={txRefInputs[p.id] || ""}
                              onChange={(e) =>
                                setTxRefInputs((prev) => ({ ...prev, [p.id]: e.target.value }))
                              }
                              className="rounded bg-slate-900 border border-slate-700 px-2 py-1 text-[11px] text-white focus:outline-none"
                            />
                          )}
                        </td>
                        <td className="p-3">
                          {p.status !== "paid" ? (
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`upi://pay?pa=${encodeURIComponent(p.partner_upi || "9490122849@okaxis")}&pn=${encodeURIComponent(p.partner_name || "Osmida Partner")}&am=${p.amount}&cu=INR&tn=${encodeURIComponent(`Osmida Payout ${p.reference_id}`)}`}
                                className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 font-bold text-[11px] transition inline-flex items-center gap-1 shadow-xs"
                                title="Open Google Pay / PhonePe with pre-filled amount and UPI ID"
                              >
                                <span>⚡ Pay UPI</span>
                              </a>
                              <button
                                onClick={() => handleMarkPayoutPaid(p.id, p.reference_id)}
                                className="rounded-lg bg-[#E68A00] hover:bg-[#CC7A00] text-white px-2.5 py-1 font-bold text-[11px] transition shadow-xs"
                              >
                                Mark Paid
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-400">✓ Settled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: COMPLAINTS QUEUE                                        */}
        {/* ============================================================== */}
        {activeTab === "complaints" && (
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-base font-black text-white">Customer Complaints & Dispute Queue</h3>
              <p className="text-xs text-slate-400">
                Resolve within 2 hours: issue full refund, partial refund, touchup redo, or dismiss.
              </p>
            </div>

            <div className="space-y-3">
              {complaints.length > 0 ? (
                complaints.map((c) => (
                  <div
                    key={c.id || c.reference_id}
                    className="rounded-2xl border border-rose-500/30 bg-slate-950 p-5 space-y-3 shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">
                            {c.reference_id}
                          </span>
                          <span className="text-xs text-slate-400">• {c.customer_name} (+91 {c.customer_phone})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{c.apartment_name}</p>
                      </div>

                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          c.complaint_status === "open"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {c.complaint_status}
                      </span>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 text-xs text-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                        Complaint Description:
                      </span>
                      <p>{c.complaint_text}</p>
                    </div>

                    {/* AI Triage Card (Phase B Requirement) */}
                    {c.ai_recommendation ? (
                      <div className="rounded-xl bg-purple-950/40 border border-purple-500/30 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs">
                            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                            <span>AI Scope Triage:</span>
                            <span className="uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 font-black border border-purple-400/30">
                              {c.ai_recommendation.recommended_action}
                            </span>
                          </div>
                          <span className="text-[10px] text-purple-400 font-bold">
                            {Math.round(c.ai_recommendation.confidence * 100)}% Confidence
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-200 leading-relaxed font-medium">
                          {c.ai_recommendation.reasoning}
                        </p>

                        {/* 1-Click Approve AI Action Button */}
                        {c.complaint_status === "open" && (
                          <button
                            onClick={() =>
                              handleResolveComplaint(c.reference_id, c.ai_recommendation.recommended_action)
                            }
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>
                              Approve AI Recommendation ({c.ai_recommendation?.recommended_action ? c.ai_recommendation.recommended_action.toUpperCase() : "APPROVE"}) in 1-Click
                            </span>
                          </button>
                        )}
                      </div>
                    ) : (
                      c.complaint_status === "open" && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            disabled={triagingRef === c.reference_id}
                            onClick={() => handleTriggerTriage(c)}
                            className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-950/30 border border-purple-500/30 px-3 py-1.5 rounded-lg transition"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>
                              {triagingRef === c.reference_id ? "Analyzing with AI..." : "Run AI Scope Triage"}
                            </span>
                          </button>
                        </div>
                      )
                    )}

                    {/* Manual Resolution Action Buttons */}
                    {c.complaint_status === "open" ? (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                        <span className="text-xs font-bold text-slate-400 mr-2">Manual Override:</span>
                        <button
                          onClick={() => handleResolveComplaint(c.reference_id, "refund")}
                          className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          Full Refund
                        </button>
                        <button
                          onClick={() => handleResolveComplaint(c.reference_id, "partial")}
                          className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          Partial Refund
                        </button>
                        <button
                          onClick={() => handleResolveComplaint(c.reference_id, "redo")}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          Dispatch Redo
                        </button>
                        <button
                          onClick={() => handleResolveComplaint(c.reference_id, "dismiss")}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          Dismiss
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-[#E68A00]">
                        ✓ Resolved with action: {(c.complaint_status || "resolved").toUpperCase()}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center text-slate-500 text-xs">
                  Zero open complaints! All customers are satisfied.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: SETTINGS & PRICING CONFIGURATION                        */}
        {/* ============================================================== */}
        {activeTab === "settings" && (
          <div className="mt-6 max-w-2xl space-y-6">
            <div>
              <h3 className="text-base font-black text-white">System Settings & Pricing</h3>
              <p className="text-xs text-slate-400">
                Single flat hourly rate configuration and active coverage zones in Nellore.
              </p>
            </div>

            {settingsSavedMsg && (
              <div className="rounded-xl bg-[#0C6266]/30 border border-[#0C6266]/50 p-3 text-xs font-bold text-[#E68A00] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{settingsSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Hourly Rate Engine</h4>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Customer Flat Hourly Rate (INR / Hour)*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min={99}
                      max={999}
                      value={hourlyRateInput}
                      onChange={(e) => setHourlyRateInput(Number(e.target.value))}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 pl-8 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#0C6266]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Applies identically across all 4 services (Bathroom, Kitchen, Dishwashing, House Help).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Worker Payout Rate (INR / Hour)*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min={50}
                      max={800}
                      value={workerPayoutInput}
                      onChange={(e) => setWorkerPayoutInput(Number(e.target.value))}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 pl-8 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#0C6266]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Remaining {(hourlyRateInput - workerPayoutInput)} INR/hr is Osmida platform margin.
                  </span>
                </div>
              </div>

              {/* Service Areas & Coverage Management */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#38B2AC]" />
                      <h4 className="text-xs font-black uppercase text-slate-200">
                        Nellore Service Locations &amp; Coverage Zones
                      </h4>
                      <span className="rounded-full bg-[#0C6266]/40 border border-[#0C6266] px-2 py-0.5 text-[10px] font-bold text-[#E68A00]">
                        {zones.length} Active Localities
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Add, rename, or remove service coverage colonies. Updates reflect instantaneously across the customer header, booking flow, Google Maps selector, and worker dispatch.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetZones}
                    title="Restore standard 14 Nellore coverage hubs"
                    className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-slate-300 hover:text-white hover:border-slate-500 transition cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Defaults</span>
                  </button>
                </div>

                {zoneActionMsg && (
                  <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-2.5 text-xs font-bold text-emerald-300 flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>{zoneActionMsg}</span>
                  </div>
                )}

                {/* Add New Location Input */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Add Nellore colony, apartment or area (e.g. Kavali Road)..."
                      value={newZoneInput}
                      onChange={(e) => setNewZoneInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddZone();
                        }
                      }}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0C6266]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddZone()}
                    className="bg-[#E68A00] hover:bg-[#CC7A00] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-sm"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Location</span>
                  </button>
                </div>

                {/* Quick-add suggested Nellore colonies */}
                {(() => {
                  const suggestions = [
                    "Muthukur Road",
                    "Kavali Road",
                    "Nawabpet",
                    "Current Office Area",
                    "Gandhi Nagar",
                    "Kothur",
                    "AC Nagar",
                    "Padmavathi Nagar",
                    "Santhapet",
                    "Mulapet",
                  ].filter((s) => !zones.some((z) => z.toLowerCase() === s.toLowerCase()));

                  if (suggestions.length === 0) return null;

                  return (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">
                        Quick Add Popular Nellore Colonies:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {suggestions.slice(0, 6).map((suggested) => (
                          <button
                            key={suggested}
                            type="button"
                            onClick={() => handleAddZone(suggested)}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-2 py-0.5 text-[10px] font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                          >
                            <Plus className="h-2.5 w-2.5 text-[#38B2AC]" />
                            <span>{suggested}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Search Bar for Locations */}
                <div className="relative pt-1">
                  <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder={`Filter or search ${zones.length} active service locations...`}
                    value={zoneSearchQuery}
                    onChange={(e) => setZoneSearchQuery(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/80 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
                  />
                </div>

                {/* Locations Grid with Inline Edit and Delete */}
                <div className="flex flex-wrap gap-2 pt-1 max-h-72 overflow-y-auto pr-1">
                  {zones
                    .filter((z) =>
                      zoneSearchQuery
                        ? z.toLowerCase().includes(zoneSearchQuery.toLowerCase())
                        : true
                    )
                    .map((z) => {
                      const isEditing = editingZone?.original === z;

                      if (isEditing) {
                        return (
                          <div
                            key={z}
                            className="flex items-center gap-1.5 rounded-xl bg-slate-800 border border-[#0C6266] p-1 shadow-lg"
                          >
                            <input
                              type="text"
                              autoFocus
                              value={editingZone.current}
                              onChange={(e) =>
                                setEditingZone({ ...editingZone, current: e.target.value })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSaveEditZone();
                                } else if (e.key === "Escape") {
                                  setEditingZone(null);
                                }
                              }}
                              className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white focus:outline-none focus:border-[#38B2AC] min-w-[140px]"
                            />
                            <button
                              type="button"
                              onClick={handleSaveEditZone}
                              title="Save Changes"
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white p-1 text-xs transition cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingZone(null)}
                              title="Cancel"
                              className="rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 p-1 text-xs transition cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={z}
                          className="group flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 text-xs text-slate-200 hover:border-slate-600 transition"
                        >
                          <MapPin className="h-3 w-3 text-[#38B2AC] shrink-0" />
                          <span className="font-semibold">{z}</span>

                          <div className="flex items-center gap-1 pl-1 border-l border-slate-700/60 ml-0.5">
                            <button
                              type="button"
                              onClick={() => handleStartEditZone(z)}
                              title={`Edit / Rename "${z}"`}
                              className="text-slate-400 hover:text-[#38B2AC] p-0.5 rounded transition cursor-pointer"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveZone(z)}
                              title={`Remove "${z}" from active service areas`}
                              className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#E68A00] hover:bg-[#CC7A00] text-white font-black p-3.5 text-xs sm:text-sm transition shadow-lg shadow-[#0C6266]/20"
              >
                Save Settings & Deploy Live Pricing
              </button>
            </form>
          </div>
        )}
      </div>

      {/* BEFORE & AFTER PHOTO QUALITY AUDIT MODAL */}
      {inspectingPhotos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-black text-white">Work Proof Photo Quality Audit</h3>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {inspectingPhotos.referenceId} • {inspectingPhotos.serviceName}
                </p>
              </div>
              <button
                onClick={() => setInspectingPhotos(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Customer</span>
                  <span className="text-white font-bold">{inspectingPhotos.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Assigned Technician</span>
                  <span className="text-white font-bold">{inspectingPhotos.workerName}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-amber-400">1. BEFORE WORK PHOTO</span>
                    <span className="text-slate-500 text-[10px]">Site Arrival</span>
                  </div>
                  <div className="aspect-4/3 rounded-2xl overflow-hidden border border-slate-800 bg-black relative group">
                    <img
                      src={inspectingPhotos.beforePhotoUrl}
                      alt="Before work"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-emerald-400">2. AFTER WORK PHOTO</span>
                    <span className="text-slate-500 text-[10px]">End OTP Verified</span>
                  </div>
                  <div className="aspect-4/3 rounded-2xl overflow-hidden border border-slate-800 bg-black relative group">
                    <img
                      src={inspectingPhotos.afterPhotoUrl}
                      alt="After work"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Service completed with validated 4-digit Customer End OTP</span>
                </div>
                <span className="font-bold bg-emerald-500/20 px-2 py-0.5 rounded text-[10px]">Quality Verified</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-2">
              <button
                onClick={() => setInspectingPhotos(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Quality audit verified for ${inspectingPhotos.referenceId}. Work approved.`);
                  setInspectingPhotos(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Quality & Confirm Escrow</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
