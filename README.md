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
