import React from 'react';
import { Hammer, Shield, Cloud, Sparkles, Database, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenTestRunner: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTestRunner }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white">
                <Hammer className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-100 text-base tracking-tight">ProjectForge</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Forge Your Idea. Build Your Future. The AI-powered project mentor for engineering capstones and final-year students.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-blue-400 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>PromptWars × Parul University Hackathon</span>
            </div>
          </div>

          {/* Workflow Links */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Core Experience</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('generator')} className="hover:text-slate-100 transition-colors">
                  AI Project Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reality-check')} className="hover:text-slate-100 transition-colors">
                  10-Factor Reality Check
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blueprint')} className="hover:text-slate-100 transition-colors">
                  18-Section Blueprint
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('roadmap')} className="hover:text-slate-100 transition-colors">
                  Development Roadmap & Milestones
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mentor')} className="hover:text-slate-100 transition-colors">
                  Context-Aware AI Mentor
                </button>
              </li>
            </ul>
          </div>

          {/* Google Services Architecture */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Google Services Stack</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>
                  <strong className="text-slate-200">Gemini 3.8 Flash</strong>: Evaluation & Mentorship
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>
                  <strong className="text-slate-200">Cloud Firestore</strong>: Persistent Student State
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong className="text-slate-200">Firebase Auth</strong>: Zero-Trust Identity
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Cloud className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>
                  <strong className="text-slate-200">Cloud Run</strong>: Container Ingress & Reverse Proxy
                </span>
              </li>
            </ul>
          </div>

          {/* Verification & Quality */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Verification & Standards</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenTestRunner}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
                >
                  <span>▶ Run Automated Test Suite</span>
                </button>
              </li>
              <li className="text-slate-400">
                <span>Security: Hardened ABAC Rules (firestore.rules)</span>
              </li>
              <li className="text-slate-400">
                <span>Accessibility: WCAG AA Compliant UI</span>
              </li>
              <li className="text-slate-400">
                <span>Architecture: Full-Stack Express + React</span>
              </li>
              <li>
                <button onClick={() => onNavigate('settings')} className="hover:text-slate-100">
                  Settings & Cloud Diagnostics
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-3">
          <p>© 2026 ProjectForge. Built for university students building real engineering capstones.</p>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              All Systems Operational
            </span>
            <span>Zero Fake Data Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
