import { StudentProfile, ProjectIdea, RealityCheckReport, ProjectBlueprint, MentorMessage, ImprovementItem } from '../types';

export const geminiService = {
  // Generate Ideas based on Student Profile
  async generateIdeas(profile: StudentProfile): Promise<{ ideas: ProjectIdea[]; source: string }> {
    const response = await fetch('/api/gemini/generate-ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status} generating ideas`);
    }

    return response.json();
  },

  // Perform 10-dimension Reality Check on a Project Idea
  async evaluateRealityCheck(idea: ProjectIdea, profile: StudentProfile): Promise<{ report: RealityCheckReport; source: string }> {
    const response = await fetch('/api/gemini/reality-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, profile }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status} evaluating idea`);
    }

    return response.json();
  },

  // Generate Exhaustive 18-Section Project Blueprint
  async generateBlueprint(idea: ProjectIdea, profile: StudentProfile, realityCheck?: RealityCheckReport): Promise<{ blueprint: ProjectBlueprint; source: string }> {
    const response = await fetch('/api/gemini/blueprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, profile, realityCheck }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status} generating blueprint`);
    }

    return response.json();
  },

  // AI Mentor Chat
  async askMentor(
    message: string,
    project: any,
    profile: StudentProfile | null,
    history: MentorMessage[]
  ): Promise<{ reply: string; suggestedFollowUps?: string[]; source: string }> {
    const response = await fetch('/api/gemini/mentor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, project, profile, history }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status} contacting mentor`);
    }

    return response.json();
  },

  // Get Actionable Project Improvements
  async getImprovements(project: any, profile: StudentProfile | null): Promise<{ improvements: ImprovementItem[]; source: string }> {
    const response = await fetch('/api/gemini/improvements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, profile }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status} generating improvements`);
    }

    return response.json();
  },
};
