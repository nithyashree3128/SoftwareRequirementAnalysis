import React, { useState } from 'react';
import { Shield, Code, Briefcase, User, Sparkles, Check, ArrowRight } from 'lucide-react';

export const ROLES = [
  {
    id: "developer",
    title: "Software Engineer / Architect",
    badge: "Developer",
    icon: Code,
    color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-300",
    description: "Focus on strict testability, IEEE SLAs, deterministic latency ms, error codes, and CI/CD verification harnesses.",
    focusAreas: ["Latency thresholds (ms)", "OWASP security standards", "API contracts & HTTP codes", "Automated QA testability"]
  },
  {
    id: "product_manager",
    title: "Product Manager (PM)",
    badge: "Product Manager",
    icon: Briefcase,
    color: "from-purple-500/20 to-indigo-500/20 border-indigo-500/40 text-indigo-300",
    description: "Focus on MoSCoW scope management, business rationale, milestone delivery risks, and feature ROI.",
    focusAreas: ["MoSCoW prioritization", "Business justification", "Scope boundaries & constraints", "Stakeholder sign-off"]
  },
  {
    id: "client",
    title: "Client / Business Sponsor",
    badge: "Client",
    icon: User,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300",
    description: "Focus on plain-English clarity, before-and-after transparency, cost/time trade-offs, and acceptance sign-offs.",
    focusAreas: ["Plain-English summaries", "Ambiguity reduction", "Transparent change justification", "Final deliverable expectations"]
  }
];

export function AuthModal({ isOpen, onClose, currentSession, onSaveSession, requiresAuthentication = false }) {
  const [selectedRole, setSelectedRole] = useState(currentSession?.role || "developer");
  const [userName, setUserName] = useState(currentSession?.name || "Alex Chen");
  const [userEmail, setUserEmail] = useState(currentSession?.email || "alex.chen@enterprise.io");
  const [organization, setOrganization] = useState(currentSession?.organization || "Apex Systems Engineering");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState("login");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const session = {
      name: userName,
      email: userEmail,
      organization,
      role: selectedRole,
      token: `req_sess_${Date.now()}`,
      lastLogin: new Date().toISOString()
    };
    onSaveSession(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-500" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{authMode === "signup" ? "Create your ReqLens account" : "ReqLens Stakeholder Authentication"}</h2>
              <p className="text-xs text-slate-400">{authMode === "signup" ? "Create a local session and choose your workspace role" : "Sign in and select your active workspace role"}</p>
            </div>
          </div>
          {currentSession && !requiresAuthentication && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-sm px-2.5 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
            >
              ✕ Close
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="e.g. alex@company.com"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Organization / Department
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. Apex Systems Engineering"
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Select Stakeholder Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedRole(role.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10"
                        : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-700/40 text-slate-400"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-white mb-1">{role.badge}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-2">{role.description}</p>
                    <div className="text-[10px] text-indigo-400 font-mono flex items-center gap-1">
                      <span>•</span> {role.focusAreas[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            {authMode === "login" ? "New to ReqLens?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
              className="font-medium text-emerald-300 hover:text-emerald-200"
            >
              {authMode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>

          {/* Action Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01]"
            >
              <span>{authMode === "signup" ? "Create Account & Enter Workspace" : "Authenticate & Enter Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
