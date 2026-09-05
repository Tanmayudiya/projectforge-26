# ProjectForge: AI-Powered Engineering Capstone Mentor & Architecture Generator

> **Forge Your Idea. Build Your Future.**  
> An intelligent capstone mentorship platform designed for engineering students to discover, validate, plan, and build production-grade final-year projects.

---

## 📌 Executive Summary / Abstract

Final-year engineering and computer science students often struggle with three critical challenges during their capstone project lifecycle:
1. **Idea Selection Dilemma**: Picking either over-ambitious projects that cannot be completed within semester deadlines, or trivial projects that fail academic viva evaluations.
2. **Lack of Concrete Technical Specifications**: Jumping straight into code without architectural blueprints, data schemas, API contracts, or security rules.
3. **Viva & Defense Anxiety**: Inability to defend architectural tradeoffs, database design, and security invariants in front of university external examiners.

**ProjectForge** resolves these bottlenecks by combining **Generative AI (Gemini 2.5/3.8 Flash via `@google/genai`)**, **deterministic mathematical evaluation models**, and **structured engineering roadmaps**. The system conditions recommendations on the student's actual skillset, available timeline, team size, and domain interests, generating comprehensive 18-section technical blueprints and guiding students through a 6-phase development lifecycle.

---

## 🌟 Key Features

### 1. 🎓 Personalized Student Profile Conditioning
- Collects technical skills (languages, frameworks, databases), experience level, project purpose (academic capstone, hackathon, portfolio), available timeline (1 to 6 months), and team size.
- Customizes all subsequent idea suggestions, complexity scores, and mentoring guidance to the student's constraints.

### 2. 💡 3-Tier Curated Project Idea Generator
- Generates 3 distinct archetypes for every inquiry:
  - **The Safe Bet**: High feasibility, standard tech stack, guaranteed to complete within semester deadlines.
  - **The Ambitious Build**: Higher technical complexity, resume-defining, ideal for teams aiming for top grades or research papers.
  - **The Unique Angle**: Novel problem domain, modern architectural patterns, standing out to viva panels.
- Includes problem statements, real-world impact, core feature scopes, recommended tech stacks, and academic defense angles.

### 3. 🛡️ 10-Dimension Mathematical Reality Check
- Quantitatively audits any project idea across 10 vital engineering dimensions:
  1. *Technical Feasibility*
  2. *Timeline Compatibility*
  3. *Skill-to-Scope Match*
  4. *Academic Depth & Rigor*
  5. *Viva Defense Defensibility*
  6. *Data Availability & Acquisition*
  7. *Hardware & Cloud Cost Viability*
  8. *Security & Privacy Surface*
  9. *Scalability Potential*
  10. *Industry & Employment Relevance*
- Outputs an overall Feasibility Index (0–100), risk classifications (*Low, Moderate, High*), identified engineering pitfalls, and actionable risk mitigations.

### 4. 📐 18-Section Production Technical Blueprint
- Comprehensive architectural blueprint exported in structured Markdown:
  - Executive Overview & System Boundaries
  - Component Architecture & Data Flow
  - Database Entity Schema (Firestore / Relational SQL)
  - API Contracts (REST / RPC with request/response payloads)
  - Firebase Authentication & Hardened Security Rules
  - State Management & Component Hierarchy
  - Error Handling & Graceful Degradation Strategy
  - Step-by-Step Implementation Sequence
  - Sample Viva Defense Questions with Model Answers
  - One-click Markdown copy and download for project synopsis reports.

### 5. 🗺️ Interactive 6-Phase Milestone Development Roadmap
- Tracks progress across 6 structured software engineering phases:
  - **Phase 1: Planning & Scope Definition**
  - **Phase 2: Project Setup & Environment Configuration**
  - **Phase 3: Core Module Development**
  - **Phase 4: AI & Service Integration**
  - **Phase 5: Automated Testing & Security Audit**
  - **Phase 6: Deployment & Viva Defense Preparation**
- Live task status cycling (`Not Started` ➔ `In Progress` ➔ `Completed`) with real-time percentage recalculation and dashboard notifications.

### 6. 🤖 Context-Aware AI Project Mentor
- An interactive AI engineering mentor that knows the student's active project, tech stack, roadmap progress, and identified risks.
- Provides contextual guidance on database modeling, debugging, security auditing, and college viva preparation with quick-action prompts.

### 7. 🚀 Engineering Improvement Advisor
- Analyzes existing project code and plans to suggest concrete enhancements across **Missing Features**, **Security**, **Performance**, **Testing**, and **Viva Presentation**.

### 8. 🧪 Automated In-App Verification Suite
- Built-in test runner auditing platform invariants:
  - Security rule enforcement (unauthenticated and cross-user write isolation).
  - Mathematical integrity of completion percentages.
  - 10-dimension evaluation scale validation.
  - 18-section blueprint schema completeness.
  - WCAG AA accessibility compliance.

---

