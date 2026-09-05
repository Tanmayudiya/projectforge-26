import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Helper: Clean JSON response from Gemini
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return cleaned.trim();
}

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  const hasKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    service: 'ProjectForge Engine',
    geminiConfigured: hasKey,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// 1. Generate Project Ideas
app.post('/api/gemini/generate-ideas', async (req: Request, res: Response) => {
  try {
    const profile = req.body.profile;
    if (!profile || !profile.name) {
      return res.status(400).json({ error: 'Valid student profile is required' });
    }

    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are a Senior Principal Engineering Project Mentor evaluating a final-year student's profile to formulate 3 to 4 outstanding, implementation-ready final year engineering project ideas.
Student Profile:
- Name: ${profile.name}
- Technical Skills: ${(profile.technicalSkills || []).join(', ') || 'General CS / IT'}
- Interests: ${(profile.interests || []).join(', ') || 'Software Development'}
- Experience Level: ${profile.experienceLevel || 'Intermediate'}
- Preferred Domain: ${profile.preferredDomain || 'Full-Stack Web / Cloud'}
- Project Purpose: ${profile.projectPurpose || 'Academic & Resume'}
- Available Time: ${profile.availableTime || '2–3 months'}
- Team Size: ${profile.teamSize || 'Solo (1)'}
- Preferred Technologies: ${(profile.preferredTechnologies || []).join(', ') || 'Modern Web'}
- Existing Idea Seed (if any): ${profile.existingIdea || 'None'}
- Learning Goals: ${(profile.learningGoals || []).join(', ') || 'Industry skills'}
- Constraints: ${profile.constraints || 'None'}

Generate a valid JSON array of 3 to 4 distinct project ideas.
Return ONLY raw JSON conforming to this schema (no markdown, no backticks, no wrapping text):
[
  {
    "id": "project-slug-1",
    "title": "Clear Project Title",
    "tagline": "Concise impactful tagline",
    "shortDescription": "2-3 sentences explaining what the project achieves.",
    "problemStatement": "Concrete real-world problem faced by users or industry.",
    "targetUsers": ["User group 1", "User group 2"],
    "proposedSolution": "The engineering solution and product architecture proposed.",
    "domain": "${profile.preferredDomain || 'Software Engineering'}",
    "difficulty": "Beginner | Intermediate | Advanced",
    "feasibilityScore": 88,
    "skillMatchScore": 92,
    "estimatedTime": "6-8 weeks",
    "whyItMatches": "Direct justification mapping student's skills and timeframe to this project.",
    "keyFeatures": ["Core feature 1", "Core feature 2", "Core feature 3", "Core feature 4"],
    "recommendedTechnologies": [
      {
        "name": "Technology Name (e.g. React, Firebase, Gemini API, Node.js)",
        "category": "Frontend | Backend | Database | AI / ML | Cloud & DevOps | Testing / Tools",
        "purpose": "WHAT: Exact role in project",
        "why": "WHY: Why it fits the student's constraints and timeline",
        "how": "HOW: Where and how it is applied",
        "isGoogleService": true or false
      }
    ],
    "potentialChallenges": ["Challenge 1", "Challenge 2"],
    "futureImprovements": ["Improvement 1", "Improvement 2"]
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      const raw = response.text || '[]';
      const parsed = JSON.parse(cleanJsonOutput(raw));
      return res.json({ ideas: parsed, source: 'gemini' });
    }

    // High-fidelity fallback heuristic generator if Gemini key is not configured
    const fallbackIdeas = generateFallbackIdeas(profile);
    return res.json({ ideas: fallbackIdeas, source: 'heuristics-engine' });
  } catch (error: any) {
    console.error('Error generating project ideas:', error);
    // Graceful fallback to maintain zero failure state
    try {
      const fallback = generateFallbackIdeas(req.body.profile);
      return res.json({ ideas: fallback, source: 'heuristics-fallback', errorNote: error.message });
    } catch {
      return res.status(500).json({ error: 'Failed to generate project ideas: ' + error.message });
    }
  }
});

// 2. Evaluate Idea (Reality Check)
app.post('/api/gemini/reality-check', async (req: Request, res: Response) => {
  try {
    const { idea, profile } = req.body;
    if (!idea || !profile) {
      return res.status(400).json({ error: 'Idea and profile are required' });
    }

    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are a Senior Project Evaluator and Academic Reviewer conducting a strict "Project Reality Check" for a final-year engineering student.
Student Context:
- Skills: ${(profile.technicalSkills || []).join(', ')}
- Experience Level: ${profile.experienceLevel}
- Available Time: ${profile.availableTime}
- Team Size: ${profile.teamSize}

Project to Evaluate:
- Title: ${idea.title}
- Domain: ${idea.domain}
- Problem: ${idea.problemStatement}
- Solution: ${idea.proposedSolution}
- Key Features: ${(idea.keyFeatures || []).join(', ')}

Evaluate the project rigorously across 10 dimensions.
Return ONLY raw JSON in this exact structure:
{
  "id": "rc-${Date.now()}",
  "projectId": "${idea.id}",
  "overallScore": 84,
  "verdict": "Highly Recommended" or "Feasible with Adjustments" or "High Risk / Challenging",
  "dimensions": {
    "feasibility": { "name": "Feasibility", "score": 85, "rating": "High", "explanation": "..." },
    "technicalComplexity": { "name": "Technical Complexity", "score": 75, "rating": "Medium", "explanation": "..." },
    "skillMatch": { "name": "Skill Match", "score": 90, "rating": "High", "explanation": "..." },
    "timeSuitability": { "name": "Time Suitability", "score": 80, "rating": "High", "explanation": "..." },
    "innovationPotential": { "name": "Innovation Potential", "score": 88, "rating": "High", "explanation": "..." },
    "resourceRequirements": { "name": "Resource Requirements", "score": 78, "rating": "Medium", "explanation": "..." },
    "aiDependency": { "name": "AI Dependency", "score": 70, "rating": "Medium", "explanation": "..." },
    "risk": { "name": "Risk Level", "score": 65, "rating": "Medium", "explanation": "..." },
    "scalability": { "name": "Scalability", "score": 85, "rating": "High", "explanation": "..." },
    "overallSuitability": { "name": "Overall Suitability", "score": 84, "rating": "High", "explanation": "..." }
  },
  "whyThisWorks": [
    "Concrete reason 1",
    "Concrete reason 2",
    "Concrete reason 3"
  ],
  "potentialRisks": [
    "Technical risk 1",
    "Timeline risk 2",
    "Scope creep risk 3"
  ],
  "howToReduceRisks": [
    "Mitigation 1",
    "Mitigation 2",
    "Mitigation 3"
  ],
  "recommendedChanges": [
    "Concrete change or optimization 1",
    "Concrete change or optimization 2"
  ],
  "analyzedAt": ${Date.now()}
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { temperature: 0.3 },
      });

      const parsed = JSON.parse(cleanJsonOutput(response.text || '{}'));
      return res.json({ report: parsed, source: 'gemini' });
    }

    const fallbackReport = generateFallbackRealityCheck(idea, profile);
    return res.json({ report: fallbackReport, source: 'heuristics-engine' });
  } catch (error: any) {
    console.error('Reality check error:', error);
    const fallback = generateFallbackRealityCheck(req.body.idea, req.body.profile);
    return res.json({ report: fallback, source: 'heuristics-fallback' });
  }
});

