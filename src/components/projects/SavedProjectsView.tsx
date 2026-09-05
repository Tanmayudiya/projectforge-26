import React, { useState } from 'react';
import { SavedProject } from '../../types';
import {
  FolderKanban,
  CheckCircle2,
  Trash2,
  FileCode2,
  Milestone,
  Bot,
  Sparkles,
  ArrowRight,
  Clock,
  Check,
} from 'lucide-react';

interface SavedProjectsViewProps {
  projects: SavedProject[];
  activeProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onViewBlueprint: (project: SavedProject) => void;
  onViewRoadmap: (project: SavedProject) => void;
  onNavigateToGenerator: () => void;
}

export const SavedProjectsView: React.FC<SavedProjectsViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onDeleteProject,
  onViewBlueprint,
  onViewRoadmap,
  onNavigateToGenerator,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            <FolderKanban className="w-4 h-4" />
            <span>Project Workspace & Capstone Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Saved Engineering Projects</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your saved capstones, switch active project context, and review development progress.
          </p>
        </div>

        <button
          onClick={onNavigateToGenerator}
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-md shadow-blue-600/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <FolderKanban className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">No Saved Projects Yet</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Generate project recommendations conditioned on your technical profile and save the ones you wish to pursue.
          </p>
          <button
            onClick={onNavigateToGenerator}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20"
          >
            Start Project Discovery
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            return (
              <div
                key={proj.id}
                className={`bg-slate-900 border rounded-2xl p-6 transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-blue-500/80 shadow-lg shadow-blue-900/20 ring-1 ring-blue-500/40'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                      {proj.idea.domain}
                    </span>

                    <div className="flex items-center space-x-2">
                      {isActive ? (
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/60 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Active Project</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectProject(proj.id)}
                          className="text-[11px] text-slate-400 hover:text-white bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700 hover:bg-slate-700"
                        >
                          Set as Active
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{proj.idea.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">{proj.idea.shortDescription}</p>

                  {/* Progress Bar */}
                  <div className="mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Roadmap Progress</span>
                      <span className="font-bold text-blue-400 font-mono">{proj.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${proj.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewBlueprint(proj)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1 border border-slate-700"
                    >
                      <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Blueprint</span>
                    </button>

                    <button
                      onClick={() => onViewRoadmap(proj)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1 border border-slate-700"
                    >
                      <Milestone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Roadmap</span>
                    </button>
                  </div>

                  {deleteConfirmId === proj.id ? (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          onDeleteProject(proj.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-1 rounded bg-rose-700 text-white text-[11px] font-semibold"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(proj.id)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
