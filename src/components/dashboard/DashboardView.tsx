import React from 'react';
import { SavedProject, StudentProfile } from '../../types';
import {
  Compass,
  Sparkles,
  Milestone,
  Bot,
  ShieldAlert,
  Hammer,
  ArrowRight,
  CheckCircle2,
  Clock,
  Code,
  Layers,
  FileCode2,
  FolderKanban,
  Award,
} from 'lucide-react';

interface DashboardViewProps {
  profile: StudentProfile | null;
  activeProject: SavedProject | null;
  savedProjects: SavedProject[];
  onNavigate: (view: string) => void;
  onSelectProject: (projectId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  activeProject,
  savedProjects,
  onNavigate,
  onSelectProject,
}) => {
  // Find next in-progress or not-started milestone task from roadmap
  const allTasks: { phaseTitle: string; task: any }[] = [];
  activeProject?.roadmap?.forEach((phase) => {
    phase.tasks?.forEach((task) => {
      allTasks.push({ phaseTitle: phase.title, task });
    });
  });

  const nextMilestoneItem =
    allTasks.find((item) => item.task.status === 'In Progress') ||
    allTasks.find((item) => item.task.status === 'Not Started');

  const completedCount = allTasks.filter((item) => item.task.status === 'Completed').length;
  const totalCount = allTasks.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-100 space-y-8">
      {/* Welcome & Student Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/50 text-blue-300 text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>ProjectForge Workspace • Department of CSE AIML</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {profile?.name || 'Engineer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Targeting <strong className="text-white">{profile?.preferredDomain || 'AI & Machine Learning'}</strong> with an estimated timeline of <strong className="text-white">{profile?.availableTime || '2–3 months'}</strong>. Your AI mentor and architectural blueprints are ready.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-btn-continue"
              onClick={() => onNavigate('roadmap')}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/25 flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span>Continue Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="dash-btn-generate-new"
              onClick={() => onNavigate('generator')}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center space-x-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>New Ideas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Project Card & Next Recommended Step */}
      {activeProject ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Project Card */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/60">
                  {activeProject.idea.domain}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {activeProject.idea.difficulty} • {activeProject.idea.estimatedTime}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-2">{activeProject.idea.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {activeProject.idea.shortDescription}
              </p>

              {/* Progress Bar */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400 font-medium">Semester Capstone Progress</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">{activeProject.progressPercentage}% Completed</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${activeProject.progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{completedCount} of {totalCount} Milestones Verified</span>
                  <span>Target: Final Viva Defense</span>
                </div>
              </div>
            </div>

            {/* Project Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => onNavigate('blueprint')}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 font-medium flex items-center justify-center space-x-1.5 transition-colors"
              >
                <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Blueprint</span>
              </button>

              <button
                onClick={() => onNavigate('roadmap')}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 font-medium flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Milestone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Roadmap</span>
              </button>

              <button
                onClick={() => onNavigate('reality-check')}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 font-medium flex items-center justify-center space-x-1.5 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Reality Check</span>
              </button>

              <button
                onClick={() => onNavigate('mentor')}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 font-medium flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ask Mentor</span>
              </button>
            </div>
          </div>

          {/* Recommended Next Milestone */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Recommended Next Action</span>
              </div>

              {nextMilestoneItem ? (
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {nextMilestoneItem.phaseTitle}
                  </span>
                  <h3 className="text-base font-bold text-white">{nextMilestoneItem.task.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{nextMilestoneItem.task.description}</p>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-500 block text-[11px] mb-0.5">Required Deliverable:</span>
                    <span className="font-mono text-emerald-300 text-xs font-semibold">{nextMilestoneItem.task.expectedOutput}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <span>All milestones complete! Ready for final project viva defense.</span>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-800">
              <button
                onClick={() => onNavigate('roadmap')}
                className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
              >
                <span>Update Milestone Progress</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-md mx-auto">
          <Sparkles className="w-10 h-10 text-blue-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">No Active Project Yet</h2>
          <p className="text-xs text-slate-400 mb-6">
            Get personalized capstone recommendations based on your technical profile and semester timeline.
          </p>
          <button
            onClick={() => onNavigate('generator')}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20"
          >
            Generate Project Ideas
          </button>
        </div>
      )}

      {/* Saved Projects Portfolio Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FolderKanban className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Your Project Portfolio</h2>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            View All ({savedProjects.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savedProjects.map((p) => {
            const isCurrent = p.id === activeProject?.id;
            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-blue-400 uppercase bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                    {p.idea.domain}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-emerald-400">Active</span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-white truncate mb-1">{p.idea.title}</h3>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3">
                  <span>Progress</span>
                  <span className="font-mono text-white font-bold">{p.progressPercentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
