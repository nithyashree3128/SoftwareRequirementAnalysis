import React, { useState } from 'react';
import { Settings, Plus, Trash2, X, RotateCcw, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { ambiguityDictionary as defaultDict } from '../data/ambiguityDictionary';

export function RulesManagerModal({
  isOpen,
  onClose,
  customRules = [],
  onAddRule,
  onDeleteRule,
  onResetRules
}) {
  const [newTerm, setNewTerm] = useState("");
  const [newCategory, setNewCategory] = useState("Performance");
  const [newFlaw, setNewFlaw] = useState("");
  const [newReplacement, setNewReplacement] = useState("");
  const [newMetric, setNewMetric] = useState("");

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTerm.trim() || !newReplacement.trim()) return;

    const rule = {
      term: newTerm.trim().toLowerCase(),
      regex: new RegExp(`\\b(${newTerm.trim()})\\b`, "gi"),
      category: newCategory,
      flaw: newFlaw.trim() || `Subjective term '${newTerm}' lacks quantifiable specification.`,
      suggestedReplacement: newReplacement.trim(),
      metric: newMetric.trim() || "Custom SLA Boundary",
      standardRef: "Custom Enterprise Standard",
      reason: "Custom rule enforced by requirement engineering policy.",
      verificationMethod: "Automated custom assertion"
    };

    onAddRule(rule);
    setNewTerm("");
    setNewFlaw("");
    setNewReplacement("");
    setNewMetric("");
  };

  const allRules = [...customRules, ...defaultDict];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-500" />

        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Ambiguity Dictionary & Validation Rules
              </h2>
              <p className="text-xs text-slate-400">
                Manage buzzwords, measurable metric mappings, and custom enterprise validation patterns
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Add Custom Rule Form */}
          <form onSubmit={handleAdd} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Custom Ambiguity Buzzword Rule</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Persisted in LocalStorage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Ambiguous Buzzword
                </label>
                <input
                  type="text"
                  required
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="e.g. snappy, slick, enterprise-grade"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Performance">Performance</option>
                  <option value="Security">Security</option>
                  <option value="Reliability">Reliability</option>
                  <option value="Usability">Usability</option>
                  <option value="Scalability">Scalability</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Target Metric SLA
                </label>
                <input
                  type="text"
                  value={newMetric}
                  onChange={(e) => setNewMetric(e.target.value)}
                  placeholder="e.g. Latency <= 200ms"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Refined IEEE 830 Replacement ("The system shall...")
              </label>
              <input
                type="text"
                required
                value={newReplacement}
                onChange={(e) => setNewReplacement(e.target.value)}
                placeholder="The system shall execute operations within 200 milliseconds under normal load."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition"
              >
                + Register Rule
              </button>
            </div>
          </form>

          {/* Active Rules List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Active Ambiguity Dictionary ({allRules.length} Entries)</span>
              </h3>

              {customRules.length > 0 && (
                <button
                  onClick={onResetRules}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Custom Rules</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allRules.map((rule, idx) => {
                const isCustom = idx < customRules.length;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs text-slate-300 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          "{rule.term}"
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {rule.category}
                        </span>
                      </div>

                      {isCustom ? (
                        <button
                          onClick={() => onDeleteRule(idx)}
                          className="text-rose-400 hover:text-rose-300 p-1 rounded"
                          title="Delete Custom Rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          Built-in
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-emerald-400 font-mono line-clamp-2">
                      &gt; {rule.metric || rule.suggestedReplacement}
                    </div>

                    <div className="text-[10px] text-slate-400 line-clamp-1">
                      {rule.reason}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
