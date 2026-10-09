import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  PlusCircle, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  RotateCcw, 
  ShieldCheck, 
  Code, 
  Briefcase, 
  User, 
  ArrowRight,
  Info,
  Check,
  X,
  ExternalLink
} from 'lucide-react';

export function RequirementCard({
  requirement,
  currentRole,
  onAccept,
  onEdit,
  onReject,
  onRestore
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    id,
    title,
    source,
    status,
    category,
    moscow,
    originalText,
    refinedText,
    changeSummary,
    reason,
    standards,
    detectedFlaws = [],
    verificationMethod,
    diff = {},
    testabilityScore = 90
  } = requirement;

  // Status Styling Configuration
  const statusConfig = {
    Accepted: {
      badgeBg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
      cardBorder: "border-slate-800 hover:border-emerald-500/40",
      indicator: "bg-emerald-500",
      icon: CheckCircle2,
      label: "Accepted"
    },
    Modified: {
      badgeBg: "bg-amber-500/15 border-amber-500/40 text-amber-300",
      cardBorder: "border-slate-800 hover:border-amber-500/40",
      indicator: "bg-amber-500",
      icon: AlertTriangle,
      label: "Modified"
    },
    Rejected: {
      badgeBg: "bg-rose-500/15 border-rose-500/40 text-rose-300",
      cardBorder: "border-slate-800/80 hover:border-rose-500/40 opacity-75 hover:opacity-100",
      indicator: "bg-rose-500",
      icon: XCircle,
      label: "Rejected"
    },
    Suggested: {
      badgeBg: "bg-indigo-500/15 border-indigo-500/40 text-indigo-300",
      cardBorder: "border-slate-800 hover:border-indigo-500/40",
      indicator: "bg-indigo-500",
      icon: PlusCircle,
      label: "Suggested"
    }
  };

  const currentStatusConfig = statusConfig[status] || statusConfig.Modified;
  const StatusIcon = currentStatusConfig.icon;

  // Category Colors
  const categoryColors = {
    Performance: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Security: "bg-red-500/10 text-red-400 border-red-500/20",
    Reliability: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Usability: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Functional: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Compliance: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Scalability: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    "Out of Scope": "bg-slate-700/40 text-slate-400 border-slate-700"
  };

  const catColor = categoryColors[category] || "bg-slate-800 text-slate-300 border-slate-700";

  return (
    <div className={`relative bg-slate-900/90 border rounded-2xl p-5 sm:p-6 transition-all shadow-md hover:shadow-xl ${currentStatusConfig.cardBorder}`}>
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Left: ID & Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="font-mono text-sm font-black text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
            {id}
          </span>

          {/* Status Badge */}
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${currentStatusConfig.badgeBg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{currentStatusConfig.label}</span>
          </span>

          {/* Category Badge */}
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${catColor}`}>
            {category}
          </span>

          {/* MoSCoW Badge */}
          {moscow && (
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/80">
              {moscow}
            </span>
          )}
        </div>

        {/* Right: Source & Score */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-slate-500">Source:</span>
            <span className={`font-medium ${source.includes("AI") ? "text-indigo-400 font-mono" : "text-slate-300"}`}>
              {source}
            </span>
          </span>

          {testabilityScore > 0 && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Verifiability Score">
              {testabilityScore}% Testable
            </span>
          )}
        </div>
      </div>

      {/* Main Content: Before & After Diff Box */}
      <div className="space-y-3 mb-4">
        {/* Original Customer Verbatim Text */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] uppercase font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              Original Customer Intake
            </span>
            {diff.flaggedWord && status === "Modified" && (
              <span className="text-amber-400/90 text-[10px] font-sans">
                Ambiguity detected: <span className="underline font-mono">"{diff.flaggedWord}"</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-300 italic font-mono leading-relaxed">
            "{originalText}"
          </p>
        </div>

        {/* Proposed Refined Formal Specification */}
        <div className={`p-3.5 rounded-xl border ${
          status === "Accepted" 
            ? "bg-emerald-950/20 border-emerald-500/30" 
            : status === "Suggested" 
            ? "bg-indigo-950/20 border-indigo-500/30" 
            : status === "Rejected"
            ? "bg-rose-950/20 border-rose-500/30"
            : "bg-slate-800/60 border-slate-700/80"
        }`}>
          <div className="flex items-center justify-between text-[11px] uppercase font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Formal IEEE 830 Specification
            </span>
            <span className="text-[10px] text-slate-400 font-mono">RFC 2119 SHALL</span>
          </div>

          <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
            {status === "Rejected" ? (
              <span className="text-rose-400 line-through">{refinedText}</span>
            ) : (
              refinedText
            )}
          </p>
        </div>
      </div>

      {/* Expandable Justification Box ("Why this decision?") */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 text-left transition"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200">
              Why this decision? (Explainable Engineering Justification)
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>{isExpanded ? "Collapse" : "Expand Rationale"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {isExpanded && (
          <div className="mt-2.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5 text-xs text-slate-300 animate-fadeIn">
            {/* 1. What Changed */}
            <div>
              <div className="text-[11px] font-semibold text-amber-400 uppercase font-mono mb-1">
                Engineering Remediation
              </div>
              <p className="text-slate-300 leading-relaxed">{changeSummary}</p>
            </div>

            {/* 2. Formal Reason & Standard */}
            <div>
              <div className="text-[11px] font-semibold text-indigo-400 uppercase font-mono mb-1">
                IEEE / ISO Standard Rationale
              </div>
              <p className="text-slate-300 leading-relaxed">{reason}</p>
              {standards && (
                <div className="mt-1 text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <span>Reference:</span>
                  <span className="text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {standards}
                  </span>
                </div>
              )}
            </div>

            {/* 3. QA Verification Method */}
            {verificationMethod && (
              <div>
                <div className="text-[11px] font-semibold text-emerald-400 uppercase font-mono mb-1">
                  Acceptance & Verification Harness
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
                  {verificationMethod}
                </div>
              </div>
            )}

            {/* 4. Role-Specific Tailored Lens */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] uppercase font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Tailored Stakeholder Lens ({currentRole?.toUpperCase() || 'DEVELOPER'})</span>
              </div>

              {currentRole === "developer" && (
                <p className="text-[11px] text-cyan-300/90 leading-relaxed font-mono">
                  &gt; Tech Constraint: Ensures verifiable SLA metric for QA load automation and eliminates non-deterministic acceptance criteria.
                </p>
              )}

              {currentRole === "product_manager" && (
                <p className="text-[11px] text-purple-300/90 leading-relaxed font-mono">
                  &gt; PM Scope: Protects sprint delivery by preventing scope creep. Classifies item under MoSCoW for milestone sign-off.
                </p>
              )}

              {currentRole === "client" && (
                <p className="text-[11px] text-emerald-300/90 leading-relaxed font-mono">
                  &gt; Client Guarantee: Translates vague sales jargon into clear contractual deliverables so you know exactly what is built.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Accept / Approve Button */}
          {status !== "Accepted" && (
            <button
              type="button"
              onClick={() => onAccept(id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept Refinement</span>
            </button>
          )}

          {/* Edit Text Button */}
          <button
            type="button"
            onClick={() => onEdit(requirement)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Text</span>
          </button>

          {/* Reject Button */}
          {status !== "Rejected" && (
            <button
              type="button"
              onClick={() => onReject(id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
          )}

          {/* Restore Original */}
          {status === "Modified" && (
            <button
              type="button"
              onClick={() => onRestore(id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-300 text-xs transition"
              title="Revert back to verbatim raw customer text"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore Raw</span>
            </button>
          )}
        </div>

        {status === "Accepted" && (
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved for SRS</span>
          </span>
        )}
      </div>
    </div>
  );
}
