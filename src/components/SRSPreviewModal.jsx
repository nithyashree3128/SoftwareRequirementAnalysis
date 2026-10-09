import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  X, 
  Layers, 
  Table, 
  ShieldCheck, 
  Code,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { generateSRSMarkdown } from '../engine/srsGenerator';

export function SRSPreviewModal({
  isOpen,
  onClose,
  project,
  requirements,
  currentSession
}) {
  const [activeTab, setActiveTab] = useState("document");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = generateSRSMarkdown(project, requirements, currentSession);

  const activeReqs = requirements.filter(r => r.status !== "Rejected");
  const functionalReqs = activeReqs.filter(r => r.category === "Functional");
  const nonFunctionalReqs = activeReqs.filter(r => r.category !== "Functional");
  const rejectedReqs = requirements.filter(r => r.status === "Rejected");

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = (project.name || "Specification").replace(/[^a-z0-9_-]/gi, "_");
    link.href = url;
    link.download = `SRS_${safeName}_IEEE830.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const payload = {
      project,
      requirements,
      generatedAt: new Date().toISOString(),
      standards: "IEEE 830-1998 / ISO 29148:2018",
      author: currentSession
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(project.name || "Project").replace(/[^a-z0-9_-]/gi, "_")}_ReqLens_Spec.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-500" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Software Requirements Specification (SRS)
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  IEEE 830 / ISO 29148
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {project.name} • {activeReqs.length} Approved Specifications Baseline
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium transition"
              title="Copy Markdown specification"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? "Copied!" : "Copy MD"}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium transition"
              title="Download Markdown file"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download .md</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
              title="Print document or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("document")}
              className={`py-2.5 px-3 border-b-2 font-medium transition ${
                activeTab === "document"
                  ? "border-emerald-500 text-white font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Formal Document View
            </button>

            <button
              onClick={() => setActiveTab("rtm")}
              className={`py-2.5 px-3 border-b-2 font-medium transition ${
                activeTab === "rtm"
                  ? "border-emerald-500 text-white font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Traceability Matrix (RTM)
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`py-2.5 px-3 border-b-2 font-medium transition ${
                activeTab === "audit"
                  ? "border-emerald-500 text-white font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Explainability Audit Trail
            </button>

            <button
              onClick={() => setActiveTab("markdown")}
              className={`py-2.5 px-3 border-b-2 font-medium transition ${
                activeTab === "markdown"
                  ? "border-emerald-500 text-white font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Markdown Source
            </button>
          </div>

          <button
            onClick={handleDownloadJSON}
            className="text-[11px] text-slate-400 hover:text-indigo-300 font-mono flex items-center gap-1"
          >
            <span>Export JSON</span>
            <Download className="w-3 h-3" />
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-950/80">
          {/* TAB 1: FORMAL DOCUMENT VIEW */}
          {activeTab === "document" && (
            <div className="srs-printable-doc max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 sm:p-12 shadow-xl text-slate-200 space-y-8 font-sans">
              {/* Cover Header */}
              <div className="border-b-2 border-indigo-500/40 pb-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                      Formal Engineering Baseline
                    </span>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                      Software Requirements Specification
                    </h1>
                    <div className="text-lg font-semibold text-indigo-300 mt-1">
                      Project: {project.name}
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono text-slate-400 space-y-1">
                    <div>Ref: SRS-REQ-{new Date().getFullYear()}-001</div>
                    <div>Version: 1.0.0 (Approved)</div>
                    <div>Date: {currentDate}</div>
                    <div className="text-emerald-400 font-bold">STATUS: BASELINE APPROVED</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Domain Vertical</span>
                    <span className="font-semibold text-white uppercase">{project.domain || "Enterprise"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Lead Author</span>
                    <span className="font-semibold text-white">{currentSession?.name || "ReqLens Lead"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Target Stack</span>
                    <span className="font-semibold text-white truncate block">{project.techStack || "Cloud Microservices"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Standard</span>
                    <span className="font-semibold text-emerald-400">IEEE 830 / ISO 29148</span>
                  </div>
                </div>
              </div>

              {/* 1. INTRODUCTION */}
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
                  1. Introduction
                </h2>
                <div className="space-y-2 text-sm leading-relaxed text-slate-300">
                  <p>
                    <strong className="text-white">1.1 Purpose:</strong> This document specifies the binding software requirements for <strong>{project.name}</strong>. All criteria adhere to RFC 2119 keyword semantics (SHALL, SHOULD, MAY) and have been formally refined to ensure zero ambiguous buzzwords.
                  </p>
                  <p>
                    <strong className="text-white">1.2 Intended Audience:</strong> Software Engineers, QA Automation Teams, Solution Architects, Product Managers, and Client Executive Sponsors.
                  </p>
                  <p>
                    <strong className="text-white">1.3 Target Audience & Scope:</strong> {project.targetAudience || "Enterprise users requiring high-availability system operations"}.
                  </p>
                </div>
              </section>

              {/* 2. STAKEHOLDERS & CONSTRAINTS */}
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
                  2. Stakeholders & Business Rules
                </h2>
                <div className="space-y-2 text-sm leading-relaxed text-slate-300">
                  <p>
                    <strong className="text-white">2.1 Operating Environment:</strong> {project.techStack || "Docker containers managed via Kubernetes cluster with distributed PostgreSQL"}.
                  </p>
                  <p>
                    <strong className="text-white">2.2 System Constraints:</strong> System must maintain 99.9% uptime SLA and restrict API payload access strictly through TLS 1.3 encrypted endpoints.
                  </p>
                </div>
              </section>

              {/* 3. FUNCTIONAL REQUIREMENTS */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
                  3. Functional Requirements
                </h2>
                {functionalReqs.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No functional requirements in current baseline.</p>
                ) : (
                  <div className="space-y-3">
                    {functionalReqs.map((req) => (
                      <div key={req.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs sm:text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-emerald-400">
                            [{req.id}] {req.title}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono uppercase">
                            {req.moscow || "Must Have"}
                          </span>
                        </div>
                        <p className="text-white font-medium">{req.refinedText}</p>
                        <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                          <span>Verification: {req.verificationMethod}</span>
                          <span className="font-mono text-emerald-400/90">{req.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* 4. NON-FUNCTIONAL REQUIREMENTS */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
                  4. Non-Functional Requirements (Performance, Security, Reliability)
                </h2>
                <div className="space-y-3">
                  {nonFunctionalReqs.map((req) => (
                    <div key={req.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-400">
                            [{req.id}] {req.title}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {req.category}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono uppercase">
                          {req.moscow || "Must Have"}
                        </span>
                      </div>
                      <p className="text-white font-medium">{req.refinedText}</p>
                      <div className="text-[11px] text-slate-400 pt-1 flex flex-wrap items-center justify-between gap-2">
                        <span>Standard: {req.standards || "IEEE 830 Non-Functional"}</span>
                        <span className="font-mono text-slate-400">Method: {req.verificationMethod}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. USE CASES */}
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
                  5. Use Cases & System Constraints
                </h2>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm space-y-2 text-slate-300">
                  <div className="font-bold text-white">UC-01: Baseline High-Concurrency Transaction Execution</div>
                  <p><strong>Actor:</strong> Authenticated Client / System Gateway</p>
                  <p><strong>Main Success Scenario:</strong> Client sends payload &rarr; System validates idempotency token in &lt; 50ms &rarr; Performs ACID state change &rarr; Emits status HTTP 200 within SLA threshold.</p>
                  <p><strong>Failure Handling:</strong> Failed logins trigger exponential backoff. 5 consecutive failures immediately lock account for 15 minutes.</p>
                </div>
              </section>

              {/* 6. SIGN-OFF BLOCK */}
              <section className="pt-8 border-t-2 border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase font-mono mb-4">
                  Stakeholder Approvals & Baselined Sign-off
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block uppercase font-mono">Lead Requirement Engineer</span>
                    <span className="text-white font-bold block">{currentSession?.name || "Alex Chen"}</span>
                    <span className="text-emerald-400 font-mono text-[10px]">✓ Digitally Certified (ReqLens)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block uppercase font-mono">Product Delivery Lead</span>
                    <span className="text-white font-bold block">PMO Representative</span>
                    <span className="text-emerald-400 font-mono text-[10px]">✓ Approved for Sprint Cycle</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block uppercase font-mono">Client Executive Sponsor</span>
                    <span className="text-white font-bold block">Authorized Stakeholder</span>
                    <span className="text-emerald-400 font-mono text-[10px]">✓ Acceptance Signed</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: REQUIREMENT TRACEABILITY MATRIX (RTM) */}
          {activeTab === "rtm" && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Requirement Traceability Matrix (RTM)</h3>
                <p className="text-xs text-slate-400">
                  Guarantees forward and backward traceability from raw customer origin to verification test harness.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 border-b border-slate-800 uppercase font-mono text-[10px] text-slate-400">
                    <tr>
                      <th className="px-3.5 py-3">Req ID</th>
                      <th className="px-3.5 py-3">Category</th>
                      <th className="px-3.5 py-3">MoSCoW</th>
                      <th className="px-3.5 py-3">Verification Method</th>
                      <th className="px-3.5 py-3">Source Origin</th>
                      <th className="px-3.5 py-3">Baseline Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950/60 font-mono">
                    {activeReqs.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-900/60 transition">
                        <td className="px-3.5 py-2.5 font-bold text-white">{req.id}</td>
                        <td className="px-3.5 py-2.5 text-slate-300">{req.category}</td>
                        <td className="px-3.5 py-2.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                            {req.moscow || "Must"}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-400 font-sans text-xs">
                          {req.verificationMethod || "Automated QA"}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-400 text-[11px]">{req.source}</td>
                        <td className="px-3.5 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === "Accepted"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : req.status === "Modified"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          }`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EXPLAINABILITY AUDIT TRAIL */}
          {activeTab === "audit" && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Explainability & Decision Audit Report</h3>
                <p className="text-xs text-slate-400">
                  Comprehensive audit trail documenting why each requirement was modified, accepted, rejected, or injected.
                </p>
              </div>

              <div className="space-y-3">
                {requirements.map((req) => (
                  <div key={req.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{req.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === "Accepted"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : req.status === "Modified"
                            ? "bg-amber-500/15 text-amber-300"
                            : req.status === "Rejected"
                            ? "bg-rose-500/15 text-rose-300"
                            : "bg-indigo-500/15 text-indigo-300"
                        }`}>
                          {req.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{req.standards || "IEEE 830"}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                        <span className="text-[10px] text-slate-400 font-mono block mb-1">Customer Verbatim:</span>
                        <span className="text-slate-300 italic">"{req.originalText}"</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                        <span className="text-[10px] text-emerald-400 font-mono block mb-1">Engineered Output:</span>
                        <span className="text-white font-medium">{req.refinedText}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase font-mono block mb-0.5">Engineering Rationale:</span>
                      {req.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MARKDOWN SOURCE */}
          {activeTab === "markdown" && (
            <div className="max-w-4xl mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Raw GitHub Flavored Markdown (GFM)</span>
                <button
                  onClick={handleCopyMarkdown}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied to Clipboard!" : "Copy All Markdown"}</span>
                </button>
              </div>
              <pre className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-indigo-500/30">
                {markdownContent}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