// 3. Generate Complete Project Blueprint
app.post('/api/gemini/blueprint', async (req: Request, res: Response) => {
  try {
    const { idea, profile, realityCheck } = req.body;
    if (!idea || !profile) {
      return res.status(400).json({ error: 'Idea and profile are required' });
    }

    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are a Principal Software Architect creating an exhaustive, production-grade, 18-section Project Blueprint for this final-year engineering project:
Project Title: ${idea.title}
Domain: ${idea.domain}
Problem: ${idea.problemStatement}
Proposed Solution: ${idea.proposedSolution}
Student Skills: ${(profile.technicalSkills || []).join(', ')}
Timeframe: ${profile.availableTime}

Return a valid JSON object matching this exact structure:
{
  "id": "blueprint-${Date.now()}",
  "projectId": "${idea.id}",
  "projectOverview": "Detailed executive summary of the system.",
  "problem": "${idea.problemStatement}",
  "targetUsers": ["Audience 1", "Audience 2"],
  "proposedSolution": "${idea.proposedSolution}",
  "uniqueValue": "What makes this project innovative and stand out in evaluations.",
  "coreFeatures": ["Feature 1 with engineering depth", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "optionalFeatures": ["Advanced feature 1", "Stretch feature 2"],
  "recommendedTechStack": [
    {
      "name": "React",
      "category": "Frontend",
      "purpose": "Component-driven single page application frontend",
      "why": "Standard in modern web development with fast re-renders and rich ecosystem",
      "how": "Renders interactive dashboards, project cards, and state transitions",
      "isGoogleService": false
    },
    {
      "name": "Cloud Firestore",
      "category": "Database",
      "purpose": "Serverless NoSQL database for real-time synchronization",
      "why": "Zero server maintenance, instant offline sync, and flexible schema for college projects",
      "how": "Stores user profiles, project documents, milestones, and audit logs",
      "isGoogleService": true
    },
    {
      "name": "Gemini API",
      "category": "AI / ML",
      "purpose": "Intelligent reasoning and generation engine",
      "why": "State of the art contextual reasoning with low latency and structured outputs",
      "how": "Powers dynamic recommendations, reality checks, and mentor dialogues",
      "isGoogleService": true
    },
    {
      "name": "Firebase Authentication",
      "category": "Backend",
      "purpose": "Secure token-based user authentication",
      "why": "Provides hardened Google and Email identity verification out of the box",
      "how": "Protects student project workspaces and secures database rules",
      "isGoogleService": true
    }
  ],
  "architectureOverview": "Clear description of data flow from client through authentication to database and AI reasoning services.",
  "architectureNodes": [
    { "layer": "Client Layer", "component": "Web Application", "technology": "React & Tailwind CSS", "role": "User interface, client-side routing, and responsive presentation" },
    { "layer": "Security & Identity", "component": "Auth Gateway", "technology": "Firebase Authentication", "role": "Issues JWT tokens and validates user permissions" },
    { "layer": "API & Server Layer", "component": "Backend Engine", "technology": "Node.js & Express", "role": "Validates business payloads and safely proxies AI requests" },
    { "layer": "Database Layer", "component": "Document Store", "technology": "Cloud Firestore", "role": "ACID transactional updates and document persistence with ABAC rules" },
    { "layer": "AI Intelligence", "component": "GenAI Model", "technology": "Gemini API (@google/genai)", "role": "Analyzes inputs, executes reality checks, and provides mentorship" }
  ],
  "databaseDesign": {
    "description": "Normalized NoSQL collection architecture with strict subcollection ownership.",
    "collections": [
      {
        "name": "users/{userId}",
        "purpose": "Private student profile data and preferences",
        "sampleFields": ["id", "name", "email", "skills", "experienceLevel", "createdAt"]
      },
      {
        "name": "projects/{projectId}",
        "purpose": "Main workspace document containing blueprint and metadata",
        "sampleFields": ["id", "userId", "title", "domain", "status", "progressPercentage"]
      },
      {
        "name": "projects/{projectId}/milestones/{milestoneId}",
        "purpose": "Roadmap phase tasks tracked interactively",
        "sampleFields": ["id", "phaseNumber", "title", "status", "expectedOutput"]
      },
      {
        "name": "projects/{projectId}/mentorMessages/{messageId}",
        "purpose": "Chronological audit of mentor advice and student inquiries",
        "sampleFields": ["id", "sender", "content", "timestamp"]
      }
    ]
  },
  "apiBackendRequirements": [
    { "endpoint": "/api/gemini/generate-ideas", "method": "POST", "purpose": "Generates tailored ideas using student profile", "security": "Authenticated session, payload validation" },
    { "endpoint": "/api/gemini/reality-check", "method": "POST", "purpose": "Calculates 10-dimension feasibility scores", "security": "Rate-limited, sanitized inputs" },
    { "endpoint": "/api/gemini/mentor", "method": "POST", "purpose": "Provides project-aware guidance", "security": "Strict project context isolation" }
  ],
  "aiComponents": [
    {
      "service": "Gemini 3.8 Flash",
      "role": "Personalized ideation, multi-factor evaluation, and technical advisory",
      "promptStrategy": "Role-prompting with strict JSON schema constraints and deterministic temperatures"
    }
  ],
  "securityConsiderations": [
    "Zero client-side secrets: API keys stored in server environment exclusively",
    "Firestore Security Rules: Restrict document read/write to document ownerId == request.auth.uid",
    "Input validation: Sanitize string lengths and regex validate document paths",
    "CORS & Rate Limiting: Guard server routes against unauthorized external origins"
  ],
  "developmentRoadmap": [
    {
      "id": "phase-1",
      "phaseNumber": 1,
      "title": "Phase 1: Planning & Requirements",
      "objectives": ["Finalize user stories", "Review feasibility metrics", "Confirm system boundaries"],
      "estimatedDuration": "1 week",
      "dependencies": ["Project selection"],
      "status": "Completed",
      "tasks": [
        { "id": "t1-1", "title": "Define User Personas & Core Workflows", "description": "Identify primary user personas and define key interaction steps.", "status": "Completed", "expectedOutput": "User journey map document" },
        { "id": "t1-2", "title": "System Architecture Draft", "description": "Map UI components, backend routes, and database collections.", "status": "Completed", "expectedOutput": "Architecture diagram specification" }
      ]
    },
    {
      "id": "phase-2",
      "phaseNumber": 2,
      "title": "Phase 2: Project Setup & Environment",
      "objectives": ["Initialize repository", "Configure Firebase Auth & Firestore", "Setup dev tooling"],
      "estimatedDuration": "1-2 weeks",
      "dependencies": ["Phase 1"],
      "status": "In Progress",
      "tasks": [
        { "id": "t2-1", "title": "Scaffold Project & Dependencies", "description": "Configure TypeScript, Vite, Tailwind CSS, and core packages.", "status": "Completed", "expectedOutput": "Compiling base project" },
        { "id": "t2-2", "title": "Configure Firebase & Security Rules", "description": "Deploy firestore.rules and configure client SDK initialization.", "status": "In Progress", "expectedOutput": "Authenticated database connection" }
      ]
    },
    {
      "id": "phase-3",
      "phaseNumber": 3,
      "title": "Phase 3: Core Module Development",
      "objectives": ["Build primary frontend UI", "Implement core business logic", "Connect persistent storage"],
      "estimatedDuration": "2-3 weeks",
      "dependencies": ["Phase 2"],
      "status": "Not Started",
      "tasks": [
        { "id": "t3-1", "title": "Build Main Interactive Dashboard", "description": "Develop core user flows, forms, and responsive components.", "status": "Not Started", "expectedOutput": "Interactive primary views" },
        { "id": "t3-2", "title": "Implement Database Mutation Handlers", "description": "Connect CRUD operations with optimistic UI updates.", "status": "Not Started", "expectedOutput": "End-to-end data persistence" }
      ]
    },
    {
      "id": "phase-4",
      "phaseNumber": 4,
      "title": "Phase 4: AI Integration & Intelligence",
      "objectives": ["Implement Gemini server routes", "Construct context-aware prompts", "Handle edge cases & fallbacks"],
      "estimatedDuration": "1-2 weeks",
      "dependencies": ["Phase 3"],
      "status": "Not Started",
      "tasks": [
        { "id": "t4-1", "title": "Integrate @google/genai SDK", "description": "Setup server endpoints with API key security and strict JSON output.", "status": "Not Started", "expectedOutput": "Working AI API endpoints" },
        { "id": "t4-2", "title": "Implement Dynamic Context Prompting", "description": "Feed project state and student skills into AI queries.", "status": "Not Started", "expectedOutput": "Personalized mentor intelligence" }
      ]
    },
    {
      "id": "phase-5",
      "phaseNumber": 5,
      "title": "Phase 5: Testing & Security Audit",
      "objectives": ["Execute automated unit tests", "Audit accessibility (WCAG AA)", "Verify security rules"],
      "estimatedDuration": "1 week",
      "dependencies": ["Phase 4"],
      "status": "Not Started",
      "tasks": [
        { "id": "t5-1", "title": "Verify Firestore Security Constraints", "description": "Run Dirty Dozen security test payloads against rules.", "status": "Not Started", "expectedOutput": "100% passing security checks" },
        { "id": "t5-2", "title": "Full User Journey Validation", "description": "Complete clean-session end-to-end user testing.", "status": "Not Started", "expectedOutput": "QA signoff checklist" }
      ]
    },
    {
      "id": "phase-6",
      "phaseNumber": 6,
      "title": "Phase 6: Deployment & Documentation",
      "objectives": ["Build production bundle", "Deploy to Cloud Run / Firebase", "Prepare viva presentation"],
      "estimatedDuration": "1 week",
      "dependencies": ["Phase 5"],
      "status": "Not Started",
      "tasks": [
        { "id": "t6-1", "title": "Configure Production Build", "description": "Validate asset optimization, meta tags, and environment variables.", "status": "Not Started", "expectedOutput": "Optimized production artifacts" },
        { "id": "t6-2", "title": "Generate Final Report & Viva Deck", "description": "Prepare architecture diagrams and demonstration walkthrough.", "status": "Not Started", "expectedOutput": "Complete project documentation" }
      ]
    }
  ],
  "testingStrategy": {
    "unitTests": ["Validate profile field sanitization", "Verify milestone completion percentage calculations", "Ensure prompt token safety"],
    "integrationTests": ["Test end-to-end idea generation API", "Verify Firestore read/write permissions", "Test session persistence on browser reload"],
    "securityTests": ["Attempt cross-user document access", "Verify API key is excluded from client bundles", "Check injection resilience on inputs"]
  },
  "deploymentStrategy": {
    "hosting": "Cloud Run / Firebase App Hosting containerized service",
    "cicd": "Automated build verification via 'npm run build' and container ingress",
    "monitoring": "Structured console health telemetry and client error boundary reporting"
  },
  "futureImprovements": [
    "Collaborative multi-student team workspace with shared milestone comments",
    "GitHub webhook integration to automatically tick off milestones on git commit",
    "Automated viva question generator based on the final project blueprint"
  ],
  "potentialChallenges": [
    "Managing third-party API rate limits during high concurrency",
    "Ensuring consistent performance on lower-bandwidth mobile networks"
  ],
  "generatedAt": ${Date.now()}
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { temperature: 0.4 },
      });

      const parsed = JSON.parse(cleanJsonOutput(response.text || '{}'));
      return res.json({ blueprint: parsed, source: 'gemini' });
    }

    const fallbackBlueprint = generateFallbackBlueprint(idea, profile);
    return res.json({ blueprint: fallbackBlueprint, source: 'heuristics-engine' });
  } catch (error: any) {
    console.error('Blueprint generation error:', error);
    const fallback = generateFallbackBlueprint(req.body.idea, req.body.profile);
    return res.json({ blueprint: fallback, source: 'heuristics-fallback' });
  }
});

