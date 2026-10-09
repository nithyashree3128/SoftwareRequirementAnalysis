import React from 'react';
import { Gauge, CheckCircle2, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';

export function QualityScoreGauge({ stats, requirements = [] }) {
  const { qualityScore = 0, ambiguityReduction = 0, total = 0, accepted = 0, modified = 0, rejected = 0, suggested = 0 } = stats || {};

  // Score color thresholds
  let scoreColor = "text-emerald-400";
  let strokeColor = "#10b981"; // emerald
  let statusBadge = "IEEE 830 Compliant";

  if (qualityScore < 60) {
    scoreColor = "text-rose-400";
    strokeColor = "#f43f5e";
    statusBadge = "Critical Ambiguities";
  } else if (qualityScore < 85) {
    scoreColor = "text-amber-400";
    strokeColor = "#f59e0b";
    statusBadge = "Moderate Clarity";
  }

  // Circular gauge math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (qualityScore / 100) * circumference;

  const mustHaves = requirements.filter(r => r.moscow === "Must Have").length;
  const shouldHaves = requirements.filter(r => r.moscow === "Should Have").length;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Testability Health Index</h3>
            <p className="text-[11px] text-slate-400">ISO 29148 Verifiability & Metric Precision</p>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          qualityScore >= 85 
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            : qualityScore >= 60 
            ? "bg-amber-500/10 text-amber-400 border-amber-500/30" 
            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
        }`}>
          {statusBadge}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Gauge Visual */}
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-24 h-24 -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="#1e293b"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke={strokeColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${scoreColor} leading-none tracking-tight`}>
                {qualityScore}%
              </span>
              <span className="text-[9px] uppercase font-mono text-slate-400 mt-1">Score</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-white">{ambiguityReduction}%</span> Ambiguity Resolved
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              All active statements mapped to quantitative thresholds and QA verification hooks.
            </p>
          </div>
        </div>

        {/* Breakdown Pills */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Must Have</div>
            <div className="text-sm font-bold text-white mt-0.5">{mustHaves} Items</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Should Have</div>
            <div className="text-sm font-bold text-white mt-0.5">{shouldHaves} Items</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Active Scope</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{accepted + modified + suggested} Reqs</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Excluded</div>
            <div className="text-sm font-bold text-rose-400 mt-0.5">{rejected} Reqs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
