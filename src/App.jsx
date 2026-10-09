import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Layers, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight,
  BookOpen,
  History,
  Check,
  Zap,
  Info
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ProjectIntake } from './components/ProjectIntake';
import { ReviewDashboard } from './components/ReviewDashboard';
import { RequirementModal } from './components/RequirementModal';
import { SRSPreviewModal } from './components/SRSPreviewModal';
import { AuditLogDrawer } from './components/AuditLogDrawer';
import { RulesManagerModal } from './components/RulesManagerModal';

import { sampleProjects } from './data/sampleProjects';
import { analyzeRequirements, calculateStats } from './engine/validationEngine';

// LocalStorage Keys
const STORAGE_KEYS = {
  SESSION: "reqlens_session_v1",
  PROJECTS: "reqlens_projects_v1",
  ACTIVE_PROJECT_ID: "reqlens_active_proj_id_v1",
  CUSTOM_RULES: "reqlens_custom_rules_v1",
  AUDIT_LOGS: "reqlens_audit_logs_v1"
};

export default function App() {
  const [requiresAuthentication, setRequiresAuthentication] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEYS.SESSION);
    } catch {
      return true;
    }
  });

  // Session State
  const [currentSession, setCurrentSession] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
      return saved ? JSON.parse(saved) : {
        name: "Alex Chen",
        email: "alex.chen@enterprise.io",
        organization: "Apex Systems Engineering",
        role: "developer",
        token: "req_sess_init",
        lastLogin: new Date().toISOString()
      };
    } catch {
      return {
        name: "Alex Chen",
        email: "alex.chen@enterprise.io",
        role: "developer"
      };
    }
  });

  // Projects State
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load projects from storage", e);
    }
    // Default initial projects initialized with benchmark evaluation pre-analyzed
    const initialProjects = sampleProjects.map((sp, idx) => {
      if (idx === 0) {
        // Pre-run the benchmark test so user sees immediate results on initial launch
        const analysis = analyzeRequirements(sp.rawRequirements, { domain: sp.domain });
        return {
          ...sp,
          requirements: analysis.requirements,
          stats: analysis.stats
        };
      }
      return {
        ...sp,
        requirements: [],
        stats: { total: 0, accepted: 0, modified: 0, rejected: 0, suggested: 0, qualityScore: 0 }
      };
    });
    return initialProjects;
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID);
      return saved || sampleProjects[0].id;
    } catch {
      return sampleProjects[0].id;
    }
  });

  // Custom Rules State
  const [customRules, setCustomRules] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_RULES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : [
        {
          timestamp: new Date().toISOString(),
          action: "Session Initialized",
          role: "System Kernel",
          note: "ReqLens Explainable RE Engine initialized with IEEE 830 baseline.",
          reqId: null
        }
      ];
    } catch {
      return [];
    }
  });

  // UI Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEYS.SESSION);
    } catch {
      return true;
    }
  });
  const [isSRSModalOpen, setIsSRSModalOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);

  // Status & Progress State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Active Project Finder
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // Show temporary toast notification
  const showToast = useCallback((msg, type = "info") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === msg ? null : prev));
    }, 3200);
  }, []);

  // Save to LocalStorage effects
  useEffect(() => {
    if (requiresAuthentication) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentSession));
    } catch (e) {
      console.error(e);
    }
  }, [currentSession, requiresAuthentication]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error(e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, activeProjectId);
    } catch (e) {
      console.error(e);
    }
  }, [activeProjectId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_RULES, JSON.stringify(customRules));
    } catch (e) {
      console.error(e);
    }
  }, [customRules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
    } catch (e) {
      console.error(e);
    }
  }, [auditLogs]);

  // Log an audit event
  const logAuditEvent = useCallback((action, note, reqId = null) => {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      note,
      reqId,
      role: `${currentSession.name} (${currentSession.role})`
    };
    setAuditLogs(prev => [entry, ...prev]);
  }, [currentSession]);

  // Handle Analysis Execution
  const handleAnalyzeProject = (projectData) => {
    setIsAnalyzing(true);
    showToast("Parsing statements against Ambiguity Dictionary & Domain Templates...", "info");

    setTimeout(() => {
      const result = analyzeRequirements(projectData.rawRequirements, { domain: projectData.domain }, customRules);

      setProjects(prevProjects => {
        const existingIdx = prevProjects.findIndex(p => p.id === projectData.id);
        const updatedProject = {
          ...projectData,
          requirements: result.requirements,
          stats: result.stats
        };

        if (existingIdx >= 0) {
          const updated = [...prevProjects];
          updated[existingIdx] = updatedProject;
          return updated;
        } else {
          return [updatedProject, ...prevProjects];
        }
      });

      setActiveProjectId(projectData.id);
      setIsAnalyzing(false);
      setShowIntakeForm(false);

      logAuditEvent(
        "Requirements Analysis Executed",
        `Parsed ${result.requirements.length} requirements. Discovered ${result.stats.modified} ambiguities and injected ${result.stats.suggested} suggestions.`
      );

      showToast(`Validation Complete: ${result.requirements.length} specifications derived.`, "success");

      // Small confetti celebration
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch {}
    }, 600);
  };

  // Requirement Card Actions
  const handleAcceptRequirement = (reqId) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== activeProjectId) return p;
      const updatedReqs = p.requirements.map(r => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          status: "Accepted",
          changeSummary: "Approved and baselined by stakeholder."
        };
      });
      return {
        ...p,
        requirements: updatedReqs,
        stats: calculateStats(updatedReqs)
      };
    }));

    logAuditEvent("Requirement Accepted", `Requirement marked as formal baseline for SRS.`, reqId);
    showToast(`Approved ${reqId} for SRS document baseline.`, "success");
  };

  const handleRejectRequirement = (reqId) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== activeProjectId) return p;
      const updatedReqs = p.requirements.map(r => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          status: "Rejected",
          changeSummary: "Manually rejected by stakeholder review."
        };
      });
      return {
        ...p,
        requirements: updatedReqs,
        stats: calculateStats(updatedReqs)
      };
    }));

    logAuditEvent("Requirement Rejected", `Excluded from engineering scope by reviewer.`, reqId);
    showToast(`Marked ${reqId} as Rejected from specification.`, "warning");
  };

  const handleRestoreRequirement = (reqId) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== activeProjectId) return p;
      const updatedReqs = p.requirements.map(r => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          refinedText: r.originalText,
          status: "Modified",
          changeSummary: "Restored to customer original raw text."
        };
      });
      return {
        ...p,
        requirements: updatedReqs,
        stats: calculateStats(updatedReqs)
      };
    }));

    logAuditEvent("Requirement Restored", `Reverted formal specification back to raw verbatim text.`, reqId);
    showToast(`Restored raw phrasing for ${reqId}.`, "info");
  };

  const handleEditRequirement = (requirement) => {
    setEditingRequirement(requirement);
    setIsReqModalOpen(true);
  };

  const handleSaveRequirement = (savedRequirement) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== activeProjectId) return p;

      const existingIdx = p.requirements.findIndex(r => r.id === savedRequirement.id);
      let updatedReqs = [];
      if (existingIdx >= 0) {
        updatedReqs = [...p.requirements];
        updatedReqs[existingIdx] = savedRequirement;
        logAuditEvent("Requirement Edited", `Specification updated: "${savedRequirement.refinedText.slice(0, 40)}..."`, savedRequirement.id);
      } else {
        updatedReqs = [...p.requirements, savedRequirement];
        logAuditEvent("Custom Requirement Injected", `Added manual requirement: "${savedRequirement.refinedText.slice(0, 40)}..."`, savedRequirement.id);
      }

      return {
        ...p,
        requirements: updatedReqs,
        stats: calculateStats(updatedReqs)
      };
    }));

    showToast(`Saved ${savedRequirement.id} to project baseline.`, "success");
  };

  const handleAcceptAllSuggested = () => {
    setProjects(prev => prev.map(p => {
      if (p.id !== activeProjectId) return p;
      const updatedReqs = p.requirements.map(r => {
        if (r.status === "Suggested") {
          return {
            ...r,
            status: "Accepted",
            changeSummary: "Bulk-approved suggested baseline requirement."
          };
        }
        return r;
      });
      return {
        ...p,
        requirements: updatedReqs,
        stats: calculateStats(updatedReqs)
      };
    }));

    logAuditEvent("Bulk Accept Suggested", `Approved all AI-suggested safety & compliance baselines.`);
    showToast("All suggested requirements accepted into specification.", "success");
    try {
      confetti({ particleCount: 50, spread: 70 });
    } catch {}
  };

  const handleCreateNewProject = () => {
    const newProj = {
      id: `proj_${Date.now()}`,
      name: "New Enterprise Requirement Intake",
      domain: "fintech",
      targetAudience: "Enterprise Stakeholders",
      techStack: "React, Node.js, PostgreSQL",
      rawRequirements: "",
      requirements: [],
      stats: { total: 0, accepted: 0, modified: 0, rejected: 0, suggested: 0, qualityScore: 0 }
    };
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setShowIntakeForm(true);
    showToast("Created fresh project workspace. Enter requirements to begin.", "info");
  };

  // Custom Rules Handlers
  const handleAddCustomRule = (rule) => {
    setCustomRules(prev => [rule, ...prev]);
    logAuditEvent("Custom Ambiguity Rule Registered", `Mapped buzzword '${rule.term}' to metric '${rule.metric}'`);
    showToast(`Added custom rule for "${rule.term}".`, "success");
  };

  const handleDeleteCustomRule = (index) => {
    setCustomRules(prev => prev.filter((_, idx) => idx !== index));
    showToast("Custom rule removed.", "info");
  };

  const handleResetCustomRules = () => {
    setCustomRules([]);
    showToast("Reset custom rules to standard dictionary.", "info");
  };

  const nextReqId = `REQ-${String((activeProject?.requirements?.length || 0) + 1).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-xs text-white animate-slideUp">
          <span className={`w-2 h-2 rounded-full ${
            toastMessage.type === "success" ? "bg-emerald-400" : toastMessage.type === "warning" ? "bg-amber-400" : "bg-indigo-400"
          }`} />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentSession={currentSession}
        activeProject={activeProject}
        projects={projects}
        onSelectProject={(id) => setActiveProjectId(id)}
        onNewProject={handleCreateNewProject}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSRS={() => setIsSRSModalOpen(true)}
        onOpenAudit={() => setIsAuditDrawerOpen(true)}
        onOpenRules={() => setIsRulesModalOpen(true)}
        requirementsCount={activeProject?.requirements?.filter(r => r.status === "Accepted").length || 0}
        auditLogCount={auditLogs.length}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Project Header & Intake Accordion Toggle */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {activeProject?.domain?.toUpperCase() || "FINTECH"}
                </span>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {activeProject?.name}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {activeProject?.description || "Explainable requirement engineering workspace parsing customer notes into verifiable IEEE 830 specifications."}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowIntakeForm(!showIntakeForm)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-white transition"
              >
                <span>{showIntakeForm ? "Hide Intake Form" : "Edit / Intake Raw Notes"}</span>
              </button>

              <button
                onClick={() => handleAnalyzeProject(activeProject)}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Re-Analyze</span>
              </button>
            </div>
          </div>

          {/* Collapsible Project Intake Form */}
          {showIntakeForm && (
            <div className="mt-5 pt-5 border-t border-slate-800">
              <ProjectIntake
                initialProject={activeProject}
                onAnalyze={handleAnalyzeProject}
                isAnalyzing={isAnalyzing}
                onLoadPreset={(preset) => {
                  showToast(`Loaded "${preset.name}" preset.`, "info");
                }}
              />
            </div>
          )}
        </div>

        {/* If no requirements yet analyzed, show full Intake form prominently */}
        {(!activeProject?.requirements || activeProject.requirements.length === 0) ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>
                No requirements parsed yet for this project. Use the intake form below or select a quick-load benchmark preset to run evaluation.
              </span>
            </div>
            <ProjectIntake
              initialProject={activeProject}
              onAnalyze={handleAnalyzeProject}
              isAnalyzing={isAnalyzing}
            />
          </div>
        ) : (
          /* Interactive Review Workspace Dashboard */
          <ReviewDashboard
            requirements={activeProject.requirements}
            stats={activeProject.stats || calculateStats(activeProject.requirements)}
            currentRole={currentSession.role}
            onAcceptRequirement={handleAcceptRequirement}
            onEditRequirement={handleEditRequirement}
            onRejectRequirement={handleRejectRequirement}
            onRestoreRequirement={handleRestoreRequirement}
            onAddCustomRequirement={() => {
              setEditingRequirement(null);
              setIsReqModalOpen(true);
            }}
            onAcceptAllSuggested={handleAcceptAllSuggested}
            onReAnalyze={() => handleAnalyzeProject(activeProject)}
            onOpenSRS={() => setIsSRSModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>ReqLens • Explainable Requirement Engineering Engine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Standards: IEEE 830-1998 / ISO/IEC/IEEE 29148:2018</span>
            <span>•</span>
            <button onClick={() => setIsRulesModalOpen(true)} className="hover:text-slate-300 transition">
              Ambiguity Dictionary
            </button>
            <span>•</span>
            <button onClick={() => setIsAuditDrawerOpen(true)} className="hover:text-slate-300 transition">
              Audit Logs
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Auth & Role Selector Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentSession={currentSession}
        requiresAuthentication={requiresAuthentication}
        onSaveSession={(newSession) => {
          setCurrentSession(newSession);
          setRequiresAuthentication(false);
          logAuditEvent("Stakeholder Role Switched", `Switched active role to ${newSession.role.toUpperCase()}`);
          showToast(`Authenticated as ${newSession.name} (${newSession.role})`, "success");
        }}
      />

      {/* 2. SRS Preview & Export Modal */}
      <SRSPreviewModal
        isOpen={isSRSModalOpen}
        onClose={() => setIsSRSModalOpen(false)}
        project={activeProject}
        requirements={activeProject?.requirements || []}
        currentSession={currentSession}
      />

      {/* 3. Requirement Add/Edit Modal */}
      <RequirementModal
        isOpen={isReqModalOpen}
        onClose={() => {
          setIsReqModalOpen(false);
          setEditingRequirement(null);
        }}
        onSave={handleSaveRequirement}
        initialRequirement={editingRequirement}
        nextReqId={nextReqId}
      />

      {/* 4. Explainability Audit Logs Drawer */}
      <AuditLogDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        auditLogs={auditLogs}
        onClearLogs={() => {
          setAuditLogs([]);
          showToast("Audit logs cleared.", "info");
        }}
      />

      {/* 5. Custom Rules & Ambiguity Dictionary Modal */}
      <RulesManagerModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        customRules={customRules}
        onAddRule={handleAddCustomRule}
        onDeleteRule={handleDeleteCustomRule}
        onResetRules={handleResetCustomRules}
      />
    </div>
  );
}