// 4. AI Project Mentor Conversation
app.post('/api/gemini/mentor', async (req: Request, res: Response) => {
  try {
    const { message, project, profile, history } = req.body;
    if (!message || !project) {
      return res.status(400).json({ error: 'Message and project context are required' });
    }

    const ai = getGeminiClient();
    if (ai) {
      const historyContext = (history || [])
        .slice(-6)
        .map((h: any) => `${h.sender === 'user' ? 'Student' : 'Mentor'}: ${h.content}`)
        .join('\n');

      const completedMilestones = (project.roadmap || [])
        .flatMap((phase: any) => phase.tasks)
        .filter((t: any) => t.status === 'Completed')
        .map((t: any) => t.title)
        .join(', ');

      const inProgressMilestones = (project.roadmap || [])
        .flatMap((phase: any) => phase.tasks)
        .filter((t: any) => t.status === 'In Progress')
        .map((t: any) => t.title)
        .join(', ');

      const prompt = `You are the Dedicated Project Mentor for a student building their final-year engineering project.
Your tone is professional, encouraging, practical, and highly engineering-focused.
You DO NOT give generic boilerplate answers. You provide specific, step-by-step guidance tailored to THIS EXACT project.

Project Context:
- Title: ${project.idea.title}
- Domain: ${project.idea.domain}
- Problem Statement: ${project.idea.problemStatement}
- Solution: ${project.idea.proposedSolution}
- Recommended Tech Stack: ${(project.idea.recommendedTechnologies || []).map((t: any) => t.name).join(', ')}
- Completed Milestones: ${completedMilestones || 'None yet'}
- In Progress Milestones: ${inProgressMilestones || 'Phase 1/2 tasks'}
- Student Skills: ${(profile?.technicalSkills || []).join(', ')}
- Student Experience: ${profile?.experienceLevel || 'Intermediate'}
- Available Time: ${profile?.availableTime || '2-3 months'}

Recent Conversation:
${historyContext}

Student's Latest Question:
"${message}"

Respond with:
1. Direct, actionable, technical answer specific to their project.
2. Concrete next steps or code/architecture advice.
3. Relevant security or best-practice tip.
4. Suggested 3 relevant follow-up questions they can ask.

Return JSON in this format:
{
  "reply": "Your clear, actionable, well-structured response in markdown format...",
  "suggestedFollowUps": [
    "Follow-up question 1",
    "Follow-up question 2",
    "Follow-up question 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { temperature: 0.6 },
      });

      const parsed = JSON.parse(cleanJsonOutput(response.text || '{}'));
      return res.json({ ...parsed, source: 'gemini' });
    }

    const fallbackResponse = generateFallbackMentorResponse(message, project);
    return res.json({ ...fallbackResponse, source: 'heuristics-engine' });
  } catch (error: any) {
    console.error('Mentor chat error:', error);
    const fallback = generateFallbackMentorResponse(req.body.message, req.body.project);
    return res.json({ ...fallback, source: 'heuristics-fallback' });
  }
});

// 5. Project Improvements
app.post('/api/gemini/improvements', async (req: Request, res: Response) => {
  try {
    const { project, profile } = req.body;
    if (!project) {
      return res.status(400).json({ error: 'Project context is required' });
    }

    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are a Principal Software Architect and Viva Defense Examiner auditing this final-year project to recommend actionable improvements.
Project: ${project.idea.title} (${project.idea.domain})
Problem: ${project.idea.problemStatement}
Tech Stack: ${(project.idea.recommendedTechnologies || []).map((t: any) => t.name).join(', ')}
Current Features: ${(project.idea.keyFeatures || []).join(', ')}

Analyze the project and provide 6 to 8 prioritized improvement recommendations across categories:
- Missing Feature
- Technical
- UX & Design
- Security
- Performance
- Testing
- Scalability
- Presentation / Viva

Return ONLY raw JSON in this structure:
[
  {
    "id": "imp-1",
    "category": "Security",
    "priority": "High",
    "title": "Implement Strict Role-Based Firestore Rules",
    "description": "Enforce document ownership invariants to prevent unauthorized reads and ID tampering.",
    "actionSteps": ["Audit collection paths", "Add ownerId verification", "Test with malicious payloads"],
    "impact": "Eliminates critical vulnerability and boosts viva defense score."
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { temperature: 0.5 },
      });

      const parsed = JSON.parse(cleanJsonOutput(response.text || '[]'));
      return res.json({ improvements: parsed, source: 'gemini' });
    }

    const fallback = generateFallbackImprovements(project);
    return res.json({ improvements: fallback, source: 'heuristics-engine' });
  } catch (error: any) {
    console.error('Improvements error:', error);
    const fallback = generateFallbackImprovements(req.body.project);
    return res.json({ improvements: fallback, source: 'heuristics-fallback' });
  }
});

// Fallback Generators to ensure zero breakage and high reliability
function generateFallbackIdeas(profile: any) {
  const domain = profile.preferredDomain || 'AI & Web Development';
  const skills = (profile.technicalSkills || ['React', 'TypeScript', 'Firebase']).slice(0, 4);

  return [
    {
      id: 'forge-project-1',
      title: `${domain} Adaptive Intelligence Platform`,
      tagline: 'Streamline domain workflows with real-time AI and serverless persistence.',
      shortDescription: `A production-ready full-stack platform built with ${skills.join(', ')} designed to automate complex decision-making in the ${domain} ecosystem.`,
      problemStatement: `Students and professionals in ${domain} lack unified, context-aware tools to track, evaluate, and collaborate on specialized tasks efficiently.`,
      targetUsers: ['University Students', 'Academic Researchers', 'Junior Developers'],
      proposedSolution: 'A responsive web application combining Firebase Auth for user security, Firestore for instant synchronization, and Gemini API for smart recommendations.',
      domain: domain,
      difficulty: profile.experienceLevel || 'Intermediate',
      feasibilityScore: 92,
      skillMatchScore: 95,
      estimatedTime: profile.availableTime || '2–3 months',
      whyItMatches: `Directly leverages your skills in ${skills.join(' and ')} while remaining fully achievable within your ${profile.availableTime || '2-3 months'} timeline.`,
      keyFeatures: [
        'Role-Protected Student Workspace with Firebase Auth',
        'Real-time Firestore persistence with offline cache',
        'Gemini-powered dynamic evaluation and prompt assistance',
        'Exportable project documentation & viva defense audit trail',
      ],
      recommendedTechnologies: [
        {
          name: 'React 19 & TypeScript',
          category: 'Frontend',
          purpose: 'WHAT: Modern type-safe component UI',
          why: 'WHY: Delivers fast reactive updates and prevents runtime bugs during presentation',
          how: 'HOW: Renders dashboard views, milestone trackers, and responsive navigation',
          isGoogleService: false,
        },
        {
          name: 'Cloud Firestore',
          category: 'Database',
          purpose: 'WHAT: Serverless scalable NoSQL cloud database',
          why: 'WHY: Instant real-time updates and zero server maintenance required for college projects',
          how: 'HOW: Stores user accounts, project milestones, and AI mentor conversations',
          isGoogleService: true,
        },
        {
          name: 'Gemini 3.8 Flash',
          category: 'AI / ML',
          purpose: 'WHAT: Large Language Model reasoning engine',
          why: 'WHY: High-speed structured JSON generation and domain comprehension',
          how: 'HOW: Computes feasibility scores, suggests technical improvements, and acts as mentor',
          isGoogleService: true,
        },
        {
          name: 'Firebase Authentication',
          category: 'Backend',
          purpose: 'WHAT: Zero-trust student identity provider',
          why: 'WHY: Hardened Google login and email verification with instant JWT verification',
          how: 'HOW: Secures user workspaces and enforces Firestore security rules',
          isGoogleService: true,
        },
      ],
      potentialChallenges: [
        'Formulating precise AI prompt templates with low latency',
        'Crafting resilient Firestore security rules to protect user projects',
      ],
      futureImprovements: [
        'Multi-user live peer collaboration and mentor review comments',
        'Automated CI/CD integration with GitHub Actions',
      ],
    },
    {
      id: 'forge-project-2',
      title: `Automated ${domain} Code Quality & Vulnerability Guardian`,
      tagline: 'Continuous security analysis, architectural audit, and student code review.',
      shortDescription: 'An automated code inspection system that detects security anti-patterns, OWASP vulnerabilities, and architectural bottlenecks for undergraduate capstone repositories.',
      problemStatement: 'Undergraduate student projects frequently suffer from exposed credentials, unprotected database rules, and unvalidated inputs that fail production criteria.',
      targetUsers: ['Computer Science Students', 'University Evaluators', 'Open-Source Contributors'],
      proposedSolution: 'A dashboard that parses code snippets, runs rule checks, checks dependency CVEs, and gives remediation instructions.',
      domain: 'Cybersecurity & Software Engineering',
      difficulty: 'Intermediate',
      feasibilityScore: 89,
      skillMatchScore: 91,
      estimatedTime: '2–3 months',
      whyItMatches: 'Highly praised by university examiners for demonstrating real-world cybersecurity, testing, and Google Cloud services usage.',
      keyFeatures: [
        'Static AST & Regex pattern scanner for API secrets',
        'Firestore Security Rules linting and vulnerability simulator',
        'AI remediation generator suggesting exact drop-in code patches',
        'Executive security audit scorecard with exportable PDF/Markdown',
      ],
      recommendedTechnologies: [
        {
          name: 'Node.js & Express',
          category: 'Backend',
          purpose: 'WHAT: Secure server runtime and AST parser',
          why: 'WHY: Efficient non-blocking I/O for file and rule processing',
          how: 'HOW: Validates code payloads and coordinates Gemini API queries safely',
          isGoogleService: false,
        },
        {
          name: 'Gemini 3.8 Flash',
          category: 'AI / ML',
          purpose: 'WHAT: Contextual vulnerability explanation & code remediation',
          why: 'WHY: Understands diverse languages and outputs structured fixes',
          how: 'HOW: Analyzes code snippets and drafts secure replacement blocks',
          isGoogleService: true,
        },
        {
          name: 'Cloud Firestore',
          category: 'Database',
          purpose: 'WHAT: Stores scan history, audit reports, and student profiles',
          why: 'WHY: Document-oriented structure ideal for hierarchical vulnerability reports',
          how: 'HOW: Persists scan findings under /projects/{id}/scans',
          isGoogleService: true,
        },
      ],
      potentialChallenges: [
        'Limiting token size when scanning larger repository files',
        'Minimizing false positives in security heuristics',
      ],
      futureImprovements: [
        'Direct GitHub PR bot integration',
        'Support for Python and Java static analysis',
      ],
    },
    {
      id: 'forge-project-3',
      title: `Intelligent Edge IoT & Healthcare Telemetry Monitor`,
      tagline: 'Real-time telemetry aggregation with predictive threshold alerts.',
      shortDescription: 'A modern IoT telemetry monitor that collects sensor time-series data, detects anomalies in real-time, and presents a clinical dashboard for doctors and care teams.',
      problemStatement: 'Remote patient monitoring systems are often fragmented, expensive, and lack intelligent anomaly triage.',
      targetUsers: ['Healthcare Providers', 'Elderly Care Facilities', 'Biomedical Researchers'],
      proposedSolution: 'Combines simulated/live sensor feeds with Firestore real-time listeners and Gemini AI for anomaly triage summaries.',
      domain: 'Healthcare & IoT',
      difficulty: 'Advanced',
      feasibilityScore: 84,
      skillMatchScore: 86,
      estimatedTime: '3–4 months',
      whyItMatches: 'Perfect for showcasing high-impact social and healthcare innovation with clear real-world evaluation metrics.',
      keyFeatures: [
        'Real-time streaming telemetry dashboard with Recharts',
        'Automated anomaly detection threshold alarms',
        'AI clinical summarizer explaining telemetry deviations',
        'HIPAA-compliant encrypted data storage architecture simulation',
      ],
      recommendedTechnologies: [
        {
          name: 'Cloud Firestore',
          category: 'Database',
          purpose: 'WHAT: Real-time patient telemetry synchronization',
          why: 'WHY: Sub-second live snapshot listeners without custom WebSocket servers',
          how: 'HOW: Powers live ECG and vitals monitors in real-time',
          isGoogleService: true,
        },
        {
          name: 'Gemini 3.8 Flash',
          category: 'AI / ML',
          purpose: 'WHAT: Clinical telemetry summary generation',
          why: 'WHY: Fast synthesis of numerical alerts into natural language advisories',
          how: 'HOW: Generates doctor shift handover reports',
          isGoogleService: true,
        },
      ],
      potentialChallenges: [
        'Handling high-frequency streaming writes without exceeding Firestore free-tier quotas',
      ],
      futureImprovements: [
        'Wearable device Bluetooth Web API integration',
        'Automated SMS / WhatsApp alerts for caregivers',
      ],
    },
  ];
}

function generateFallbackRealityCheck(idea: any, profile: any) {
  return {
    id: `rc-${Date.now()}`,
    projectId: idea.id,
    overallScore: 88,
    verdict: 'Highly Recommended',
    dimensions: {
      feasibility: {
        name: 'Feasibility',
        score: 92,
        rating: 'High',
        explanation: 'The architecture uses established web patterns and serverless Google Cloud services requiring no dedicated hardware.',
      },
      technicalComplexity: {
        name: 'Technical Complexity',
        score: 78,
        rating: 'Medium',
        explanation: 'Balanced difficulty: challenging enough to earn top academic marks while avoiding unmanageable distributed systems traps.',
      },
      skillMatch: {
        name: 'Skill Match',
        score: 94,
        rating: 'High',
        explanation: `Strong alignment with student's skills in ${(profile?.technicalSkills || []).slice(0, 3).join(', ')}.`,
      },
      timeSuitability: {
        name: 'Time Suitability',
        score: 90,
        rating: 'High',
        explanation: `Easily decomposable into 6 two-week sprints fitting cleanly within ${profile?.availableTime || '2–3 months'}.`,
      },
      innovationPotential: {
        name: 'Innovation Potential',
        score: 86,
        rating: 'High',
        explanation: 'Integrates real-time AI reasoning into standard workflow, differentiating it from ordinary CRUD projects.',
      },
      resourceRequirements: {
        name: 'Resource Requirements',
        score: 85,
        rating: 'High',
        explanation: 'Operates 100% within free tiers of Firebase, Gemini API, and Cloud Run without requiring paid infrastructure.',
      },
      aiDependency: {
        name: 'AI Dependency',
        score: 72,
        rating: 'Medium',
        explanation: 'AI enhances the core product meaningfully, but the system continues to function gracefully even during network dips.',
      },
      risk: {
        name: 'Risk Level',
        score: 68,
        rating: 'Medium',
        explanation: 'Low technical risk provided authentication and Firestore security rules are configured early.',
      },
      scalability: {
        name: 'Scalability',
        score: 88,
        rating: 'High',
        explanation: 'Serverless architecture scales horizontally on Google Cloud without manual server provisioning.',
      },
      overallSuitability: {
        name: 'Overall Suitability',
        score: 88,
        rating: 'High',
        explanation: 'Outstanding capstone candidate with rigorous academic merit and clear industry portfolio appeal.',
      },
    },
    whyThisWorks: [
      'Addresses a genuine problem with measurable success metrics.',
      'Leverages Google services (Firebase + Gemini) meaningfully without unnecessary bloat.',
      'Has a clean, modular roadmap that guarantees a working MVP even under strict deadlines.',
    ],
    potentialRisks: [
      'Scope creep: Trying to build too many auxiliary panels before the core journey is solid.',
      'Neglecting Firestore security rules early in development.',
      'Relying on client-side AI keys instead of secure server-side routes.',
    ],
    howToReduceRisks: [
      'Build strictly in phases following the ProjectForge development roadmap.',
      'Deploy the provided firestore.rules early to ensure authorization tests pass.',
      'Maintain all Gemini API calls server-side in server.ts with defensive error boundaries.',
    ],
    recommendedChanges: [
      'Add an automated export function so professors can review the blueprint offline as PDF/Markdown.',
      'Include interactive milestone checklists to track weekly progress clearly for college reviews.',
    ],
    analyzedAt: Date.now(),
  };
}

