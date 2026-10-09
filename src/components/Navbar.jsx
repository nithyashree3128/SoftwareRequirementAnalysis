import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  History, 
  Settings, 
  UserCheck, 
  ChevronDown, 
  FolderPlus,
  Layers,
  Code,
  Briefcase,
  User,
  ShieldCheck
} from 'lucide-react';
import { ROLES } from './AuthModal';

export function Navbar({
  currentSession,
  activeProject,
  projects,
  onSelectProject,
  onNewProject,
  onOpenAuth,
  onOpenSRS,
  onOpenAudit,
  onOpenRules,
  requirementsCount = 0,
  auditLogCount = 0
}) {
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const currentRoleObj = ROLES.find(r => r.id === currentSession?.role) || ROLES[0];
  const RoleIcon = currentRoleObj.icon;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                R
              </span>
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>ReqLens</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v2.4
                </span>
              </h1>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
              Explainable Requirement Engineering & SRS Generator
            </p>
          </div>
        </div>

        {/* Center: Project Switcher */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-sm text-slate-200 transition"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold max-w-[130px] sm:max-w-[180px] truncate">
              {activeProject?.name || "Select Project"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {projectDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Switch Project
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj.id);
                      setProjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition ${
                      activeProject?.id === proj.id ? "bg-indigo-600/10 text-indigo-300 font-semibold" : "text-slate-300"
                    }`}
                  >
                    <span className="truncate">{proj.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                      {proj.domain || "general"}
                    </span>
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-800 pt-1 mt-1 px-2">
                <button
                  onClick={() => {
                    onNewProject();
                    setProjectDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Create / Intake New Project</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SRS Generator Button */}
          <button
            onClick={onOpenSRS}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium transition shadow-sm"
            title="Generate IEEE 830 SRS Document"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">SRS Document</span>
            {requirementsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-bold">
                {requirementsCount}
              </span>
            )}
          </button>

          {/* Audit Trail Drawer Toggle */}
          <button
            onClick={onOpenAudit}
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition"
            title="Explainability Audit Logs"
          >
            <History className="w-4 h-4" />
            {auditLogCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center">
                {auditLogCount > 99 ? "99+" : auditLogCount}
              </span>
            )}
          </button>

          {/* Rules Manager */}
          <button
            onClick={onOpenRules}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition"
            title="Ambiguity Dictionary & Rules Manager"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Active Role Selector Badge */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 transition"
            title="Switch User Role or View Profile"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <RoleIcon className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden md:block">
              <div className="text-[10px] text-slate-400 font-mono leading-none">Role</div>
              <div className="text-xs font-semibold text-white leading-none mt-0.5">{currentRoleObj.badge}</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
