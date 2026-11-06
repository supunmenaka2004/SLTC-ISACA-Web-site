"use client";

import { useEffect, useState } from "react";
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Layers,
} from "lucide-react";
import { AuditLog } from "@/server/db/schema";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/audit");
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.error("Load audit error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesAction = selectedAction === "ALL" || log.action === selectedAction;
    const matchesQuery =
      !searchQuery.trim() ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof log.details === "string" && log.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAction && matchesQuery;
  });

  const uniqueActions = ["ALL", ...Array.from(new Set(logs.map((l) => l.action)))];

  const getActionBadgeColor = (act: string) => {
    if (act.includes("PUBLISH")) return "bg-cyan-950 text-cyan-300 border-cyan-500/40";
    if (act.includes("CREATE")) return "bg-emerald-950 text-emerald-300 border-emerald-500/40";
    if (act.includes("UPDATE")) return "bg-blue-950 text-blue-300 border-blue-500/40";
    if (act.includes("DELETE") || act.includes("REJECT")) return "bg-rose-950 text-rose-300 border-rose-500/40";
    return "bg-slate-800 text-slate-300 border-slate-700";
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>IMMUTABLE AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            System Activity &amp; Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tamper-proof record of all administrative logins, content modifications, theme releases, and editorial approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#090f1d] border border-slate-800 text-slate-400">
            Total Logged Events: <strong className="text-cyan-400">{logs.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by administrator, action, or payload..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#030712] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Action Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Action:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="bg-[#030712] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {uniqueActions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#090f1d] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0d1527] border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Administrator</th>
                <th className="px-4 py-3.5">Action Executed</th>
                <th className="px-4 py-3.5">Resource Target</th>
                <th className="px-5 py-3.5">Change Telemetry &amp; Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{log.userName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.userRole}</div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase border tracking-wider ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap font-mono text-cyan-400 text-xs">
                      {log.resource}
                    </td>

                    <td className="px-5 py-4 max-w-md">
                      <div className="text-xs text-slate-300 font-mono bg-[#030712] p-2 rounded border border-slate-800/80 line-clamp-2">
                        {typeof log.details === "string" ? log.details : JSON.stringify(log.details)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No audit records found matching the filter query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