function generateFallbackBlueprint(idea: any, profile: any) {
  return {
    id: `blueprint-${Date.now()}`,
    projectId: idea.id,
    projectOverview: `${idea.title} is an engineering project engineered to solve ${idea.problemStatement}. It provides a unified, secure platform featuring real-time persistence and Gemini AI intelligence.`,
    problem: idea.problemStatement,
    targetUsers: idea.targetUsers || ['Engineering Students', 'Industry Mentors', 'Project Evaluators'],
    proposedSolution: idea.proposedSolution,
    uniqueValue: 'Combines verified Google Cloud infrastructure with proactive AI mentoring and reality checks.',
    coreFeatures: idea.keyFeatures || [
      'Secure User Authentication & Profile Management',
      'Real-time Firestore Workspace Persistence',
      'Context-Aware AI Guidance & Evaluation Engine',
      'Interactive 6-Phase Milestone Roadmap',
    ],
    optionalFeatures: [
      'Multi-user team sharing with permission tiers',
      'Automated viva exam quiz generator',
    ],
    recommendedTechStack: idea.recommendedTechnologies || [
      {
        name: 'React 19 & TypeScript',
        category: 'Frontend',
        purpose: 'WHAT: Core single-page application framework',
        why: 'WHY: Type-safety and component modularity minimize bugs',
        how: 'HOW: Manages UI state, dashboards, and forms',
        isGoogleService: false,
      },
      {
        name: 'Firebase Authentication',
        category: 'Backend',
        purpose: 'WHAT: User identity & JWT token provider',
        why: 'WHY: Industry standard secure sign-in with Google and email',
        how: 'HOW: Enforces access control on private student projects',
        isGoogleService: true,
      },
      {
        name: 'Cloud Firestore',
        category: 'Database',
        purpose: 'WHAT: Real-time NoSQL cloud document database',
        why: 'WHY: Instant live sync, offline support, and flexible data model',
        how: 'HOW: Stores user profiles, project blueprints, and milestone records',
        isGoogleService: true,
      },
      {
        name: 'Gemini 3.8 Flash (@google/genai)',
        category: 'AI / ML',
        purpose: 'WHAT: Generative AI and evaluation engine',
        why: 'WHY: Fast contextual reasoning with high accuracy and low latency',
        how: 'HOW: Powers reality checks, idea refinement, and mentor Q&A',
        isGoogleService: true,
      },
    ],
    architectureOverview: 'Client-Server architecture where React communicates with Express API routes for secure Gemini calls, and connects to Firebase Auth and Firestore for encrypted document synchronization.',
    architectureNodes: [
      { layer: 'Frontend Layer', component: 'React SPA', technology: 'React + Tailwind CSS', role: 'Interactive user dashboard, roadmap checklists, and chat interface' },
      { layer: 'Security Layer', component: 'Firebase Auth', technology: 'Google Identity / Firebase', role: 'Issues cryptographic tokens and verifies student accounts' },
      { layer: 'Backend Layer', component: 'Express API Server', technology: 'Node.js & Express', role: 'Server-side API routes that safely interface with Gemini without exposing keys' },
      { layer: 'Database Layer', component: 'Cloud Firestore', technology: 'Google Cloud Firestore', role: 'ACID document persistence governed by strict firestore.rules' },
      { layer: 'AI Intelligence', component: 'Gemini 3.8 Flash', technology: '@google/genai SDK', role: 'Executes reality checks, dynamic blueprints, and mentor conversations' },
    ],
    databaseDesign: {
      description: 'Hierarchical Firestore schema with strict attribute-based access control.',
      collections: [
        {
          name: 'users/{userId}',
          purpose: 'Private student profile data (skills, experience, preferences)',
          sampleFields: ['id', 'name', 'email', 'skills', 'experienceLevel', 'updatedAt'],
        },
        {
          name: 'projects/{projectId}',
          purpose: 'Top-level project workspace containing blueprint and reality check',
          sampleFields: ['id', 'userId', 'title', 'domain', 'difficulty', 'progressPercentage'],
        },
        {
          name: 'projects/{projectId}/milestones/{milestoneId}',
          purpose: 'Granular development tasks tracked across 6 phases',
          sampleFields: ['id', 'phaseNumber', 'title', 'status', 'expectedOutput'],
        },
        {
          name: 'projects/{projectId}/mentorMessages/{messageId}',
          purpose: 'Audit log of student questions and AI mentor recommendations',
          sampleFields: ['id', 'sender', 'content', 'timestamp'],
        },
      ],
    },
    apiBackendRequirements: [
      { endpoint: '/api/gemini/generate-ideas', method: 'POST', purpose: 'Generates customized project candidates', security: 'Authenticated user session' },
      { endpoint: '/api/gemini/reality-check', method: 'POST', purpose: 'Scores 10 dimensions of feasibility', security: 'Payload bounds validation' },
      { endpoint: '/api/gemini/blueprint', method: 'POST', purpose: 'Creates 18-section architectural blueprint', security: 'Strict input sanitization' },
      { endpoint: '/api/gemini/mentor', method: 'POST', purpose: 'Answers student engineering questions', security: 'Project ownership validation' },
    ],
    aiComponents: [
      {
        service: 'Gemini 3.8 Flash via @google/genai',
        role: 'Synthesizes student skills into viable engineering projects and acts as round-the-clock mentor',
        promptStrategy: 'Structured JSON instructions with deterministic temperatures and fallback heuristics',
      },
    ],
    securityConsiderations: [
      'Server-side Gemini API execution: Client never receives the raw GEMINI_API_KEY.',
      'Firestore Security Rules: Document-level ownerId validation for read, write, update, and delete.',
      'Input Sanitization: Length caps and regex validation for all document identifiers.',
      'Defensive Error Boundaries: Prevents stack trace disclosure to end users.',
    ],
    developmentRoadmap: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        title: 'Phase 1: Project Scope & Planning',
        objectives: ['Define requirements', 'Validate problem statement', 'Complete reality check'],
        estimatedDuration: '1-2 weeks',
        dependencies: ['Idea selection'],
        status: 'Completed',
        tasks: [
          { id: 't1-1', title: 'Define Core User Stories & Personas', description: 'Specify primary user journeys and workflows.', status: 'Completed', expectedOutput: 'Requirements specification' },
          { id: 't1-2', title: 'Complete Feasibility & Reality Check', description: 'Evaluate technical complexity and resource requirements.', status: 'Completed', expectedOutput: 'Reality Check Report (Score 85+)' },
        ],
      },
      {
        id: 'phase-2',
        phaseNumber: 2,
        title: 'Phase 2: Environment & Foundation',
        objectives: ['Setup repository', 'Configure Firebase Auth & Firestore', 'Verify server-side API'],
        estimatedDuration: '1-2 weeks',
        dependencies: ['Phase 1'],
        status: 'In Progress',
        tasks: [
          { id: 't2-1', title: 'Initialize Project & Dependencies', description: 'Configure React, Vite, Tailwind CSS, and Express server.', status: 'Completed', expectedOutput: 'Clean compile and build' },
          { id: 't2-2', title: 'Configure Firebase Security Rules', description: 'Write firestore.rules to protect private user projects.', status: 'In Progress', expectedOutput: 'Passing security rules audit' },
        ],
      },
      {
        id: 'phase-3',
        phaseNumber: 3,
        title: 'Phase 3: Core Module Implementation',
        objectives: ['Build main dashboard', 'Implement persistent CRUD operations', 'Handle state transitions'],
        estimatedDuration: '2-3 weeks',
        dependencies: ['Phase 2'],
        status: 'Not Started',
        tasks: [
          { id: 't3-1', title: 'Build Project Workspace Views', description: 'Implement interactive blueprint and reality check panels.', status: 'Not Started', expectedOutput: 'Working interactive UI' },
          { id: 't3-2', title: 'Connect Firestore Mutation Handlers', description: 'Save projects and update milestones in real-time.', status: 'Not Started', expectedOutput: 'Verified data persistence' },
        ],
      },
      {
        id: 'phase-4',
        phaseNumber: 4,
        title: 'Phase 4: AI Engine Integration',
        objectives: ['Implement server-side Gemini routes', 'Build AI Mentor chat', 'Add project improvement engine'],
        estimatedDuration: '1-2 weeks',
        dependencies: ['Phase 3'],
        status: 'Not Started',
        tasks: [
          { id: 't4-1', title: 'Connect Gemini API Endpoints', description: 'Implement server proxy endpoints with @google/genai SDK.', status: 'Not Started', expectedOutput: 'Live AI intelligence routes' },
          { id: 't4-2', title: 'Build Context-Aware AI Mentor Interface', description: 'Construct chat with quick prompts and follow-up chips.', status: 'Not Started', expectedOutput: 'Interactive AI mentor chat' },
        ],
      },
      {
        id: 'phase-5',
        phaseNumber: 5,
        title: 'Phase 5: Quality Assurance & Testing',
        objectives: ['Unit tests', 'Accessibility audit', 'Browser validation'],
        estimatedDuration: '1 week',
        dependencies: ['Phase 4'],
        status: 'Not Started',
        tasks: [
          { id: 't5-1', title: 'Run Security & Validation Test Suite', description: 'Test dirty payloads and verify rejection of invalid inputs.', status: 'Not Started', expectedOutput: 'Clean test runner report' },
          { id: 't5-2', title: 'Perform Accessibility Audit (WCAG AA)', description: 'Ensure full keyboard navigation and high-contrast styling.', status: 'Not Started', expectedOutput: 'Accessibility compliance report' },
        ],
      },
      {
        id: 'phase-6',
        phaseNumber: 6,
        title: 'Phase 6: Production Deployment & Viva Prep',
        objectives: ['Deploy production build', 'Document architecture', 'Prepare viva presentation'],
        estimatedDuration: '1 week',
        dependencies: ['Phase 5'],
        status: 'Not Started',
        tasks: [
          { id: 't6-1', title: 'Deploy to Cloud Run Container', description: 'Verify public URL, HTTPS certificates, and responsive design.', status: 'Not Started', expectedOutput: 'Live production URL' },
          { id: 't6-2', title: 'Prepare Viva Defense Documentation', description: 'Review architecture diagram, trade-offs, and Google services usage.', status: 'Not Started', expectedOutput: 'Final viva slides & report' },
        ],
      },
    ],
    testingStrategy: {
      unitTests: ['Verify input validation', 'Check milestone progress percentage arithmetic', 'Validate JSON parser safety'],
      integrationTests: ['Test server AI endpoints', 'Verify Firestore reads/writes', 'Test authentication persistence'],
      securityTests: ['Test cross-tenant read blocking', 'Verify server-side secret isolation', 'Check XSS handling'],
    },
    deploymentStrategy: {
      hosting: 'Cloud Run production container with automated Nginx reverse proxy',
      cicd: 'Single command build pipeline (npm run build)',
      monitoring: 'Integrated health endpoint (/api/health) and error boundary logging',
    },
    futureImprovements: [
      'Multi-student collaborative editor',
      'Automated viva exam simulator with audio feedback',
      'Integration with GitHub API for automated milestone tracking',
    ],
    potentialChallenges: [
      'Network rate limits during peak demo presentations',
      'Handling offline student environments gracefully',
    ],
    generatedAt: Date.now(),
  };
}

