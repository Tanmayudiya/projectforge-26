import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldAlert,
  Terminal,
  Target,
  FileText,
  Lightbulb,
  Milestone,
  Sparkles,
  Bot,
  Database,
  Lock,
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onExplore }) => {
  const steps = [
    { num: '01', title: 'Profile & Interests', desc: 'Input your programming skills, available months, preferred domain, and academic goals.' },
    { num: '02', title: 'AI Ideation', desc: 'Gemini synthesizes custom, non-trivial engineering project candidates matched to your exact constraints.' },
    { num: '03', title: 'Reality Check', desc: 'Evaluate your chosen idea across 10 dimensions: feasibility, risk, complexity, scalability, and time suitability.' },
    { num: '04', title: '18-Section Blueprint', desc: 'Generate complete database schemas, API specs, security requirements, and architectural diagrams.' },
    { num: '05', title: 'Phased Roadmap', desc: 'Track 6 development phases with interactive milestones, task outputs, and persistent progress.' },
    { num: '06', title: 'AI Mentorship', desc: 'Receive continuous, project-aware advisory on code, bugs, security checks, and viva preparation.' },
  ];

  const capabilities = [
    {
      icon: Target,
      title: 'Personalized Project Generation',
      desc: 'No generic to-do lists. Generates scoped capstone candidates conditioned on your specific skills, team size, and academic deadlines.',
    },
    {
      icon: ShieldAlert,
      title: '10-Dimension Reality Check',
      desc: 'Objective mathematical evaluation scoring feasibility, AI dependency, complexity, and risk with concrete mitigations.',
    },
    {
      icon: Layers,
      title: '18-Section Technical Blueprint',
      desc: 'Architectural specifications including database designs, API contracts, security vectors, and exportable documentation.',
    },
    {
      icon: Milestone,
      title: 'Interactive 6-Phase Roadmap',
      desc: 'Granular milestones tracking planning, setup, core build, AI integration, testing, and deployment with live progress bars.',
    },
    {
      icon: Bot,
      title: 'Context-Aware AI Mentor',
      desc: 'A mentor that knows your completed milestones, selected tech stack, and constraints, answering specific technical questions.',
    },
    {
      icon: Cpu,
      title: 'Continuous Project Improvements',
      desc: 'Prioritized High, Medium, and Low upgrades across security, performance, UX, and viva defense presentation.',
    },
  ];

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/60 text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>The AI Engineering Project Mentor for Final-Year Students</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Turn your skills and interests into a project you can{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              actually build.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8">
            ProjectForge helps final-year engineering students transform technical skills, experience level, and timeline constraints into feasible, implementation-ready capstones with complete architecture and continuous AI mentorship.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-primary-cta"
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span>Build My Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-secondary-cta"
              onClick={onExplore}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-semibold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Explore How It Works
            </button>
          </div>

          {/* Quick Metrics / Assurance */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
              <span className="block text-xl font-bold text-white">100%</span>
              <span className="text-xs text-slate-400">Personalized to Profile</span>
            </div>
            <div className="bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
              <span className="block text-xl font-bold text-blue-400">10-Factor</span>
              <span className="text-xs text-slate-400">Feasibility Reality Check</span>
            </div>
            <div className="bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
              <span className="block text-xl font-bold text-emerald-400">18-Section</span>
              <span className="text-xs text-slate-400">Complete Technical Blueprint</span>
            </div>
            <div className="bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
              <span className="block text-xl font-bold text-amber-400">6 Phases</span>
              <span className="text-xs text-slate-400">Roadmap to Deployment</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-blue-400 tracking-wider uppercase mb-2">The Complete Experience</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              From Vague Idea to Working Capstone
            </h3>
            <p className="text-slate-400 text-sm mt-3">
              ProjectForge guides you through an end-to-end engineering discipline workflow instead of dumping disorganized AI text.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-6 hover:border-blue-500/50 transition-colors relative"
              >
                <span className="text-blue-500 font-mono text-sm font-bold block mb-2">{step.num}</span>
                <h4 className="text-base font-semibold text-white mb-2">{step.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="py-20 border-b border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-blue-400 tracking-wider uppercase mb-2">Core Engineering Features</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Everything Needed for Academic & Industry Success
            </h3>
            <p className="text-slate-400 text-sm mt-3">
              Built specifically to satisfy university rubrics and provide genuine technical depth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-900/30 border border-blue-700/40 text-blue-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-100 mb-2">{cap.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real Architecture Diagram */}
      <section className="py-20 border-b border-slate-800 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-semibold text-blue-400 tracking-wider uppercase mb-2">System Architecture</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Genuine Google Cloud & Full-Stack Architecture
            </h3>
            <p className="text-slate-400 text-sm mt-3">
              ProjectForge is built on a resilient multi-tier architecture with zero exposed client secrets.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 sm:p-8 font-mono text-xs">
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="px-5 py-2 rounded-md bg-blue-900/40 border border-blue-700 text-blue-200 font-semibold">
                Student Client (React 19 + TypeScript + Tailwind CSS)
              </div>
              <span className="text-slate-500">↓ [Token-Authenticated Requests / JWT]</span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
                <div className="p-3 rounded-md bg-slate-900 border border-slate-800 text-slate-200">
                  <div className="text-emerald-400 font-bold mb-1 flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Firebase Authentication</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Zero-Trust Identity & Session Tokens</span>
                </div>
                <div className="p-3 rounded-md bg-slate-900 border border-slate-800 text-slate-200">
                  <div className="text-cyan-400 font-bold mb-1 flex items-center justify-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Express API Server (server.ts)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Payload Validation & Secret Isolation</span>
                </div>
              </div>

              <span className="text-slate-500">↓ [Serverless Integration Layer]</span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
                <div className="p-3.5 rounded-md bg-amber-950/30 border border-amber-800/60 text-amber-200 text-left">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>Cloud Firestore</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Persists profiles, blueprints, and milestone updates with hardened Attribute-Based Access Control (firestore.rules).
                  </p>
                </div>
                <div className="p-3.5 rounded-md bg-blue-950/30 border border-blue-800/60 text-blue-200 text-left">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Gemini 3.8 Flash (@google/genai)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Executes multi-dimensional reality checks, personalized candidate generation, and real-time mentor reasoning.
                  </p>
                </div>
              </div>

              <span className="text-slate-500">↓ [Output]</span>

              <div className="px-6 py-2.5 rounded-md bg-emerald-900/40 border border-emerald-700 text-emerald-200 font-bold">
                ProjectForge Production Capstone Workspace
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ProjectForge vs Generic Prompt Bots */}
      <section className="py-20 border-b border-slate-800 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-semibold text-blue-400 tracking-wider uppercase mb-2">The Difference</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Why ProjectForge Beats Generic AI Prompts
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-rose-950/20 border border-rose-900/40">
              <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>✕</span> Generic AI Chatbots
              </h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  <span>Suggests cliché, overused projects ("Online Bookstore", "Simple Todo App", "Face Detector").</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  <span>Ignores semester timeline, resulting in students running out of time before final submissions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  <span>No objective reality check; hallucinated complexity that confuses college project guides.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  <span>No database architecture, API specs, or milestone tracking.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
              <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>✓</span> ProjectForge Engineering Engine
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>Personalized candidates based on student skills, domain, and specific semester constraints.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>10-dimension Reality Check scoring with potential risks and how to reduce them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>18-section architectural blueprint detailing exact WHAT, WHY, and HOW for all technologies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>Persistent 6-phase roadmap with interactive progress tracking and project-aware AI mentor.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to build a capstone that impresses your examiners?
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Stop guessing. Generate personalized, feasible project ideas with complete blueprints and development roadmaps today.
          </p>
          <button
            id="bottom-primary-cta"
            onClick={onStart}
            className="px-8 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition-all inline-flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span>Start My Project Discovery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
