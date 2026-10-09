import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, Check, X, Shield, Plus, Edit2 } from 'lucide-react';
import { ambiguityDictionary } from '../data/ambiguityDictionary';

export function RequirementModal({
  isOpen,
  onClose,
  onSave,
  initialRequirement = null,
  nextReqId = "REQ-99"
}) {
  const [title, setTitle] = useState("");
  const [refinedText, setRefinedText] = useState("");
  const [category, setCategory] = useState("Functional");
  const [moscow, setMoscow] = useState("Must Have");
  const [reason, setReason] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("");
  const [detectedAmbiguities, setDetectedAmbiguities] = useState([]);

  useEffect(() => {
    if (initialRequirement) {
      setTitle(initialRequirement.title || "");
      setRefinedText(initialRequirement.refinedText || initialRequirement.originalText || "");
      setCategory(initialRequirement.category || "Functional");
      setMoscow(initialRequirement.moscow || "Must Have");
      setReason(initialRequirement.reason || "");
      setVerificationMethod(initialRequirement.verificationMethod || "");
    } else {
      setTitle("");
      setRefinedText("The system shall ");
      setCategory("Functional");
      setMoscow("Must Have");
      setReason("Essential system requirement aligned with architecture baseline.");
      setVerificationMethod("Automated integration test asserting deterministic response");
    }
  }, [initialRequirement, isOpen]);

  // Real-time ambiguity checking as user types
  useEffect(() => {
    if (!refinedText) {
      setDetectedAmbiguities([]);
      return;
    }
    const found = [];
    for (const dict of ambiguityDictionary) {
      if (dict.regex && dict.regex.test(refinedText)) {
        found.push(dict);
      }
    }
    setDetectedAmbiguities(found);
  }, [refinedText]);

  if (!isOpen) return null;

  const handleApplySuggestion = (suggestion) => {
    setRefinedText(suggestion.suggestedReplacement);
    setCategory(suggestion.category);
    setReason(suggestion.reason);
    setVerificationMethod(suggestion.verificationMethod);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!refinedText.trim()) return;

    const savedData = {
      id: initialRequirement ? initialRequirement.id : nextReqId,
      title: title.trim() || `Specification ${initialRequirement ? initialRequirement.id : nextReqId}`,
      source: initialRequirement ? initialRequirement.source : "User Custom Entry",
      status: initialRequirement ? initialRequirement.status : "Accepted",
      category,
      moscow,
      originalText: initialRequirement ? initialRequirement.originalText : refinedText.trim(),
      refinedText: refinedText.trim(),
      changeSummary: initialRequirement ? "User manually edited specification." : "User created custom requirement.",
      reason: reason.trim() || "Requirement mandated by project engineering standards.",
      standards: initialRequirement?.standards || "IEEE 830 / ISO 29148",
      verificationMethod: verificationMethod.trim() || "Automated end-to-end integration test",
      testabilityScore: detectedAmbiguities.length > 0 ? 75 : 98,
      diff: {
        flaggedWord: detectedAmbiguities.map(a => a.term).join(", "),
        replacement: refinedText.trim()
      }
    };

    onSave(savedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 max-h-[90vh] flex flex-col">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-500" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              {initialRequirement ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {initialRequirement ? `Edit Requirement [${initialRequirement.id}]` : "Add Custom Requirement"}
              </h2>
              <p className="text-xs text-slate-400">
                Craft precise, testable IEEE 830 specifications with real-time ambiguity feedback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 py-4 pr-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Requirement Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Account Lockout & Authentication Throttling"
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Specification Text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Formal Specification (IEEE 830 / RFC 2119 SHALL)
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                Must be testable & quantifiable
              </span>
            </div>
            <textarea
              rows={3}
              required
              value={refinedText}
              onChange={(e) => setRefinedText(e.target.value)}
              placeholder="The system shall..."
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono transition"
            />
          </div>

          {/* Live Ambiguity Warning Banner */}
          {detectedAmbiguities.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Live Ambiguity Warning: Detected vague terms ({detectedAmbiguities.map(a => `"${a.term}"`).join(", ")})</span>
              </div>
              <p className="text-xs text-slate-300">
                {detectedAmbiguities[0].flaw}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-amber-500/20">
                <span className="text-[11px] text-slate-400 font-mono">
                  Recommended Metric: <span className="text-amber-300">{detectedAmbiguities[0].metric}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleApplySuggestion(detectedAmbiguities[0])}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold transition"
                >
                  ⚡ Apply Metric
                </button>
              </div>
            </div>
          )}

          {/* Metadata Row: Category & MoSCoW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Functional">Functional</option>
                <option value="Performance">Performance (Latency / Concurrency)</option>
                <option value="Security">Security (Authentication / Cryptography)</option>
                <option value="Reliability">Reliability (Uptime / Failover)</option>
                <option value="Usability">Usability (WCAG / Accessibility)</option>
                <option value="Compliance">Compliance (HIPAA / PCI-DSS / GDPR)</option>
                <option value="Scalability">Scalability (Throughput)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                MoSCoW Prioritization
              </label>
              <select
                value={moscow}
                onChange={(e) => setMoscow(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Must Have">Must Have (Critical Path)</option>
                <option value="Should Have">Should Have (High Value)</option>
                <option value="Could Have">Could Have (Desirable)</option>
                <option value="Won't Have">Won't Have (Deferred)</option>
              </select>
            </div>
          </div>

          {/* Verification Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              QA Verification & Acceptance Method
            </label>
            <input
              type="text"
              value={verificationMethod}
              onChange={(e) => setVerificationMethod(e.target.value)}
              placeholder="e.g. Automated load test measuring p95 response time <= 3s"
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono transition"
            />
          </div>

          {/* Justification / Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Engineering Rationale / Justification
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this requirement is structured this way and cite standard..."
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-500/20 transition-all"
            >
              {initialRequirement ? "Update Specification" : "Add to Specification Baseline"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
