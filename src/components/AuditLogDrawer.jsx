import React from 'react';
import { History, X, Shield, Clock, Download, Trash2, ArrowRight } from 'lucide-react';

export function AuditLogDrawer({
  isOpen,
  onClose,
  auditLogs = [],
  onClearLogs
}) {
  if (!isOpen) return null;

  const handleDownloadLogs = () => {
    const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ReqLens_AuditLogs_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Audit Trail & Traceability</h2>
                <p className="text-xs text-slate-400">Chronological Explainability Event Log</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Sub-header */}
          <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">{auditLogs.length} Logged Events</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadLogs}
                disabled={auditLogs.length === 0}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              {auditLogs.length > 0 && (
                <button
                  onClick={onClearLogs}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Log Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No events logged yet. Perform an intake analysis or update requirements to populate the audit stream.
              </div>
            ) : (
              auditLogs.map((log, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs text-slate-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {log.note}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-850 text-[10px] text-slate-400 font-mono">
                    <span>Actor: <span className="text-indigo-300">{log.role}</span></span>
                    {log.reqId && <span>Target: <span className="text-white font-bold">{log.reqId}</span></span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
