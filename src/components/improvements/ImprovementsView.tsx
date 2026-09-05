import React, { useState, useEffect } from 'react';
import { SavedProject, StudentProfile, ImprovementItem } from '../../types';
import { geminiService } from '../../services/gemini';
import {
  Hammer,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Shield,
  Layers,
  Database,
  Cpu,
  HelpCircle,
  Award,
} from 'lucide-react';

interface ImprovementsViewProps {
  project: SavedProject | null;
  profile: StudentProfile | null;
  onNavigateToRoadmap: () => void;
  onNavigateToGenerator: () => void;
}

export const ImprovementsView: React.FC<ImprovementsViewProps> = ({
  project,
  profile,
  onNavigateToRoadmap,
  onNavigateToGenerator,
}) => {
  const [improvements, setImprovements] = useState<ImprovementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const fetchImprovements = async () => {
    if (!project) return;
    setLoading(true);
    setError(null);
    try {
      const result = await geminiService.getImprovements(project, profile);
      setImprovements(result.improvements);
    } catch (err: any) {
      console.error('Improvements fetch failed:', err);
      setError(err.message || 'Failed to generate improvement suggestions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project && improvements.length === 0) {
      fetchImprovements();
    }
  }, [project?.id]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-100">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
          <Hammer className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">No Active Project Selected</h2>
          <p className="text-xs text-slate-400 mb-6">
            Please choose an active project to receive prioritized architectural, security, and viva defense improvements.
          </p>
          <button
            onClick={onNavigateToGenerator}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
          >
            Select a Project
          </button>
        </div>
      </div>
    );
  }

  const filteredItems = improvements.filter(
    (item) => filterPriority === 'All' || item.priority === filterPriority
  );

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-950/80 text-rose-300 border-rose-700/60';
      case 'Medium':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/60';
      case 'Low':
        return 'bg-blue-950/80 text-blue-300 border-blue-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
              <Hammer className="w-4 h-4" />
              <span>Actionable Project Improvements & Refinement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{project.idea.title}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Prioritized architectural, security, performance, and viva defense enhancements.
            </p>
          </div>

          <button
            onClick={fetchImprovements}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-2 transition-colors self-start sm:self-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Evaluating...' : 'Refresh Suggestions'}</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800">
          {(['All', 'High', 'Medium', 'Low'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filterPriority === p
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {p === 'All' ? 'All Improvements' : `${p} Priority`}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <Sparkles className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-white mb-2">Analyzing Architecture & Identifying Improvements...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Reviewing database schema, API security vectors, client experience, and academic examiners' rubrics.
          </p>
        </div>
      )}

      {/* Improvements List */}
      {!loading && filteredItems.length > 0 && (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider border ${getPriorityBadge(item.priority)}`}>
                    {item.priority} Priority
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {item.category}
                  </span>
                </div>
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Impact: {item.impact}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.description}</p>

              {/* Implementation Steps */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block mb-2">
                  Concrete Implementation Steps:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                  {(item.actionSteps || []).map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400 font-mono font-bold">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
