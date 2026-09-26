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
} from "lucide-react";
import { OSMIDA_SERVICES, DEFAULT_APP_SETTINGS } from "@/lib/osmidaServices";

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
  const [settingsSavedMsg, setSettingsSavedMsg] = useState("");

  const [isLoading, setIsLoading] = useState(false);

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

      // 4. Fetch settings
      const sRes = await fetch("/api/settings");
      const sData = await sRes.json();
      if (sData.success && sData.settings) {
        setHourlyRateInput(Number(sData.settings.hourly_rate) || 199);
        setWorkerPayoutInput(Number(sData.settings.worker_payout_rate) || 140);
        if (Array.isArray(sData.settings.service_zones)) {
          setZones(sData.settings.service_zones);
        }
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
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hourly_rate: Number(hourlyRateInput),
          worker_payout_rate: Number(workerPayoutInput),
          service_zones: zones,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSavedMsg("Settings updated successfully! Customers and workers now see updated pricing.");
        setTimeout(() => setSettingsSavedMsg(""), 4000);
      }
    } catch (err) {
      console.error("Save settings error:", err);
    }
  };

  const handleAddZone = () => {
    if (!newZoneInput.trim() || zones.includes(newZoneInput.trim())) return;
    setZones((prev) => [...prev, newZoneInput.trim()]);
    setNewZoneInput("");
  };

  const handleRemoveZone = (zone: string) => {
    setZones((prev) => prev.filter((z) => z !== zone));
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter !== "all" && b.status !== bookingFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.reference_id?.toLowerCase().includes(q) ||
        b.customer_name?.toLowerCase().includes(q) ||
        b.phone?.includes(q) ||
        b.locality?.toLowerCase().includes(q)
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
            <div className="relative h-14 w-14 mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-lg flex items-center justify-center">
              <Image src="/icons/icon-192x192.png" alt="Osmida" width={56} height={56} className="object-contain" priority />
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
            <div className="relative h-9 w-9 rounded-xl overflow-hidden border border-white/20 shadow-sm flex items-center justify-center shrink-0">
              <Image src="/icons/icon-192x192.png" alt="Osmida" width={36} height={36} className="object-contain" priority />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wide text-white">OSMIDA ADMIN</span>
                <span className="text-[10px] font-bold bg-[#0C6266]/30 text-[#E68A00] border border-[#0C6266]/50 px-2 py-0.5 rounded-full">
                  Nellore Ops
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Osmida Residential Dispatch • Nellore</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-300 transition"
              title="End Admin Session"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-400" />
              <span>Sign Out</span>
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
                {["all", "pending", "assigned", "in_progress", "completed", "disputed"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilter(st)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition font-bold ${
                      bookingFilter === st
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {st.replace(/_/g, " ")}
                  </button>
                ))}
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
                            <span className="text-white font-bold block">{b.customer_name}</span>
                            <span className="text-[10px] text-slate-400">{b.phone}</span>
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
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide inline-block ${
                                b.status === "completed"
                                  ? "bg-[#0C6266]/30 text-[#E68A00] border border-[#0C6266]/50"
                                  : b.status === "in_progress"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                                  : b.status === "disputed"
                                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3.5">
                            {b.worker_name ? (
                              <div>
                                <span className="text-white font-bold block">{b.worker_name}</span>
                                <span className="text-[10px] text-slate-400">{b.worker_phone}</span>
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
                              className="bg-slate-900 border border-slate-700 text-[11px] rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-[#0C6266]"
                            >
                              <option value="">-- Assign Worker --</option>
                              {availableWorkers.map((w) => (
                                <option key={w.phone} value={w.phone}>
                                  {w.name} ({w.phone})
                                </option>
                              ))}
                            </select>
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
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-black text-white">Worker Payout Ledger</h3>
                <span className="text-xs text-slate-400">Settled via Instant UPI to Workers</span>
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
                          {p.status !== "paid" && (
                            <button
                              onClick={() => handleMarkPayoutPaid(p.id, p.reference_id)}
                              className="rounded-lg bg-[#E68A00] hover:bg-[#CC7A00] text-white px-3 py-1 font-bold text-[11px] transition shadow-xs"
                            >
                              Mark as Paid
                            </button>
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

              {/* Service Areas */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400">Nellore Service Zones</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add Nellore colony / community..."
                    value={newZoneInput}
                    onChange={(e) => setNewZoneInput(e.target.value)}
                    className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0C6266]"
                  />
                  <button
                    type="button"
                    onClick={handleAddZone}
                    className="bg-[#E68A00] hover:bg-[#CC7A00] text-white font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {zones.map((z) => (
                    <span
                      key={z}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1 text-xs text-slate-200"
                    >
                      <span>{z}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveZone(z)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
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
    </div>
  );
}
