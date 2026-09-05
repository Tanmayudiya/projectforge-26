import React, { useState, useEffect } from 'react';
import { ProjectIdea, StudentProfile } from '../../types';
import { ProjectCard } from './ProjectCard';
import { geminiService } from '../../services/gemini';
import {
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  User,
  Clock,
  Code,
  Layers,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface GeneratorViewProps {
  profile: StudentProfile;
  savedProjectIds: string[];
  onNavigateToProfile: () => void;
  onViewBlueprint: (idea: ProjectIdea) => void;
  onEvaluateIdea: (idea: ProjectIdea) => void;
  onSaveProject: (idea: ProjectIdea) => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  profile,
  savedProjectIds,
  onNavigateToProfile,
  onViewBlueprint,
  onEvaluateIdea,
  onSaveProject,
}) => {
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('');

  const fetchIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await geminiService.generateIdeas(profile);
      setIdeas(result.ideas);
      setSource(result.source);
    } catch (err: any) {
      console.error('Failed to generate ideas:', err);
      setError(err.message || 'We could not generate project ideas at this time. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Generate ideas on mount if none present
    if (ideas.length === 0) {
      fetchIdeas();
    }
  }, [profile.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      {/* Student Profile Context Ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center space-x-1.5 text-blue-400 font-semibold bg-blue-950/60 px-2.5 py-1 rounded border border-blue-800/60">
            <User className="w-3.5 h-3.5" />
            <span>{profile.name}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>{profile.preferredDomain}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{profile.availableTime} ({profile.teamSize})</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
            <Code className="w-3.5 h-3.5 text-slate-400" />
            <span className="max-w-[200px] truncate">{profile.technicalSkills.slice(0, 4).join(', ')}</span>
          </div>
        </div>

        <button
          id="btn-edit-student-profile"
          onClick={onNavigateToProfile}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Adjust Profile Settings</span>
        </button>
      </div>

      {/* Main Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Personalized Project Recommendations</span>
            {source && (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                {source.includes('gemini') ? 'Gemini 3.8 Flash' : 'Heuristic Engine'}
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Engineered exclusively for your skill set in {profile.preferredDomain}. Each project includes explicit feasibility criteria.
          </p>
        </div>

        <button
          id="btn-regenerate-ideas"
          onClick={fetchIdeas}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center space-x-2 shadow-sm shadow-blue-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing Profile...' : 'Regenerate Candidates'}</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs mb-6 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block mb-1">Failed to generate ideas</span>
            <span>{error}</span>
          </div>
          <button
            onClick={fetchIdeas}
            className="px-2.5 py-1 rounded bg-rose-900/60 text-white hover:bg-rose-800 text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6">
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Sparkles className="w-8 h-8 text-blue-400 animate-pulse mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Synthesizing Project Architectures...</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Evaluating your skills ({profile.technicalSkills.join(', ')}), semester timeline, and domain constraints through Gemini.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 animate-pulse space-y-4">
                <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                <div className="h-6 bg-slate-800 rounded w-4/5"></div>
                <div className="h-16 bg-slate-800 rounded"></div>
                <div className="h-10 bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Cards Grid */}
      {!loading && ideas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <ProjectCard
              key={idea.id}
              idea={idea}
              isSaved={savedProjectIds.includes(idea.id)}
              onViewBlueprint={onViewBlueprint}
              onEvaluateIdea={onEvaluateIdea}
              onSaveProject={onSaveProject}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && ideas.length === 0 && (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <Sparkles className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Ideas Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            Click the button below to generate personalized project ideas based on your student profile.
          </p>
          <button
            onClick={fetchIdeas}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20"
          >
            Generate Project Ideas
          </button>
        </div>
      )}
    </div>
  );
};
