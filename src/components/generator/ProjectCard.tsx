import React, { useState } from 'react';
import { ProjectIdea } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  FileCode2,
  Bookmark,
  Clock,
  Gauge,
  HelpCircle,
  Code,
  Layers,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ProjectCardProps {
  idea: ProjectIdea;
  isSaved: boolean;
  onViewBlueprint: (idea: ProjectIdea) => void;
  onEvaluateIdea: (idea: ProjectIdea) => void;
  onSaveProject: (idea: ProjectIdea) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  idea,
  isSaved,
  onViewBlueprint,
  onEvaluateIdea,
  onSaveProject,
}) => {
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
      case 'Intermediate':
        return 'bg-blue-950/60 text-blue-300 border-blue-800/60';
      case 'Advanced':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between">
      <div>
        {/* Header & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider bg-blue-950/40 px-2.5 py-0.5 rounded border border-blue-800/40">
            {idea.domain}
          </span>
          <div className="flex items-center space-x-2">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getDifficultyColor(idea.difficulty)}`}>
              {idea.difficulty}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{idea.estimatedTime}</span>
            </span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-lg font-bold text-white tracking-tight leading-snug mb-1">
          {idea.title}
        </h3>
        <p className="text-xs font-medium text-blue-300/90 mb-3">{idea.tagline}</p>

        {/* Problem & Proposed Solution */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {idea.shortDescription}
        </p>

        {/* Explicit Criteria Score Badges */}
        <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Gauge className="w-3 h-3 text-emerald-400" />
                Feasibility
              </span>
              <span className="text-xs font-bold text-emerald-400 font-mono">{idea.feasibilityScore}/100</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${idea.feasibilityScore}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" />
                Skill Match
              </span>
              <span className="text-xs font-bold text-blue-400 font-mono">{idea.skillMatchScore}/100</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${idea.skillMatchScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Why it matches */}
        <div className="mb-4 text-xs bg-slate-800/40 p-2.5 rounded-lg border border-slate-800 text-slate-300">
          <strong className="text-blue-300 block mb-0.5">Why this matches you:</strong>
          {idea.whyItMatches}
        </div>

        {/* Key Features */}
        <div className="mb-4">
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Key Architecture Deliverables:
          </span>
          <ul className="space-y-1 text-xs text-slate-300">
            {idea.keyFeatures.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="truncate">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technology Tags with WHAT/WHY/HOW Toggle */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Recommended Technologies:
            </span>
            <button
              type="button"
              onClick={() => setShowTechDetails(!showTechDetails)}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>{showTechDetails ? 'Hide details' : 'View WHAT/WHY/HOW'}</span>
              {showTechDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {idea.recommendedTechnologies.map((tech, idx) => (
              <span
                key={idx}
                className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                  tech.isGoogleService
                    ? 'bg-blue-950/60 text-blue-300 border-blue-700/60 font-semibold'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {tech.name} {tech.isGoogleService && '★ Google'}
              </span>
            ))}
          </div>

          {showTechDetails && (
            <div className="mt-3 space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
              {idea.recommendedTechnologies.map((tech, idx) => (
                <div key={idx} className="border-b border-slate-800/80 pb-2 last:border-b-0 last:pb-0">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>{tech.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{tech.category}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                    <div><span className="text-emerald-400 font-medium">WHAT:</span> {tech.purpose}</div>
                    <div><span className="text-blue-400 font-medium">WHY:</span> {tech.why}</div>
                    <div><span className="text-amber-400 font-medium">HOW:</span> {tech.how}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
        <button
          id={`btn-reality-check-${idea.id}`}
          onClick={() => onEvaluateIdea(idea)}
          className="flex-1 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm shadow-emerald-700/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Reality Check</span>
        </button>

        <button
          id={`btn-view-blueprint-${idea.id}`}
          onClick={() => onViewBlueprint(idea)}
          className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>View Blueprint</span>
        </button>

        <button
          id={`btn-save-project-${idea.id}`}
          onClick={() => onSaveProject(idea)}
          className={`p-2 rounded-lg border text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
            isSaved
              ? 'bg-blue-900/40 text-blue-300 border-blue-600 font-semibold'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title={isSaved ? 'Project is saved in your workspace' : 'Save this project'}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
