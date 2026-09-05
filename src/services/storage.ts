import { StudentProfile, SavedProject, MilestoneTask, MentorMessage, RoadmapPhase, ProjectIdea, RealityCheckReport, ProjectBlueprint, MilestoneStatus } from '../types';

const STORAGE_KEYS = {
  USER: 'projectforge_user',
  PROFILE: 'projectforge_profile',
  ACTIVE_PROJECT_ID: 'projectforge_active_project_id',
  SAVED_PROJECTS: 'projectforge_saved_projects',
  MENTOR_CHAT_PREFIX: 'projectforge_mentor_chat_',
  SETTINGS: 'projectforge_settings',
};

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  isAnonymous: boolean;
}

export const storageService = {
  // Current User Session
  getUser(): AppUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUser(user: AppUser | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  clearUser(): void {
    this.setUser(null);
  },

  // Student Profile
  getProfile(): StudentProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveProfile(profile: StudentProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  setProfile(profile: StudentProfile): void {
    this.saveProfile(profile);
  },

  // Saved Projects
  getSavedProjects(): SavedProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_PROJECTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getProjects(): SavedProject[] {
    return this.getSavedProjects();
  },

  createDefaultRoadmap(idea: ProjectIdea): RoadmapPhase[] {
    return [
      {
        id: `ph-1-${idea.id}`,
        phaseNumber: 1,
        title: 'Phase 1: Planning',
        objectives: ['Define student personas', 'Finalize project scope', 'Confirm system boundaries'],
        estimatedDuration: '1-2 weeks',
        dependencies: ['Idea Selection'],
        status: 'Not Started',
        tasks: [
          { id: `t-1-${idea.id}`, title: 'Define Personas & System Architecture', description: 'Draft user stories and component relationships.', status: 'Not Started', expectedOutput: 'Architecture diagram' },
          { id: `t-2-${idea.id}`, title: 'Establish Feasibility & Risk Mitigations', description: 'Review 10-dimension reality check report and mitigations.', status: 'Not Started', expectedOutput: 'Reality check review' },
        ],
      },
      {
        id: `ph-2-${idea.id}`,
        phaseNumber: 2,
        title: 'Phase 2: Project Setup',
        objectives: ['Initialize Vite + TypeScript', 'Configure Firebase & Auth', 'Draft security rules'],
        estimatedDuration: '1-2 weeks',
        dependencies: ['Phase 1'],
        status: 'Not Started',
        tasks: [
          { id: `t-3-${idea.id}`, title: 'Project Scaffolding & Dependencies', description: 'Setup code repository with TypeScript and Tailwind CSS.', status: 'Not Started', expectedOutput: 'Building project skeleton' },
          { id: `t-4-${idea.id}`, title: 'Configure Firebase Auth & Firestore Rules', description: 'Deploy hardened security rules with ABAC validation.', status: 'Not Started', expectedOutput: 'Security rules verified' },
        ],
      },
      {
        id: `ph-3-${idea.id}`,
        phaseNumber: 3,
        title: 'Phase 3: Core Development',
        objectives: ['Implement primary domain logic', 'Connect database operations', 'Build responsive views'],
        estimatedDuration: '2-3 weeks',
        dependencies: ['Phase 2'],
        status: 'Not Started',
        tasks: [
          { id: `t-5-${idea.id}`, title: 'Build Core Module UI & Forms', description: 'Develop main user workflows, dashboards, and input handling.', status: 'Not Started', expectedOutput: 'Working interactive UI' },
          { id: `t-6-${idea.id}`, title: 'Connect Database & API Services', description: 'Implement persistent CRUD queries with offline caching.', status: 'Not Started', expectedOutput: 'Persistent database flow' },
        ],
      },
      {
        id: `ph-4-${idea.id}`,
        phaseNumber: 4,
        title: 'Phase 4: AI Integration',
        objectives: ['Connect Gemini API SDK', 'Implement server proxy endpoints', 'Refine prompts'],
        estimatedDuration: '1-2 weeks',
        dependencies: ['Phase 3'],
        status: 'Not Started',
        tasks: [
          { id: `t-7-${idea.id}`, title: 'Setup Server-Side AI API Handlers', description: 'Proxy AI requests through Express server.ts to guard API keys.', status: 'Not Started', expectedOutput: 'Server API routes' },
          { id: `t-8-${idea.id}`, title: 'Context-Aware AI Features', description: 'Integrate prompt engineering and structured JSON outputs.', status: 'Not Started', expectedOutput: 'AI-driven outputs' },
        ],
      },
      {
        id: `ph-5-${idea.id}`,
        phaseNumber: 5,
        title: 'Phase 5: Testing',
        objectives: ['Run automated unit tests', 'Verify WCAG AA accessibility', 'Conduct security tests'],
        estimatedDuration: '1 week',
        dependencies: ['Phase 4'],
        status: 'Not Started',
        tasks: [
          { id: `t-9-${idea.id}`, title: 'Automated Invariant Verification', description: 'Verify input boundaries, scoring mathematics, and error states.', status: 'Not Started', expectedOutput: 'Passing test suite' },
          { id: `t-10-${idea.id}`, title: 'Security & Token Validation Audit', description: 'Check unauthorized access handling and cross-user isolation.', status: 'Not Started', expectedOutput: 'Security audit report' },
        ],
      },
      {
        id: `ph-6-${idea.id}`,
        phaseNumber: 6,
        title: 'Phase 6: Deployment',
        objectives: ['Containerize application', 'Deploy to Cloud Run', 'Prepare Viva Defense'],
        estimatedDuration: '1 week',
        dependencies: ['Phase 5'],
        status: 'Not Started',
        tasks: [
          { id: `t-11-${idea.id}`, title: 'Production Container Deployment', description: 'Verify build on Cloud Run port 3000 with HTTPS.', status: 'Not Started', expectedOutput: 'Live production URL' },
          { id: `t-12-${idea.id}`, title: 'Prepare Final Viva Defense Deck', description: 'Document architecture, database schema, and future work.', status: 'Not Started', expectedOutput: 'Viva presentation deck' },
        ],
      },
    ];
  },

  saveProject(
    projectOrIdea: SavedProject | ProjectIdea,
    realityCheck?: RealityCheckReport,
    blueprint?: ProjectBlueprint
  ): SavedProject {
    let projectToSave: SavedProject;

    if ('roadmap' in projectOrIdea && 'idea' in projectOrIdea) {
      projectToSave = projectOrIdea as SavedProject;
      if (realityCheck) projectToSave.realityCheck = realityCheck;
      if (blueprint) projectToSave.blueprint = blueprint;
    } else {
      const idea = projectOrIdea as ProjectIdea;
      const existing = this.getProjectById(idea.id);
      if (existing) {
        projectToSave = {
          ...existing,
          idea,
          realityCheck: realityCheck || existing.realityCheck,
          blueprint: blueprint || existing.blueprint,
          updatedAt: Date.now(),
        };
      } else {
        const defaultRoadmap = this.createDefaultRoadmap(idea);
        let total = 0;
        defaultRoadmap.forEach((p) => (total += p.tasks.length));
        projectToSave = {
          id: idea.id,
          userId: this.getUser()?.uid || 'student-demo-1',
          idea,
          realityCheck,
          blueprint,
          roadmap: defaultRoadmap,
          currentPhaseIndex: 0,
          completedTasksCount: 0,
          totalTasksCount: total,
          progressPercentage: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      }
    }

    const projects = this.getSavedProjects();
    const index = projects.findIndex((p) => p.id === projectToSave.id);
    if (index >= 0) {
      projects[index] = { ...projectToSave, updatedAt: Date.now() };
    } else {
      projects.unshift({ ...projectToSave, createdAt: Date.now(), updatedAt: Date.now() });
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_PROJECTS, JSON.stringify(projects));
    return projectToSave;
  },

  deleteProject(projectId: string): void {
    const projects = this.getSavedProjects().filter((p) => p.id !== projectId);
    localStorage.setItem(STORAGE_KEYS.SAVED_PROJECTS, JSON.stringify(projects));
    if (this.getActiveProjectId() === projectId) {
      const remaining = projects[0];
      this.setActiveProjectId(remaining ? remaining.id : null);
    }
    // Clean up mentor chat
    localStorage.removeItem(`${STORAGE_KEYS.MENTOR_CHAT_PREFIX}${projectId}`);
  },

  getProjectById(projectId: string): SavedProject | null {
    const projects = this.getSavedProjects();
    return projects.find((p) => p.id === projectId) || null;
  },

  // Active Project Selection
  getActiveProjectId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID);
  },

  setActiveProjectId(projectId: string | null): void {
    if (projectId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, projectId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROJECT_ID);
    }
  },

  getActiveProject(): SavedProject | null {
    const activeId = this.getActiveProjectId();
    if (!activeId) return null;
    return this.getProjectById(activeId);
  },

  // Milestone Progress Updates
  updateTaskStatus(
    projectId: string,
    phaseNumber: number,
    taskId: string,
    status: 'Not Started' | 'In Progress' | 'Completed'
  ): SavedProject | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    let totalTasks = 0;
    let completedTasks = 0;

    const updatedRoadmap = project.roadmap.map((phase) => {
      if (phase.phaseNumber === phaseNumber) {
        const updatedTasks = phase.tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, status };
          }
          return task;
        });

        // Compute phase status
        const allCompleted = updatedTasks.every((t) => t.status === 'Completed');
        const anyActive = updatedTasks.some((t) => t.status === 'In Progress' || t.status === 'Completed');
        const phaseStatus = allCompleted ? 'Completed' : anyActive ? 'In Progress' : 'Not Started';

        return { ...phase, tasks: updatedTasks, status: phaseStatus as any };
      }
      return phase;
    });

    // Calculate total progress
    updatedRoadmap.forEach((p) => {
      p.tasks.forEach((t) => {
        totalTasks++;
        if (t.status === 'Completed') completedTasks++;
      });
    });

    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const updatedProject: SavedProject = {
      ...project,
      roadmap: updatedRoadmap,
      completedTasksCount: completedTasks,
      totalTasksCount: totalTasks,
      progressPercentage,
      updatedAt: Date.now(),
    };

    this.saveProject(updatedProject);
    return updatedProject;
  },

  updateMilestone(
    projectId: string,
    taskId: string,
    status: MilestoneStatus
  ): SavedProject | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    let targetPhaseNumber = 1;
    for (const phase of project.roadmap) {
      if (phase.tasks.some((t) => t.id === taskId)) {
        targetPhaseNumber = phase.phaseNumber;
        break;
      }
    }
    return this.updateTaskStatus(projectId, targetPhaseNumber, taskId, status);
  },

  // Mentor Messages
  getMentorMessages(projectId: string): MentorMessage[] {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.MENTOR_CHAT_PREFIX}${projectId}`);
      if (data) return JSON.parse(data);
    } catch {}

    // Default welcoming message for newly active project
    const defaultWelcome: MentorMessage = {
      id: `welcome-${projectId}`,
      projectId,
      sender: 'mentor',
      content: `Hello! I am your **ProjectForge AI Mentor**. I have reviewed your project requirements and roadmap.\n\nAsk me anything! For example:\n- *"What should I build first in Phase 1?"*\n- *"How do I design the Firestore database schema?"*\n- *"What are common security risks to avoid?"*`,
      timestamp: Date.now(),
      suggestedFollowUps: [
        'What should I build next?',
        'How should I structure the database?',
        'What security vulnerabilities should I check?',
      ],
    };
    return [defaultWelcome];
  },

  saveMentorMessage(projectId: string, message: MentorMessage): void {
    const messages = this.getMentorMessages(projectId);
    messages.push(message);
    localStorage.setItem(`${STORAGE_KEYS.MENTOR_CHAT_PREFIX}${projectId}`, JSON.stringify(messages));
  },

  addMentorMessage(projectId: string, message: MentorMessage): void {
    this.saveMentorMessage(projectId, message);
  },

  resetToDemo(): { profile: StudentProfile; project: SavedProject } {
    return this.seedDemoData();
  },

  // Seed sample student data for instant testing
  seedDemoData(): { profile: StudentProfile; project: SavedProject } {
    const sampleProfile: StudentProfile = {
      id: 'student-demo-1',
      name: 'Tanmay Udiya',
      email: 'swe.tanmayudiya@gmail.com',
      interests: ['Artificial Intelligence', 'Web Development', 'Cloud Computing'],
      technicalSkills: ['React', 'TypeScript', 'Node.js', 'Firebase', 'Tailwind CSS'],
      experienceLevel: 'Intermediate',
      preferredDomain: 'AI & Web Engineering',
      projectPurpose: 'Academic project',
      availableTime: '2–3 months',
      teamSize: 'Solo (1)',
      preferredTechnologies: ['React', 'Firebase', 'Gemini API', 'Tailwind CSS'],
      existingIdea: 'An intelligent capstone mentorship platform for engineering students.',
      learningGoals: ['Full-stack architecture', 'Enterprise security rules', 'Google Cloud services'],
      constraints: 'Needs to complete within university capstone deadline with zero hosting cost.',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now(),
    };

    this.saveProfile(sampleProfile);

    // Create a rich initial project
    const sampleProject: SavedProject = {
      id: 'proj-forge-alpha',
      userId: 'student-demo-1',
      idea: {
        id: 'proj-forge-alpha',
        title: 'ProjectForge: AI Project Mentor for Engineering Students',
        tagline: 'Forge Your Idea. Build Your Future.',
        shortDescription: 'An AI-powered project mentor that transforms student skills, domain interests, and time constraints into practical, implementation-ready final-year projects.',
        problemStatement: 'Final-year students struggle to identify feasible capstone ideas, structure development roadmaps, and receive continuous technical mentorship.',
        targetUsers: ['Final-year CSE/IT students', 'Project Guide Professors', 'Academic Evaluators'],
        proposedSolution: 'A comprehensive web platform that generates tailored ideas, evaluates feasibility across 10 dimensions, outputs 18-section technical blueprints, and tracks milestone progress with an AI mentor.',
        domain: 'AI & Web Engineering',
        difficulty: 'Intermediate',
        feasibilityScore: 92,
        skillMatchScore: 95,
        estimatedTime: '8-10 weeks',
        whyItMatches: 'Perfect alignment with full-stack TypeScript, Firebase persistence, and Gemini reasoning capabilities.',
        keyFeatures: [
          'Personalized AI Idea Generator with student profile conditioning',
          'Rigorous 10-Dimension Project Reality Check with mathematical scoring',
          'Exhaustive 18-Section Technical Blueprint with architecture diagrams',
          'Interactive 6-Phase Milestone Roadmap with real persistence',
          'Context-Aware AI Project Mentor with follow-up guidance',
        ],
        recommendedTechnologies: [
          {
            name: 'React 19 & TypeScript',
            category: 'Frontend',
            purpose: 'WHAT: Core single-page application framework',
            why: 'WHY: Provides deterministic state management, responsive speed, and type safety',
            how: 'HOW: Renders dashboard views, milestone trackers, and interactive forms',
            isGoogleService: false,
          },
          {
            name: 'Cloud Firestore',
            category: 'Database',
            purpose: 'WHAT: Serverless scalable cloud database',
            why: 'WHY: Sub-second synchronization and offline caching ideal for students',
            how: 'HOW: Persists user profiles, blueprints, milestones, and mentor logs',
            isGoogleService: true,
          },
          {
            name: 'Gemini 3.8 Flash',
            category: 'AI / ML',
            purpose: 'WHAT: LLM reasoning and evaluation engine',
            why: 'WHY: Fast structured JSON generation and deep software engineering comprehension',
            how: 'HOW: Computes feasibility scores, generates roadmaps, and acts as mentor',
            isGoogleService: true,
          },
          {
            name: 'Firebase Authentication',
            category: 'Backend',
            purpose: 'WHAT: Hardened user identity and session management',
            why: 'WHY: Seamless Google and email sign-in with instant token verification',
            how: 'HOW: Secures student project workspaces and protects database operations',
            isGoogleService: true,
          },
        ],
        potentialChallenges: [
          'Ensuring strict adherence to Firestore security rules to prevent ID tampering',
          'Balancing feature depth without overwhelming solo student developers',
        ],
        futureImprovements: [
          'Automated viva defense question simulator',
          'GitHub repository syncing for milestone completion',
        ],
      },
      realityCheck: {
        id: 'rc-demo-1',
        projectId: 'proj-forge-alpha',
        overallScore: 91,
        verdict: 'Highly Recommended',
        dimensions: {
          feasibility: { name: 'Feasibility', score: 94, rating: 'High', explanation: 'Utilizes modern web and serverless Google services within standard browser constraints.' },
          technicalComplexity: { name: 'Technical Complexity', score: 80, rating: 'Medium', explanation: 'Challenging enough for top academic grades while avoiding brittle distributed overhead.' },
          skillMatch: { name: 'Skill Match', score: 96, rating: 'High', explanation: 'Direct match for student profile skills in React, TypeScript, and Firebase.' },
          timeSuitability: { name: 'Time Suitability', score: 92, rating: 'High', explanation: 'Fits cleanly within an 8 to 10 week development schedule across 6 sprints.' },
          innovationPotential: { name: 'Innovation Potential', score: 89, rating: 'High', explanation: 'Replaces generic chatbots with multi-dimension reality checks and architectural blueprints.' },
          resourceRequirements: { name: 'Resource Requirements', score: 88, rating: 'High', explanation: 'Fully runnable within Google Cloud and Firebase free allowances.' },
          aiDependency: { name: 'AI Dependency', score: 75, rating: 'Medium', explanation: 'Graceful fallback heuristics ensure the platform works even during network dips.' },
          risk: { name: 'Risk Level', score: 70, rating: 'Medium', explanation: 'Low risk with clear phased roadmap and verified data model.' },
          scalability: { name: 'Scalability', score: 90, rating: 'High', explanation: 'Serverless architecture scales elastically with zero devops overhead.' },
          overallSuitability: { name: 'Overall Suitability', score: 91, rating: 'High', explanation: 'Exemplary final-year capstone with commercial SaaS potential.' },
        },
        whyThisWorks: [
          'Directly addresses a documented student pain point with measurable outcomes.',
          'Incorporates Google services (Firebase + Gemini) into a coherent, practical architecture.',
          'Provides clear evaluation deliverables for college presentation day.',
        ],
        potentialRisks: [
          'Spending too much time styling before completing the roadmap engine.',
          'Exposing API keys in client-side code instead of proxying through server.ts.',
        ],
        howToReduceRisks: [
          'Keep all Gemini API calls server-side in server.ts.',
          'Enforce strict milestone tracking week by week.',
        ],
        recommendedChanges: [
          'Provide one-click Markdown export of the blueprint for university reports.',
          'Add a test suite verifying data validation and security rules.',
        ],
        analyzedAt: Date.now() - 86400000,
      },
      roadmap: [
        {
          id: 'ph-1',
          phaseNumber: 1,
          title: 'Phase 1: Scope & Project Planning',
          objectives: ['Define student personas', 'Finalize 10-dimension reality check', 'Confirm system boundaries'],
          estimatedDuration: '1-2 weeks',
          dependencies: ['Project selection'],
          status: 'Completed',
          tasks: [
            { id: 't1', title: 'Define Student Personas & Requirements', description: 'Establish user stories for solo and team final year projects.', status: 'Completed', expectedOutput: 'Requirements specification' },
            { id: 't2', title: 'Execute Feasibility & Reality Check', description: 'Score project complexity, risks, and mitigations.', status: 'Completed', expectedOutput: 'Reality Check Report' },
          ],
        },
        {
          id: 'ph-2',
          phaseNumber: 2,
          title: 'Phase 2: Project Setup & Foundation',
          objectives: ['Configure TypeScript & Vite', 'Setup Firebase Auth & Firestore', 'Implement security rules'],
          estimatedDuration: '1-2 weeks',
          dependencies: ['Phase 1'],
          status: 'Completed',
          tasks: [
            { id: 't3', title: 'Configure Full-Stack Server & Vite Pipeline', description: 'Setup Express server.ts with Node type safety and esbuild.', status: 'Completed', expectedOutput: 'Compiling server and client' },
            { id: 't4', title: 'Hardened Firestore Security Rules', description: 'Draft firestore.rules covering all 8 security pillars.', status: 'Completed', expectedOutput: 'firestore.rules verified' },
          ],
        },
        {
          id: 'ph-3',
          phaseNumber: 3,
          title: 'Phase 3: Core Module Development',
          objectives: ['Build responsive dashboard', 'Implement interactive blueprint view', 'Connect persistent storage'],
          estimatedDuration: '2-3 weeks',
          dependencies: ['Phase 2'],
          status: 'In Progress',
          tasks: [
            { id: 't5', title: 'Interactive Project Blueprint UI', description: 'Develop 18-section architectural tabs with cards and badges.', status: 'Completed', expectedOutput: 'Blueprint component' },
            { id: 't6', title: 'Interactive Roadmap & Milestone Tracker', description: 'Create task checkbox engine with live progress recalculation.', status: 'In Progress', expectedOutput: 'Roadmap component' },
          ],
        },
        {
          id: 'ph-4',
          phaseNumber: 4,
          title: 'Phase 4: AI Engine & Mentorship',
          objectives: ['Integrate @google/genai SDK', 'Build project-aware AI mentor chat', 'Add improvement engine'],
          estimatedDuration: '1-2 weeks',
          dependencies: ['Phase 3'],
          status: 'Not Started',
          tasks: [
            { id: 't7', title: 'Context-Aware AI Mentor Engine', description: 'Connect Gemini server routes with project roadmap state.', status: 'Not Started', expectedOutput: 'AI mentor chat' },
            { id: 't8', title: 'Prioritized Project Improvement Advisor', description: 'Generate High/Medium/Low actionable engineering upgrades.', status: 'Not Started', expectedOutput: 'Improvement view' },
          ],
        },
        {
          id: 'ph-5',
          phaseNumber: 5,
          title: 'Phase 5: Testing, Security & Accessibility',
          objectives: ['Execute test suite', 'Verify WCAG AA accessibility', 'Check Dirty Dozen security payloads'],
          estimatedDuration: '1 week',
          dependencies: ['Phase 4'],
          status: 'Not Started',
          tasks: [
            { id: 't9', title: 'Automated Test Runner Verification', description: 'Run validation, milestone math, and security tests.', status: 'Not Started', expectedOutput: 'Passing test runner' },
            { id: 't10', title: 'Accessibility & Keyboard Audit', description: 'Verify contrast, semantic tags, and focus rings.', status: 'Not Started', expectedOutput: 'Audit sign-off' },
          ],
        },
        {
          id: 'ph-6',
          phaseNumber: 6,
          title: 'Phase 6: Production Deployment & Viva Prep',
          objectives: ['Production build verification', 'Container deployment', 'Documentation & Viva deck'],
          estimatedDuration: '1 week',
          dependencies: ['Phase 5'],
          status: 'Not Started',
          tasks: [
            { id: 't11', title: 'Deploy Container on Cloud Run', description: 'Verify HTTPS, routing, and public accessibility.', status: 'Not Started', expectedOutput: 'Live production URL' },
            { id: 't12', title: 'Prepare Viva Defense Documentation', description: 'Complete comprehensive README and architecture breakdown.', status: 'Not Started', expectedOutput: 'Viva presentation materials' },
          ],
        },
      ],
      currentPhaseIndex: 2,
      completedTasksCount: 5,
      totalTasksCount: 12,
      progressPercentage: 42,
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now(),
    };

    this.saveProject(sampleProject);
    this.setActiveProjectId(sampleProject.id);

    return { profile: sampleProfile, project: sampleProject };
  },
};
