import React, { useState } from 'react';
import {
  StudentProfile,
  ExperienceLevel,
  ProjectPurpose,
  AvailableTime,
  TeamSize,
} from '../../types';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  Clock,
  Users,
  Code2,
  BookOpen,
} from 'lucide-react';

interface OnboardingViewProps {
  initialProfile: StudentProfile | null;
  onSaveProfile: (profile: StudentProfile) => void;
  onContinueToGenerator: () => void;
}

const DOMAIN_OPTIONS = [
  'Artificial Intelligence & ML',
  'Full-Stack Web Development',
  'Mobile App Development',
  'Cybersecurity & Network Defense',
  'Cloud Computing & DevOps',
  'Data Science & Analytics',
  'IoT & Embedded Systems',
  'Healthcare Tech',
  'FinTech & Blockchain',
  'EdTech & Social Impact',
];

const INTEREST_OPTIONS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Mobile Development',
  'Cybersecurity',
  'Cloud Computing',
  'Data Science',
  'IoT',
  'Education',
  'Healthcare',
  'Environment',
  'Finance',
  'Social Impact',
];

const SKILL_SUGGESTIONS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Python',
  'Node.js',
  'Express',
  'Firebase',
  'Tailwind CSS',
  'Next.js',
  'MongoDB',
  'PostgreSQL',
  'Docker',
  'FastAPI',
  'TensorFlow',
  'PyTorch',
  'Git',
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  initialProfile,
  onSaveProfile,
  onContinueToGenerator,
}) => {
  const [name, setName] = useState(initialProfile?.name || 'Tanmay Udiya');
  const [email, setEmail] = useState(initialProfile?.email || 'swe.tanmayudiya@gmail.com');
  const [interests, setInterests] = useState<string[]>(
    initialProfile?.interests || ['Artificial Intelligence', 'Web Development', 'Cloud Computing']
  );
  const [skills, setSkills] = useState<string[]>(
    initialProfile?.technicalSkills || ['React', 'TypeScript', 'Node.js', 'Firebase', 'Tailwind CSS']
  );
  const [customSkill, setCustomSkill] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    initialProfile?.experienceLevel || 'Intermediate'
  );
  const [preferredDomain, setPreferredDomain] = useState(
    initialProfile?.preferredDomain || 'Artificial Intelligence & ML'
  );
  const [projectPurpose, setProjectPurpose] = useState<ProjectPurpose>(
    initialProfile?.projectPurpose || 'Academic project'
  );
  const [availableTime, setAvailableTime] = useState<AvailableTime>(
    initialProfile?.availableTime || '2–3 months'
  );
  const [teamSize, setTeamSize] = useState<TeamSize>(
    initialProfile?.teamSize || 'Solo (1)'
  );
  const [preferredTechnologies, setPreferredTechnologies] = useState<string[]>(
    initialProfile?.preferredTechnologies || ['React', 'Firebase', 'Gemini API']
  );
  const [existingIdea, setExistingIdea] = useState(
    initialProfile?.existingIdea || 'An intelligent capstone mentorship platform for engineering students.'
  );
  const [learningGoals, setLearningGoals] = useState<string[]>(
    initialProfile?.learningGoals || ['Full-stack architecture', 'Security rules', 'Google Cloud services']
  );
  const [constraints, setConstraints] = useState(
    initialProfile?.constraints || 'Must be deployable on free-tier infrastructure with complete security rules.'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleSkill = (item: string) => {
    setSkills((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const addCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(customSkill.trim())) {
        setSkills([...skills, customSkill.trim()]);
      }
      setCustomSkill('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const profile: StudentProfile = {
      id: initialProfile?.id || `student-${Date.now()}`,
      name: name.trim() || 'Engineering Student',
      email: email.trim(),
      interests,
      technicalSkills: skills,
      experienceLevel,
      preferredDomain,
      projectPurpose,
      availableTime,
      teamSize,
      preferredTechnologies,
      existingIdea: existingIdea.trim(),
      learningGoals,
      constraints: constraints.trim(),
      createdAt: initialProfile?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    onSaveProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => {
      onContinueToGenerator();
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-100">
      {/* Header Banner */}
      <div className="mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Student Onboarding & Technical Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Configure Your Capstone Engineering Profile
        </h1>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
          ProjectForge uses your actual profile to synthesize feasible, highly-relevant project candidates. Fill in your genuine skills and semester constraints.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Student Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs">1</span>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="student-name" className="block text-xs font-medium text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                id="student-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanmay Udiya"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="student-email" className="block text-xs font-medium text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                id="student-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@paruluniversity.ac.in"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Domain & Interests */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs">2</span>
            Domain & Areas of Interest
          </h2>

          <div className="mb-5">
            <label htmlFor="preferred-domain" className="block text-xs font-medium text-slate-300 mb-1">
              Primary Preferred Domain *
            </label>
            <select
              id="preferred-domain"
              value={preferredDomain}
              onChange={(e) => setPreferredDomain(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {DOMAIN_OPTIONS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Specific Interest Tags (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const selected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Technical Skills & Experience Level */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs">3</span>
            Skills & Experience Level
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setExperienceLevel(level)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  experienceLevel === level
                    ? 'bg-blue-900/30 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-xs text-white">{level}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {level === 'Beginner' && 'Foundational programming knowledge'}
                  {level === 'Intermediate' && 'Comfortable with frameworks & databases'}
                  {level === 'Advanced' && 'Experienced with architecture & deployment'}
                </div>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Known Technical Skills & Libraries (Click to toggle or type below)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {SKILL_SUGGESTIONS.map((skill) => {
                const selected = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                      selected
                        ? 'bg-emerald-900/40 text-emerald-300 border-emerald-600'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {skill} {selected && '✓'}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={addCustomSkill}
                placeholder="Type custom skill and press Enter..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (customSkill.trim() && !skills.includes(customSkill.trim())) {
                    setSkills([...skills, customSkill.trim()]);
                    setCustomSkill('');
                  }
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Timeline, Team, & Purpose */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs">4</span>
            Project Scope & Constraints
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="available-time" className="block text-xs font-medium text-slate-300 mb-1">
                Available Time *
              </label>
              <select
                id="available-time"
                value={availableTime}
                onChange={(e) => setAvailableTime(e.target.value as AvailableTime)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="1 month">1 month (Fast MVP)</option>
                <option value="2–3 months">2–3 months (Standard Capstone)</option>
                <option value="4–6 months">4–6 months (Full Semester)</option>
                <option value="6+ months">6+ months (Honors / Research)</option>
              </select>
            </div>

            <div>
              <label htmlFor="team-size" className="block text-xs font-medium text-slate-300 mb-1">
                Team Size *
              </label>
              <select
                id="team-size"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value as TeamSize)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Solo (1)">Solo (1 Developer)</option>
                <option value="Small (2-3)">Small Team (2–3)</option>
                <option value="Medium (4-5)">Medium Team (4–5)</option>
              </select>
            </div>

            <div>
              <label htmlFor="project-purpose" className="block text-xs font-medium text-slate-300 mb-1">
                Primary Goal *
              </label>
              <select
                id="project-purpose"
                value={projectPurpose}
                onChange={(e) => setProjectPurpose(e.target.value as ProjectPurpose)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Academic project">Academic final-year project</option>
                <option value="Resume project">Portfolio & Placement builder</option>
                <option value="Startup idea">Startup / Commercial MVP</option>
                <option value="Research">Academic Research / Publication</option>
                <option value="Social impact">Social & Non-profit Impact</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="existing-idea" className="block text-xs font-medium text-slate-300 mb-1">
                Existing Idea Seed (Optional)
              </label>
              <input
                id="existing-idea"
                type="text"
                value={existingIdea}
                onChange={(e) => setExistingIdea(e.target.value)}
                placeholder="e.g. A telemedicine app or an automated resume analyzer"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-500">
                If you already have a seed thought, the AI will expand, validate, and structure it.
              </span>
            </div>

            <div>
              <label htmlFor="constraints" className="block text-xs font-medium text-slate-300 mb-1">
                Known Constraints or Limitations (Optional)
              </label>
              <input
                id="constraints"
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. Free tier hosting only, no dedicated GPU available"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit & Continue */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>Profile is automatically synchronized and saved for your session.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="save-profile-btn"
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save & Generate Project Ideas</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
