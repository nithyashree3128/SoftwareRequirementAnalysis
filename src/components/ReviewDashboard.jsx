import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  PlusCircle, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Zap, 
  RotateCcw,
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { RequirementCard } from './RequirementCard';
import { QualityScoreGauge } from './QualityScoreGauge';

export function ReviewDashboard({
  requirements = [],
  stats,
  currentRole,
  onAcceptRequirement,
  onEditRequirement,
  onRejectRequirement,
  onRestoreRequirement,
  onAddCustomRequirement,
  onAcceptAllSuggested,
  onReAnalyze,
  onOpenSRS
}) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("id-asc");

  // Filter and sort requirements
  const filteredRequirements = useMemo(() => {
    return requirements.filter(req => {
      // Status Filter
      if (statusFilter !== "All" && req.status !== statusFilter) {
        return false;
      }
      // Category Filter
      if (categoryFilter !== "All" && req.category !== categoryFilter) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = req.id.toLowerCase().includes(query);
        const matchesOriginal = (req.originalText || "").toLowerCase().includes(query);
        const matchesRefined = (req.refinedText || "").toLowerCase().includes(query);
        const matchesReason = (req.reason || "").toLowerCase().includes(query);
        const matchesCat = (req.category || "").toLowerCase().includes(query);
        return matchesId || matchesOriginal || matchesRefined || matchesReason || matchesCat;
      }
      return true;
    }).sort((a, b) => {
      if (sortOrder === "id-asc") {
        return a.id.localeCompare(b.id);
      }
      if (sortOrder === "id-desc") {
        return b.id.localeCompare(a.id);
      }
      if (sortOrder === "status") {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
  }, [requirements, statusFilter, categoryFilter, searchQuery, sortOrder]);

  const categories = useMemo(() => {
    const set = new Set(requirements.map(r => r.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [requirements]);

  const suggestedCount = requirements.filter(r => r.status === "Suggested").length;

  return (
    <div className="space-y-6">
      {/* Live Counter & Quality Gauge Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: 5 Live Status Counters Grid */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Requirement State Matrix</h3>
              <p className="text-[11px] text-slate-400">Live explainable decision counters and refinement audit</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">Active Sync</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Total */}
            <button
              onClick={() => setStatusFilter("All")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                statusFilter === "All" 
                  ? "bg-slate-800 border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-md" 
                  : "bg-slate-950/40 border-slate-800 hover:bg-slate-800/60"
              }`}
            >
              <div className="text-[10px] text-slate-400 uppercase font-mono font-medium">Total Input</div>
              <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Parsed Items</div>
            </button>

            {/* Accepted */}
            <button
              onClick={() => setStatusFilter("Accepted")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                statusFilter === "Accepted" 
                  ? "bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/10" 
                  : "bg-slate-950/40 border-slate-800 hover:border-emerald-500/40"
              }`}
            >
              <div className="text-[10px] text-emerald-400 uppercase font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Accepted</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{stats.accepted}</div>
              <div className="text-[10px] text-emerald-500/80 mt-0.5">SRS Ready</div>
            </button>

            {/* Modified */}
            <button
              onClick={() => setStatusFilter("Modified")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                statusFilter === "Modified" 
                  ? "bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-md shadow-amber-500/10" 
                  : "bg-slate-950/40 border-slate-800 hover:border-amber-500/40"
              }`}
            >
              <div className="text-[10px] text-amber-400 uppercase font-mono font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Modified</span>
              </div>
              <div className="text-2xl font-black text-amber-400 mt-1">{stats.modified}</div>
              <div className="text-[10px] text-amber-500/80 mt-0.5">Disambiguated</div>
            </button>

            {/* Rejected */}
            <button
              onClick={() => setStatusFilter("Rejected")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                statusFilter === "Rejected" 
                  ? "bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20 shadow-md shadow-rose-500/10" 
                  : "bg-slate-950/40 border-slate-800 hover:border-rose-500/40"
              }`}
            >
              <div className="text-[10px] text-rose-400 uppercase font-mono font-semibold flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                <span>Rejected</span>
              </div>
              <div className="text-2xl font-black text-rose-400 mt-1">{stats.rejected}</div>
              <div className="text-[10px] text-rose-500/80 mt-0.5">Out of Scope</div>
            </button>

            {/* Suggested */}
            <button
              onClick={() => setStatusFilter("Suggested")}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                statusFilter === "Suggested" 
                  ? "bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-500/10" 
                  : "bg-slate-950/40 border-slate-800 hover:border-indigo-500/40"
              }`}
            >
              <div className="text-[10px] text-indigo-400 uppercase font-mono font-semibold flex items-center gap-1">
                <PlusCircle className="w-3 h-3" />
                <span>Suggested</span>
              </div>
              <div className="text-2xl font-black text-indigo-400 mt-1">{stats.suggested}</div>
              <div className="text-[10px] text-indigo-400/80 mt-0.5">Missing Gaps</div>
            </button>
          </div>
        </div>

        {/* Right: Quality Health Score Gauge */}
        <div className="lg:col-span-1">
          <QualityScoreGauge stats={stats} requirements={requirements} />
        </div>
      </div>

      {/* Control & Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, keyword, buzzword, or reason..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Accept All Suggested */}
            {suggestedCount > 0 && (
              <button
                type="button"
                onClick={onAcceptAllSuggested}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition"
                title="Bulk accept all AI-suggested safety requirements"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Accept All Suggested ({suggestedCount})</span>
              </button>
            )}

            {/* Add Custom Requirement */}
            <button
              type="button"
              onClick={onAddCustomRequirement}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white text-xs font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Custom Requirement</span>
            </button>

            {/* Generate SRS Document */}
            <button
              type="button"
              onClick={onOpenSRS}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/20"
            >
              <FileText className="w-4 h-4" />
              <span>Generate SRS Document</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-mono mr-1">Status:</span>
            {["All", "Accepted", "Modified", "Rejected", "Suggested"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  statusFilter === st
                    ? "bg-slate-700 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Dropdown & Sort */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px] font-mono">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px] font-mono">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="id-asc">ID (REQ-01 First)</option>
                <option value="id-desc">ID (Descending)</option>
                <option value="status">Decision Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Cards Feed */}
      <div className="space-y-4">
        {filteredRequirements.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
            <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-300">No requirements match current filter criteria</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, clearing filters, or adding a new custom requirement.
            </p>
            <button
              onClick={() => {
                setStatusFilter("All");
                setCategoryFilter("All");
                setSearchQuery("");
              }}
              className="mt-4 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-semibold transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredRequirements.map((req) => (
            <RequirementCard
              key={req.id}
              requirement={req}
              currentRole={currentRole}
              onAccept={onAcceptRequirement}
              onEdit={onEditRequirement}
              onReject={onRejectRequirement}
              onRestore={onRestoreRequirement}
            />
          ))
        )}
      </div>
    </div>
  );
}