## 🏗️ System Architecture & Data Flow
┌────────────────────────────────────────────────────────────────────────┐
│ Client Application │
│ (React 19 + TypeScript + Tailwind CSS) │
├──────────────────┬──────────────────┬──────────────────┬───────────────┤
│ Student Profile │ Idea Generator │ Reality Checker │ Blueprint View│
│ & Dashboard │ & Portfolio │ 10-Dim Audit │ & 6-Phase Map │
└────────┬─────────┴────────┬─────────┴────────┬─────────┴───────┬───────┘
│ │ │ │
▼ ▼ ▼ ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Secure Express Backend (server.ts) │
│ Listening on 0.0.0.0:3000 │
├────────────────────────────────────────────────────────────────────────┤
│ POST /api/generate-ideas POST /api/reality-check │
│ POST /api/generate-blueprint POST /api/mentor-chat │
│ POST /api/project-improvements GET /api/health │
└──────────────────────────────────┬─────────────────────────────────────┘
│ (process.env.GEMINI_API_KEY)
▼
┌────────────────────────────────────────────────────────────────────────┐
│ Google Gemini AI API Platform │
│ Model: gemini-2.5-flash │
│ (@google/genai Server-Side SDK with JSON Schema) │
└───────────────────────────────────────────────────────────────────────
---

## 💻 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19, TypeScript | Reactive, type-safe single-page application |
| **Styling & Icons** | Tailwind CSS v4, Lucide React | High-contrast, responsive UI with WCAG AA compliance |
| **Animation & UX** | Motion (`motion/react`) | View transitions and milestone state indicators |
| **Content Rendering** | React Markdown (`react-markdown`) | Rich markdown rendering for blueprints and mentor chat |
| **Backend Framework** | Node.js, Express.js | Server-side proxy isolating Gemini API secrets |
| **AI SDK** | `@google/genai` (Gemini 2.5/3.8 Flash) | High-speed structured JSON generation and chat |
| **Database & Auth** | Firebase Auth & Firestore Rules | User identity, persistent blueprints, role-based rules |
| **Local Persistence** | `localStorage` + Memory Service | Instant caching, offline usability, zero cold-start delay |
| **Bundler & Build** | Vite 6 + `esbuild` | Dual client bundle (`dist/`) & single server (`server.cjs`) |
| **Deployment Target** | Google Cloud Run (Port 3000) | Serverless container deployment with auto-scaling |

---

## 📂 Project Directory Structure
projectforge/
├── .env.example # Environment variables documentation
├── index.html # Single-page HTML entry point
├── metadata.json # AI Studio metadata & permission configuration
├── package.json # Dependencies and build scripts
├── README.md # Project documentation & academic report
├── server.ts # Full-stack Express backend & Vite middleware
├── tsconfig.json # TypeScript compiler configuration
├── vite.config.ts # Vite frontend bundler configuration
│
└── src/
├── App.tsx # Main state orchestrator & view router
├── main.tsx # React DOM entry point
├── index.css # Tailwind CSS entry imports
│
├── types/
│ └── index.ts # Global TypeScript interfaces & schemas
│
├── services/
│ ├── gemini.ts # Client API service proxying server endpoints
│ └── storage.ts # LocalStorage & demo seed persistence engine
│
└── components/
├── layout/
│ ├── Header.tsx # Top navigation & project switcher
│ └── Footer.tsx # Academic citations & system status footer
├── landing/
│ └── LandingView.tsx # Hero overview, feature grid & CTA
├── onboarding/
│ └── StudentProfileForm.tsx # 4-step student profile onboarding
├── dashboard/
│ └── DashboardView.tsx # Main student command center & next actions
├── generator/
│ └── IdeaGeneratorView.tsx # 3-tier idea generator with filtering
├── reality-check/
│ └── RealityCheckView.tsx # 10-dimension mathematical audit view
├── blueprint/
│ └── BlueprintView.tsx # 18-section technical specification view
├── roadmap/
│ └── RoadmapView.tsx # Interactive 6-phase milestone checklist
├── mentor/
│ └── MentorView.tsx # Context-aware AI technical mentor chat
├── improvements/
│ └── ImprovementsView.tsx # Architecture and security advisor
├── projects/
│ └── SavedProjectsView.tsx # Student portfolio & project management
├── settings/
│ └── SettingsView.tsx # Cloud diagnostics & demo reset controls
└── tests/
└── TestRunnerModal.tsx # In-app automated verification suite
---

## ⚙️ Getting Started & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

### 2. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd projectforge

# Install dependencies
npm install
👥 Student & Submission Details
Project Title: ProjectForge — AI-Powered Engineering Capstone Mentor & Architecture Generator
Domain: Artificial Intelligence, Full-Stack Web Engineering, EdTech
Target Degree: Bachelor of Engineering / Bachelor of Technology (B.E. / B.Tech in CSE / AIML / IT)
Academic Year: 2025–2026
Developer / Student: Tanmay Udiya (swe.tanmayudiya@gmail.com)
Institution: Parul University, Faculty of Engineering & Technology