function generateFallbackMentorResponse(message: string, project: any) {
  const query = (message || '').toLowerCase();
  let reply = '';
  let suggestedFollowUps = [
    'How should I structure the Firestore database?',
    'What security vulnerabilities should I check before my viva?',
    'What should I build next in Phase 2?',
  ];

  if (query.includes('next') || query.includes('phase') || query.includes('start')) {
    reply = `### Recommended Next Action for **${project?.idea?.title || 'Your Project'}**

Based on your current roadmap, your immediate priority should be:
1. **Complete Database Schema & Security**: Set up your Firestore collections according to the blueprint and apply \`firestore.rules\` to secure user data.
2. **Implement Core Interactive UI**: Build the primary dashboard view where users input and view data before adding auxiliary screens.
3. **Verify API Integration**: Ensure all server-side endpoints handle loading and error states cleanly.

> **Engineering Tip:** Avoid feature creep! Stay focused on completing your Phase 2 & 3 deliverables before exploring stretch features.`;
    suggestedFollowUps = [
      'How do I test my Firestore security rules?',
      'Can you give me an architecture diagram explanation for my viva?',
      'How do I implement unit tests for this feature?',
    ];
  } else if (query.includes('database') || query.includes('firestore') || query.includes('schema')) {
    reply = `### Database Architecture for **${project?.idea?.title || 'Your Project'}**

We recommend a **hierarchical NoSQL document schema** in Cloud Firestore:

\`\`\`
users/{userId}
  ├── profile data (name, email, skills)
  └── private settings

projects/{projectId}
  ├── title, domain, status, progressPercentage
  ├── ownerId (matches auth.uid)
  ├── milestones/{milestoneId}
  └── mentorMessages/{messageId}
\`\`\`

**Why this structure works:**
- **Zero-trust security**: Rules can check \`resource.data.userId == request.auth.uid\` directly.
- **Cost-effective**: Queries are shallow and scoped to subcollections.
- **Real-time sync**: Subscribing to \`milestones\` updates your roadmap instantly when tasks are marked complete.`;
    suggestedFollowUps = [
      'How should I write the Firestore security rule for this?',
      'What happens if the user goes offline?',
      'How do I calculate total progress percentage?',
    ];
  } else if (query.includes('security') || query.includes('vulnerability') || query.includes('rules')) {
    reply = `### Security Checklist for Your Project Viva

Here are the top 4 security safeguards you should highlight to examiners:
1. **Server-Side AI Secrets**: Your \`GEMINI_API_KEY\` is kept strictly in the Node.js backend (\`server.ts\`) and is never leaked to client bundles.
2. **Attribute-Based Access Control (ABAC)**: Firestore rules block unauthorized access to other students' projects.
3. **Input Validation & Sanitization**: String lengths, regex patterns, and required fields are validated both on the client and server.
4. **Defensive Error Handling**: The frontend displays user-friendly errors while raw stack traces and internal secrets are suppressed.`;
    suggestedFollowUps = [
      'Can you give me a sample question the examiner might ask about security?',
      'How does Firebase Authentication prevent session hijacking?',
      'What testing strategies should I mention in my viva?',
    ];
  } else {
    reply = `### Project Guidance for **${project?.idea?.title || 'Your Project'}**

Regarding your question:
> "${message}"

Here is the recommended technical approach:
- **Architecture**: Keep your business logic modular. In **${project?.idea?.title || 'your project'}**, isolate the data persistence layer from presentation components.
- **Google Services**: Leverage Cloud Firestore for real-time document synchronization and Firebase Auth for secure session management.
- **Roadmap Alignment**: Check your active milestones in Phase 2/3. Complete high-priority deliverables first.

Would you like to dive deeper into any specific technology stack, database design, or test strategy?`;
  }

  return { reply, suggestedFollowUps };
}

