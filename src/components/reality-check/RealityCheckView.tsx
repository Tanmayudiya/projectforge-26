import React, { useState, useEffect } from 'react';
import { ProjectIdea, StudentProfile, RealityCheckReport, DimensionEvaluation } from '../../types';
import { geminiService } from '../../services/gemini';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  Bot,
  RefreshCw,
  Award,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Info,
  Clock,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface RealityCheckViewProps {
  idea: ProjectIdea | null;
  profile: StudentProfile;
  existingReport?: RealityCheckReport | null;
  onSaveRealityCheck: (report: RealityCheckReport) => void;
  onViewBlueprint: (idea: ProjectIdea, report: RealityCheckReport) => void;
  onAskMentorAboutRisks: (report: RealityCheckReport) => void;
  onBackToGenerator: () => void;
}

export const RealityCheckView: React.FC<RealityCheckViewProps> = ({
  idea,
  profile,
  existingReport,
  onSaveRealityCheck,
  onViewBlueprint,
  onAskMentorAboutRisks,
  onBackToGenerator,
}) => {
  const [report, setReport] = useState<RealityCheckReport | null>(existingReport || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runEvaluation = async () => {
    if (!idea) return;
    setLoading(true);
    setError(null);
    try {
      const result = await geminiService.evaluateRealityCheck(idea, profile);
      setReport(result.report);
      onSaveRealityCheck(result.report);
    } catch (err: any) {
      console.error('Reality check failure:', err);
      setError(err.message || 'Failed to complete reality check evaluation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idea && !report) {
      runEvaluation();
    }
  }, [idea?.id]);

  if (!idea) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-100">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
          <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">No Project Selected for Reality Check</h2>
          <p className="text-xs text-slate-400 mb-6">
            Please choose a project idea from the generator or select one of your saved projects to evaluate its feasibility.
          </p>
          <button
            onClick={onBackToGenerator}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
          >
            Go to Project Generator
          </button>
        </div>
      </div>
    );
  }

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'Highly Recommended':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-600';
      case 'Feasible with Adjustments':
        return 'bg-amber-950/80 text-amber-300 border-amber-600';
      case 'High Risk / Challenging':
        return 'bg-rose-950/80 text-rose-300 border-rose-600';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-600';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Project Reality Check & Feasibility Audit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{idea.title}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">{idea.problemStatement}</p>
          </div>

          <button
            id="btn-rerun-reality-check"
            onClick={runEvaluation}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Re-evaluating...' : 'Re-run Evaluation'}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <Sparkles className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-white mb-2">Executing 10-Dimension Reality Check...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Evaluating feasibility, technical complexity, risk factors, and timeline suitability for {profile.name} ({profile.availableTime}, {profile.teamSize}).
          </p>
        </div>
      )}

      {/* Evaluation Results */}
      {!loading && report && (
        <div className="space-y-8">
          {/* Top Score Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Overall Suitability Score
              </span>
              <div className="flex items-baseline justify-center md:justify-start gap-1">
                <span className="text-5xl font-extrabold text-white tracking-tight">{report.overallScore}</span>
                <span className="text-slate-500 font-bold text-xl">/ 100</span>
              </div>
              <div className="mt-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getVerdictBadge(report.verdict)}`}>
                  {report.verdict}
                </span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Evaluation Summary</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                This project represents a strong engineering balance: challenging enough to demonstrate mastery of modern web architecture and Google services, while strictly structured to fit within your semester schedule.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-slate-300">
                  Estimated Timeline: <strong>{idea.estimatedTime}</strong>
                </span>
                <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-slate-300">
                  Target Team: <strong>{profile.teamSize}</strong>
                </span>
                <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-slate-300">
                  Domain: <strong>{idea.domain}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 10 Evaluated Dimensions Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>10-Dimension Feasibility Matrix</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.entries(report.dimensions) as [string, DimensionEvaluation][]).map(([key, dim]) => (
                <div key={key} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs text-slate-200">{dim.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase bg-slate-800 px-1.5 py-0.5 rounded">
                        {dim.rating}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">{dim.score}/100</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${
                        dim.score >= 80 ? 'bg-emerald-500' : dim.score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${dim.score}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{dim.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Breakdown: Why It Works vs Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Why this works */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Why This Works</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                {report.whyThisWorks.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Potential Risks */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Potential Risks</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                {report.potentialRisks.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* How to Reduce Risks & Recommended Changes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>How to Reduce the Risks</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                {report.howToReduceRisks.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileCode2 className="w-4 h-4" />
                <span>Recommended Architectural Changes</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                {report.recommendedChanges.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Reality check results are attached to this project's master record.
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                id="btn-ask-mentor-risks"
                onClick={() => onAskMentorAboutRisks(report)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <Bot className="w-4 h-4 text-blue-400" />
                <span>Ask AI Mentor About Risks</span>
              </button>

              <button
                id="btn-proceed-to-blueprint"
                onClick={() => onViewBlueprint(idea, report)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <FileCode2 className="w-4 h-4" />
                <span>Generate 18-Section Blueprint</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
