import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  SavedProject,
  ProjectIdea,
  RealityCheckReport,
  ProjectBlueprint,
  MentorMessage,
  MilestoneStatus,
  RoadmapPhase,
} from './types';
import { AppUser, storageService } from './services/storage';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// View Components
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingView } from './components/onboarding/OnboardingView';
import { DashboardView } from './components/dashboard/DashboardView';
import { GeneratorView } from './components/generator/GeneratorView';
import { RealityCheckView } from './components/reality-check/RealityCheckView';
import { BlueprintView } from './components/blueprint/BlueprintView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { MentorView } from './components/mentor/MentorView';
import { ImprovementsView } from './components/improvements/ImprovementsView';
import { SavedProjectsView } from './components/projects/SavedProjectsView';
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { AuthModal } from './components/auth/AuthModal';
import { TestRunnerModal } from './components/tests/TestRunnerModal';

export default function App() {
  // Application State
  const [user, setUser] = useState<AppUser | null>(storageService.getUser());
  const [profile, setProfile] = useState<StudentProfile | null>(storageService.getProfile());
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(storageService.getProjects());
  const [activeProjectId, setActiveProjectId] = useState<string | null>(storageService.getActiveProjectId());

  // Views & Modals
  const [currentView, setCurrentView] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [testRunnerModalOpen, setTestRunnerModalOpen] = useState(false);

  // Contextual Idea selection for Reality Check & Blueprint
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);

  // Active Project Reference
  const activeProject = savedProjects.find((p) => p.id === activeProjectId) || savedProjects[0] || null;

  // Sync selectedIdea with activeProject if available
  useEffect(() => {
    if (!selectedIdea && activeProject) {
      setSelectedIdea(activeProject.idea);
    }
  }, [activeProject]);

  // Handle Profile Update
  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    storageService.setProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  // Handle Project Selection
  const handleSelectProject = (projectId: string) => {
    storageService.setActiveProjectId(projectId);
    setActiveProjectId(projectId);
    const target = savedProjects.find((p) => p.id === projectId);
    if (target) {
      setSelectedIdea(target.idea);
    }
  };

  // Handle Saving Idea as Project
  const handleSaveProject = (idea: ProjectIdea) => {
    const saved = storageService.saveProject(idea, undefined, undefined);
    setSavedProjects(storageService.getProjects());
    setActiveProjectId(saved.id);
    setSelectedIdea(idea);
  };

  // Handle Milestone Status Update
  const handleUpdateMilestone = (milestoneId: string, status: MilestoneStatus) => {
    if (!activeProject) return;
    storageService.updateMilestone(activeProject.id, milestoneId, status);
    setSavedProjects(storageService.getProjects());
  };

  // Handle Mentor Message
  const handleSaveMentorMessage = (msg: MentorMessage) => {
    if (!activeProject) return;
    storageService.addMentorMessage(activeProject.id, msg);
    setSavedProjects(storageService.getProjects());
  };

  // Handle Reality Check Save
  const handleSaveRealityCheck = (report: RealityCheckReport) => {
    if (selectedIdea) {
      storageService.saveProject(selectedIdea, report, undefined);
      setSavedProjects(storageService.getProjects());
    }
  };

  // Handle Blueprint Save
  const handleSaveBlueprint = (blueprint: ProjectBlueprint) => {
    if (selectedIdea) {
      storageService.saveProject(selectedIdea, undefined, blueprint);
      setSavedProjects(storageService.getProjects());
    }
  };

  // Handle Project Deletion
  const handleDeleteProject = (projectId: string) => {
    storageService.deleteProject(projectId);
    const updated = storageService.getProjects();
    setSavedProjects(updated);
    if (activeProjectId === projectId) {
      const nextId = updated[0]?.id || null;
      setActiveProjectId(nextId);
      if (nextId) storageService.setActiveProjectId(nextId);
    }
  };

  // Reset to Demo Data
  const handleResetData = () => {
    setUser(storageService.getUser());
    setProfile(storageService.getProfile());
    setSavedProjects(storageService.getProjects());
    setActiveProjectId(storageService.getActiveProjectId());
  };

  // Navigation Handlers
  const handleStartFromLanding = () => {
    if (profile && profile.interests.length > 0) {
      setCurrentView('generator');
    } else {
      setCurrentView('onboarding');
    }
  };

  const handleEvaluateIdea = (idea: ProjectIdea) => {
    setSelectedIdea(idea);
    setCurrentView('reality-check');
  };

  const handleViewBlueprint = (idea: ProjectIdea, realityCheck?: RealityCheckReport) => {
    setSelectedIdea(idea);
    if (realityCheck) {
      storageService.saveProject(idea, realityCheck, undefined);
      setSavedProjects(storageService.getProjects());
    }
    setCurrentView('blueprint');
  };

  const handleAskMentorPhase = (phase: RoadmapPhase) => {
    setCurrentView('mentor');
  };

  const handleAskMentorAboutRisks = (report: RealityCheckReport) => {
    setCurrentView('mentor');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        profile={profile}
        activeProject={activeProject}
        savedProjects={savedProjects}
        onSelectProject={handleSelectProject}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={() => {
          storageService.clearUser();
          setUser(null);
        }}
        onOpenTestRunner={() => setTestRunnerModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStart={handleStartFromLanding}
            onExplore={() => {
              const el = document.getElementById('how-it-works');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'onboarding' && (
          <OnboardingView
            initialProfile={profile}
            onSaveProfile={handleSaveProfile}
            onContinueToGenerator={() => setCurrentView('generator')}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            profile={profile}
            activeProject={activeProject}
            savedProjects={savedProjects}
            onNavigate={setCurrentView}
            onSelectProject={handleSelectProject}
          />
        )}

        {currentView === 'generator' && (
          <GeneratorView
            profile={
              profile || {
                id: 'student-temp',
                name: 'Engineering Student',
                email: 'student@paruluniversity.ac.in',
                interests: ['Artificial Intelligence', 'Web Development'],
                technicalSkills: ['React', 'TypeScript', 'Node.js', 'Firebase'],
                experienceLevel: 'Intermediate',
                preferredDomain: 'Artificial Intelligence & ML',
                projectPurpose: 'Academic project',
                availableTime: '2–3 months',
                teamSize: 'Solo (1)',
                preferredTechnologies: ['React', 'Firebase', 'Gemini API'],
                existingIdea: 'An intelligent capstone mentorship platform for engineering students.',
                learningGoals: ['Full-Stack', 'Security Rules', 'Google Services'],
                constraints: 'Free tier hosting only',
                createdAt: Date.now(),
                updatedAt: Date.now(),
              }
            }
            savedProjectIds={savedProjects.map((p) => p.idea.id)}
            onNavigateToProfile={() => setCurrentView('onboarding')}
            onViewBlueprint={(idea) => handleViewBlueprint(idea)}
            onEvaluateIdea={(idea) => handleEvaluateIdea(idea)}
            onSaveProject={handleSaveProject}
          />
        )}

        {currentView === 'reality-check' && (
          <RealityCheckView
            idea={selectedIdea || activeProject?.idea || null}
            profile={
              profile || {
                id: 'student-temp',
                name: 'Engineering Student',
                email: 'student@paruluniversity.ac.in',
                interests: ['Artificial Intelligence'],
                technicalSkills: ['React', 'TypeScript', 'Node.js'],
                experienceLevel: 'Intermediate',
                preferredDomain: 'Artificial Intelligence & ML',
                projectPurpose: 'Academic project',
                availableTime: '2–3 months',
                teamSize: 'Solo (1)',
                preferredTechnologies: ['React', 'Firebase'],
                existingIdea: '',
                learningGoals: [],
                constraints: '',
                createdAt: Date.now(),
                updatedAt: Date.now(),
              }
            }
            existingReport={activeProject?.realityCheck}
            onSaveRealityCheck={handleSaveRealityCheck}
            onViewBlueprint={(idea, report) => handleViewBlueprint(idea, report)}
            onAskMentorAboutRisks={handleAskMentorAboutRisks}
            onBackToGenerator={() => setCurrentView('generator')}
          />
        )}

        {currentView === 'blueprint' && (
          <BlueprintView
            idea={selectedIdea || activeProject?.idea || null}
            profile={
              profile || {
                id: 'student-temp',
                name: 'Engineering Student',
                email: 'student@paruluniversity.ac.in',
                interests: ['Artificial Intelligence'],
                technicalSkills: ['React', 'TypeScript', 'Node.js'],
                experienceLevel: 'Intermediate',
                preferredDomain: 'Artificial Intelligence & ML',
                projectPurpose: 'Academic project',
                availableTime: '2–3 months',
                teamSize: 'Solo (1)',
                preferredTechnologies: ['React', 'Firebase'],
                existingIdea: '',
                learningGoals: [],
                constraints: '',
                createdAt: Date.now(),
                updatedAt: Date.now(),
              }
            }
            realityCheck={activeProject?.realityCheck}
            existingBlueprint={activeProject?.blueprint}
            onSaveBlueprint={handleSaveBlueprint}
            onNavigateToRoadmap={() => setCurrentView('roadmap')}
            onBackToGenerator={() => setCurrentView('generator')}
          />
        )}

        {currentView === 'roadmap' && (
          <RoadmapView
            project={activeProject}
            onUpdateMilestone={handleUpdateMilestone}
            onAskMentorPhase={handleAskMentorPhase}
            onNavigateToGenerator={() => setCurrentView('generator')}
          />
        )}

        {currentView === 'mentor' && (
          <MentorView
            project={activeProject}
            profile={profile}
            onSaveMessage={handleSaveMentorMessage}
            onNavigateToRoadmap={() => setCurrentView('roadmap')}
            onNavigateToGenerator={() => setCurrentView('generator')}
          />
        )}

        {currentView === 'improvements' && (
          <ImprovementsView
            project={activeProject}
            profile={profile}
            onNavigateToRoadmap={() => setCurrentView('roadmap')}
            onNavigateToGenerator={() => setCurrentView('generator')}
          />
        )}

        {currentView === 'projects' && (
          <SavedProjectsView
            projects={savedProjects}
            activeProjectId={activeProjectId}
            onSelectProject={handleSelectProject}
            onDeleteProject={handleDeleteProject}
            onViewBlueprint={(p) => {
              setSelectedIdea(p.idea);
              setCurrentView('blueprint');
            }}
            onViewRoadmap={(p) => {
              handleSelectProject(p.id);
              setCurrentView('roadmap');
            }}
            onNavigateToGenerator={() => setCurrentView('generator')}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            user={user}
            profile={profile}
            onResetData={handleResetData}
            onNavigateToProfile={() => setCurrentView('onboarding')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={setCurrentView}
        onOpenTestRunner={() => setTestRunnerModalOpen(true)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />

      {/* Automated In-App Audit Test Suite Modal */}
      <TestRunnerModal
        isOpen={testRunnerModalOpen}
        onClose={() => setTestRunnerModalOpen(false)}
      />
    </div>
  );
}
