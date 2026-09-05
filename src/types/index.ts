export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ProjectPurpose = 'Academic project' | 'Resume project' | 'Startup idea' | 'Research' | 'Social impact';
export type AvailableTime = '1 month' | '2–3 months' | '4–6 months' | '6+ months';
export type TeamSize = 'Solo (1)' | 'Small (2-3)' | 'Medium (4-5)';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  interests: string[];
  technicalSkills: string[];
  experienceLevel: ExperienceLevel;
  preferredDomain: string;
  projectPurpose: ProjectPurpose;
  availableTime: AvailableTime;
  teamSize: TeamSize;
  preferredTechnologies: string[];
  existingIdea?: string;
  learningGoals: string[];
  constraints?: string;
  createdAt: number;
  updatedAt: number;
}

export interface TechnologyItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'AI / ML' | 'Cloud & DevOps' | 'Testing / Tools';
  purpose: string; // WHAT
  why: string;     // WHY
  how: string;     // HOW
  isGoogleService?: boolean;
}

export interface ProjectIdea {
  id: string;
  title: string;
  tagline: string;
  shortDescription: string;
  problemStatement: string;
  targetUsers: string[];
  proposedSolution: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  feasibilityScore: number; // 0 - 100
  skillMatchScore: number;  // 0 - 100
  estimatedTime: string;
  recommendedTechnologies: TechnologyItem[];
  keyFeatures: string[];
  whyItMatches: string;
  potentialChallenges: string[];
  futureImprovements: string[];
}

export interface DimensionEvaluation {
  name: string;
  score: number; // 0 - 100
  rating: 'Low' | 'Medium' | 'High';
  explanation: string;
}

export interface RealityCheckReport {
  id: string;
  projectId: string;
  overallScore: number; // 0 - 100
  verdict: 'Highly Recommended' | 'Feasible with Adjustments' | 'High Risk / Challenging';
  dimensions: {
    feasibility: DimensionEvaluation;
    technicalComplexity: DimensionEvaluation;
    skillMatch: DimensionEvaluation;
    timeSuitability: DimensionEvaluation;
    innovationPotential: DimensionEvaluation;
    resourceRequirements: DimensionEvaluation;
    aiDependency: DimensionEvaluation;
    risk: DimensionEvaluation;
    scalability: DimensionEvaluation;
    overallSuitability: DimensionEvaluation;
  };
  whyThisWorks: string[];
  potentialRisks: string[];
  howToReduceRisks: string[];
  recommendedChanges: string[];
  analyzedAt: number;
}

export type MilestoneStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface MilestoneTask {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  expectedOutput: string;
}

export type Milestone = MilestoneTask;

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  objectives: string[];
  estimatedDuration: string;
  dependencies: string[];
  tasks: MilestoneTask[];
  status: MilestoneStatus;
}

export interface ArchitectureNode {
  layer: string;
  component: string;
  technology: string;
  role: string;
}

export interface ProjectBlueprint {
  id: string;
  projectId: string;
  projectOverview: string;
  problem: string;
  targetUsers: string[];
  proposedSolution: string;
  uniqueValue: string;
  coreFeatures: string[];
  optionalFeatures: string[];
  recommendedTechStack: TechnologyItem[];
  architectureOverview: string;
  architectureNodes: ArchitectureNode[];
  databaseDesign: {
    description: string;
    collections: {
      name: string;
      purpose: string;
      sampleFields: string[];
    }[];
  };
  apiBackendRequirements: {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    purpose: string;
    security: string;
  }[];
  aiComponents: {
    service: string;
    role: string;
    promptStrategy: string;
  }[];
  securityConsiderations: string[];
  developmentRoadmap: RoadmapPhase[];
  testingStrategy: {
    unitTests: string[];
    integrationTests: string[];
    securityTests: string[];
  };
  deploymentStrategy: {
    hosting: string;
    cicd: string;
    monitoring: string;
  };
  futureImprovements: string[];
  potentialChallenges: string[];
  generatedAt: number;
}

export interface SavedProject {
  id: string;
  userId: string;
  idea: ProjectIdea;
  realityCheck?: RealityCheckReport;
  blueprint?: ProjectBlueprint;
  roadmap: RoadmapPhase[];
  currentPhaseIndex: number;
  completedTasksCount: number;
  totalTasksCount: number;
  progressPercentage: number;
  createdAt: number;
  updatedAt: number;
}

export interface MentorMessage {
  id: string;
  projectId?: string;
  sender: 'user' | 'student' | 'mentor';
  content?: string;
  text?: string;
  timestamp: number;
  suggestedFollowUps?: string[];
  relatedPhaseNumber?: number;
}

export interface ImprovementItem {
  id: string;
  category: 'Missing Feature' | 'Technical' | 'UX & Design' | 'Security' | 'Performance' | 'Testing' | 'Scalability' | 'Presentation / Viva';
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  actionSteps: string[];
  impact: string;
}
