import React, { useState } from 'react';
import {
  Hammer,
  Compass,
  CheckCircle2,
  FileCode2,
  Milestone,
  Bot,
  Sparkles,
  FolderKanban,
  UserCheck,
  LogOut,
  LogIn,
  Settings,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { SavedProject, StudentProfile } from '../../types';
import { AppUser } from '../../services/storage';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: AppUser | null;
  profile: StudentProfile | null;
  activeProject: SavedProject | null;
  savedProjects: SavedProject[];
  onSelectProject: (projectId: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenTestRunner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  profile,
  activeProject,
  savedProjects,
  onSelectProject,
  onOpenAuth,
  onLogout,
  onOpenTestRunner,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'generator', label: 'Generator', icon: Sparkles },
    { id: 'reality-check', label: 'Reality Check', icon: CheckCircle2 },
    { id: 'blueprint', label: 'Blueprint', icon: FileCode2 },
    { id: 'roadmap', label: 'Roadmap', icon: Milestone },
    { id: 'mentor', label: 'AI Mentor', icon: Bot },
    { id: 'improvements', label: 'Improvements', icon: Hammer },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <button
              id="nav-brand-logo"
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  ProjectForge
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-300 border border-blue-700/50">
                    AI Mentor
                  </span>
                </span>
                <span className="block text-[11px] text-slate-400 font-normal">
                  Forge Your Idea. Build Your Future.
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Active Project Switcher & Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Active Project Dropdown */}
            {activeProject && (
              <div className="relative">
                <button
                  id="active-project-dropdown-btn"
                  onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 max-w-[210px] truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  title={activeProject.idea.title}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="truncate">{activeProject.idea.title}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </button>

                {projectDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-lg bg-slate-800 border border-slate-700 shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1"
                    onMouseLeave={() => setProjectDropdownOpen(false)}
                  >
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
                      Switch Active Project
                    </div>
                    {savedProjects.map((p) => (
                      <button
                        key={p.id}
                        id={`switch-proj-${p.id}`}
                        onClick={() => {
                          onSelectProject(p.id);
                          setProjectDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/70 transition-colors ${
                          p.id === activeProject.id ? 'bg-blue-900/40 text-blue-300 font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <span className="truncate pr-2">{p.idea.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{p.progressPercentage}%</span>
                      </button>
                    ))}
                    <div className="border-t border-slate-700/60 mt-1 pt-1">
                      <button
                        id="dropdown-new-project-btn"
                        onClick={() => {
                          onNavigate('generator');
                          setProjectDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 flex items-center space-x-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate New Project</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Test Suite Trigger */}
            <button
              id="open-test-suite-btn"
              onClick={onOpenTestRunner}
              title="Run Automated Platform & Security Audit Tests"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit Tests</span>
            </button>

            {/* Settings */}
            <button
              id="nav-settings-btn"
              onClick={() => onNavigate('settings')}
              title="Application Settings"
              className={`p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                currentView === 'settings' ? 'bg-slate-800 text-white' : ''
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Session */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-700">
                <button
                  id="nav-profile-btn"
                  onClick={() => onNavigate('onboarding')}
                  className="flex items-center space-x-1.5 text-xs font-medium text-slate-300 hover:text-white"
                  title="Edit Student Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center font-semibold text-xs">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <span className="hidden xl:inline max-w-[100px] truncate">{profile?.name || user.email}</span>
                </button>
                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              id="open-test-suite-mobile-btn"
              onClick={onOpenTestRunner}
              className="p-1.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 text-xs"
              title="Run Tests"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <button
                  id="mobile-nav-profile-btn"
                  onClick={() => {
                    onNavigate('onboarding');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-sm text-slate-300"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>{profile?.name || user.email}</span>
                </button>
                <button
                  id="mobile-nav-logout-btn"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 font-medium px-2 py-1 rounded bg-rose-950/40 border border-rose-800/40"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                id="mobile-nav-login-btn"
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