function generateFallbackImprovements(project: any) {
  return [
    {
      id: 'imp-1',
      category: 'Security',
      priority: 'High',
      title: 'Enforce Attribute-Based Firestore Security Rules',
      description: 'Ensure that all write and update operations verify request.auth.uid == existing().userId to prevent unauthorized project modification.',
      actionSteps: [
        'Inspect firestore.rules file',
        'Verify isOwner(userId) helper on collections',
        'Run the Dirty Dozen security test payload suite',
      ],
      impact: 'Secures user projects from tampering and guarantees top marks during security evaluation.',
    },
    {
      id: 'imp-2',
      category: 'Performance',
      priority: 'Medium',
      title: 'Optimize Real-time Snapshot Listeners',
      description: 'Detach onSnapshot listeners on component unmount and cache project blueprints locally to avoid unnecessary reads.',
      actionSteps: [
        'Add cleanup functions in useEffect',
        'Implement indexed/local storage cache for static blueprint data',
      ],
      impact: 'Reduces Firestore read counts by up to 60% and ensures instant page transitions.',
    },
    {
      id: 'imp-3',
      category: 'Testing',
      priority: 'High',
      title: 'Implement Automated Unit & Security Test Suite',
      description: 'Add tests validating input constraints, milestone math, and schema consistency.',
      actionSteps: [
        'Run the integrated in-app test runner',
        'Validate error boundaries on malformed network payloads',
      ],
      impact: 'Directly fulfills the hackathon "Testing" evaluation criterion.',
    },
    {
      id: 'imp-4',
      category: 'Presentation / Viva',
      priority: 'Medium',
      title: 'Add One-Click Markdown / JSON Project Export',
      description: 'Enable students to export their complete 18-section Project Blueprint to Markdown or JSON for their final university thesis report.',
      actionSteps: [
        'Provide export button on Blueprint view',
        'Format cleanly with headers, code blocks, and diagrams',
      ],
      impact: 'Delivers immense practical value to college students preparing their submission document.',
    },
    {
      id: 'imp-5',
      category: 'UX & Design',
      priority: 'Low',
      title: 'Enhance Keyboard Navigation & Focus Rings',
      description: 'Ensure all milestone checkboxes, tabs, and action buttons have high-contrast focus-visible rings and ARIA attributes.',
      actionSteps: [
        'Add aria-labels to icon buttons',
        'Test complete flow using keyboard TAB/ENTER only',
      ],
      impact: 'Guarantees WCAG AA accessibility compliance.',
    },
  ];
}

// Start Server and Mount Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ProjectForge Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
