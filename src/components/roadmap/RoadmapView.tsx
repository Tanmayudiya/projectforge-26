import React from 'react';
import { SavedProject, MilestoneTask, MilestoneStatus, RoadmapPhase } from '../../types';
import {
  Milestone as MilestoneIcon,
  CheckCircle2,
  Clock,
  Circle,
  PlayCircle,
  Sparkles,
  Bot,
  ArrowRight,
  RotateCcw,
  CheckCheck,
} from 'lucide-react';

interface RoadmapViewProps {
  project: SavedProject | null;
  onUpdateMilestone: (milestoneId: string, status: MilestoneStatus) => void;
  onAskMentorPhase: (phase: RoadmapPhase) => void;
  onNavigateToGenerator: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  project,
  onUpdateMilestone,
  onAskMentorPhase,
  onNavigateToGenerator,
}) => {
  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-100">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
          <MilestoneIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">No Active Project Roadmap</h2>
          <p className="text-xs text-slate-400 mb-6">
            Please choose a project or save one from the generator to view its 6-phase engineering development roadmap.
          </p>
          <button
            onClick={onNavigateToGenerator}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
          >
            Go to Project Generator
          </button>
        </div>
      </div>
    );
  }

  // Calculate live phase stats
  let totalTasks = 0;
  let completedTasks = 0;
  let inProgressTasks = 0;

  project.roadmap.forEach((phase) => {
    phase.tasks.forEach((t) => {
      totalTasks++;
      if (t.status === 'Completed') completedTasks++;
      else if (t.status === 'In Progress') inProgressTasks++;
    });
  });

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const cycleStatus = (task: MilestoneTask) => {
    let nextStatus: MilestoneStatus = 'In Progress';
    if (task.status === 'Not Started') nextStatus = 'In Progress';
    else if (task.status === 'In Progress') nextStatus = 'Completed';
    else nextStatus = 'Not Started';
    onUpdateMilestone(task.id, nextStatus);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
              <MilestoneIcon className="w-4 h-4" />
              <span>Interactive 6-Phase Development Roadmap</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{project.idea.title}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Click any milestone task to cycle progress from <strong>Not Started → In Progress → Completed</strong>.
            </p>
          </div>

          {/* Live Progress Bar Widget */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 min-w-[220px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion</span>
              <span className="text-lg font-bold text-blue-400 font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{completedTasks} of {totalTasks} done</span>
              <span>{inProgressTasks} active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Phases Accordion / List */}
      <div className="space-y-6">
        {project.roadmap.map((phase, phaseIdx) => {
          const phaseDone = phase.tasks.filter((t) => t.status === 'Completed').length;
          const phaseTotal = phase.tasks.length;
          const isAllDone = phaseTotal > 0 && phaseDone === phaseTotal;

          return (
            <div
              key={phase.id || `phase-${phase.phaseNumber}`}
              className={`border rounded-xl transition-all ${
                isAllDone
                  ? 'bg-slate-900/60 border-emerald-800/50'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {/* Phase Header */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isAllDone
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}
                  >
                    {phase.phaseNumber}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{phase.title}</span>
                      {isAllDone && (
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60">
                          Phase Complete
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span>{phaseDone} of {phaseTotal} tasks completed</span>
                      <span>•</span>
                      <span>Est: {phase.estimatedDuration}</span>
                    </div>
                  </div>
                </div>

                <button
                  id={`btn-ask-mentor-${phaseIdx}`}
                  onClick={() => onAskMentorPhase(phase)}
                  className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                  <span>Ask AI Mentor about this phase</span>
                </button>
              </div>

              {/* Milestones Checklist */}
              <div className="p-5 space-y-3">
                {phase.tasks.map((task) => (
                  <div
                    key={task.id}
                    id={`milestone-item-${task.id}`}
                    onClick={() => cycleStatus(task)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      task.status === 'Completed'
                        ? 'bg-slate-950/80 border-emerald-900/60 text-slate-300'
                        : task.status === 'In Progress'
                        ? 'bg-blue-950/20 border-blue-800/80 text-white'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <button
                        type="button"
                        aria-label={`Mark milestone ${task.title}`}
                        className="mt-0.5 flex-shrink-0"
                      >
                        {task.status === 'Completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : task.status === 'In Progress' ? (
                          <PlayCircle className="w-4 h-4 text-blue-400 animate-pulse" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold ${
                              task.status === 'Completed'
                                ? 'line-through text-slate-400'
                                : 'text-slate-100'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{task.description}</p>
                        <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] text-slate-500">
                          <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">
                            Deliverable: {task.expectedOutput}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center flex-shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          task.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                            : task.status === 'In Progress'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800/80'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
