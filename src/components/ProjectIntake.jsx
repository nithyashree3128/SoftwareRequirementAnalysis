import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  Play, 
  FileText, 
  ShieldCheck, 
  Activity, 
  ShoppingCart, 
  Cpu, 
  Zap, 
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { sampleProjects } from '../data/sampleProjects';
import { domainTemplates } from '../data/domainTemplates';

export function ProjectIntake({
  initialProject,
  onAnalyze,
  isAnalyzing,
  onLoadPreset
}) {
  const [name, setName] = useState(initialProject?.name || "Nova Core Banking Portal");
  const [domain, setDomain] = useState(initialProject?.domain || "fintech");
  const [targetAudience, setTargetAudience] = useState(initialProject?.targetAudience || "Tier-1 Retail Customers & Ops Engineers");
  const [techStack, setTechStack] = useState(initialProject?.techStack || "React 19, Node.js, PostgreSQL, Redis, AWS ECS");
  const [rawRequirements, setRawRequirements] = useState(initialProject?.rawRequirements || "The system should be fast and secure.");

  const handlePresetSelect = (preset) => {
    setName(preset.name);
    setDomain(preset.domain);
    setTargetAudience(preset.targetAudience);
    setTechStack(preset.techStack);
    setRawRequirements(preset.rawRequirements);
    if (onLoadPreset) {
      onLoadPreset(preset);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setRawRequirements(content);
        if (!name || name === "New Project") {
          setName(file.name.replace(/\.[^/.]+$/, ""));
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rawRequirements.trim()) return;

    onAnalyze({
      id: initialProject?.id || `proj_${Date.now()}`,
      name: name.trim() || "Untitled Requirement Intake",
      domain,
      targetAudience: targetAudience.trim(),
      techStack: techStack.trim(),
      rawRequirements: rawRequirements.trim(),
      updatedAt: new Date().toISOString()
    });
  };

  const activeDomainData = domainTemplates[domain] || domainTemplates.fintech;

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-sm">
      {/* Top Banner: Quick Presets */}
      <div className="mb-6 pb-6 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Instant Intake Presets & Benchmark Evaluation</span>
            </h2>
            <p className="text-xs text-slate-400">
              Select a pre-loaded evaluation case or load customer notes to test Explainable Requirement Engineering.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            Benchmark Rule Ready
          </span>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {sampleProjects.map((preset) => {
            const isBenchmark = preset.id === "benchmark-case";
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isBenchmark
                    ? "bg-gradient-to-br from-indigo-950/60 to-slate-900 border-indigo-500/50 hover:border-indigo-400 ring-1 ring-indigo-500/30"
                    : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    isBenchmark 
                      ? "bg-indigo-500/30 text-indigo-300 font-mono" 
                      : "bg-slate-700/50 text-slate-300"
                  }`}>
                    {preset.presetBadge}
                  </span>
                  {isBenchmark && <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />}
                </div>
                <div className="text-xs font-semibold text-white truncate">{preset.name}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{preset.domain.toUpperCase()}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Project Name */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nova Core Banking"
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Domain Vertical */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Domain Vertical
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="fintech">Fintech (PCI-DSS, PSD2)</option>
              <option value="healthcare">Healthcare (HIPAA, HL7)</option>
              <option value="ecommerce">E-Commerce (PCI, WCAG)</option>
              <option value="iot">IoT & Hardware (MQTT, ISO)</option>
            </select>
          </div>

          {/* Target Audience */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Audience
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Retail Customers & Operators"
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Tech Stack */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Architecture / Tech Stack
            </label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="e.g. Next.js, FastAPI, PostgreSQL"
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Domain Standards Pill indicator */}
        <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-800/30 border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Standards Baseline for {activeDomainData.name}:</span>
          {activeDomainData.standards.map((std, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[10px]">
              {std}
            </span>
          ))}
        </div>

        {/* Requirements Text Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Raw Customer Requirements / Interview Transcripts
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .txt/.md</span>
                <input
                  type="file"
                  accept=".txt,.md,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => setRawRequirements("")}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={5}
              required
              value={rawRequirements}
              onChange={(e) => setRawRequirements(e.target.value)}
              placeholder="Paste customer notes, user stories, or raw statements here... (e.g. 'The system should be fast and secure.')"
              className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono leading-relaxed transition"
            />
            <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 font-mono bg-slate-900/80 px-2 py-0.5 rounded">
              {rawRequirements.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        </div>

        {/* Submit Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Parses ambiguity dictionary, generates diffs & derives verifiable IEEE 830 acceptance criteria</span>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || !rawRequirements.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-emerald-500/10 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Explainable RE Engine...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Analyze & Validate Requirements</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
