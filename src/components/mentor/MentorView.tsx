import React, { useState, useRef, useEffect } from 'react';
import { SavedProject, StudentProfile, MentorMessage } from '../../types';
import { geminiService } from '../../services/gemini';
import { storageService } from '../../services/storage';
import {
  Bot,
  Send,
  User,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Shield,
  FileCheck2,
  Database,
  ArrowRight,
  Code2,
} from 'lucide-react';
import Markdown from 'react-markdown';

interface MentorViewProps {
  project: SavedProject | null;
  profile: StudentProfile | null;
  onSaveMessage: (message: MentorMessage) => void;
  onNavigateToRoadmap: () => void;
  onNavigateToGenerator: () => void;
}

export const MentorView: React.FC<MentorViewProps> = ({
  project,
  profile,
  onSaveMessage,
  onNavigateToRoadmap,
  onNavigateToGenerator,
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages: MentorMessage[] = project ? storageService.getMentorMessages(project.id) : [
    {
      id: 'welcome-msg',
      sender: 'mentor',
      text: `Hello ${profile?.name || 'Engineer'}! I am your ProjectForge AI Technical Mentor. I have reviewed your selected project **"${project?.idea.title || 'Engineering Capstone'}"**, your current development progress (${project?.progressPercentage || 0}%), and your background in **${profile?.technicalSkills.slice(0, 3).join(', ') || 'Web & AI'}**.\n\nHow can I help you build, architect, or debug today? Feel free to ask about your next milestone, security hardening, database modeling, or college viva defense questions.`,
      content: `Hello ${profile?.name || 'Engineer'}! I am your ProjectForge AI Technical Mentor. I have reviewed your selected project **"${project?.idea.title || 'Engineering Capstone'}"**, your current development progress (${project?.progressPercentage || 0}%), and your background in **${profile?.technicalSkills.slice(0, 3).join(', ') || 'Web & AI'}**.\n\nHow can I help you build, architect, or debug today? Feel free to ask about your next milestone, security hardening, database modeling, or college viva defense questions.`,
      timestamp: Date.now(),
      suggestedFollowUps: [
        'What should I build next?',
        'What will the viva examiner ask about this project?',
        'How should I implement authentication and security rules?',
      ],
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput('');
    const userMsg: MentorMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      content: query,
      text: query,
      timestamp: Date.now(),
    };
    onSaveMessage(userMsg);

    setLoading(true);
    try {
      const response = await geminiService.askMentor(
        query,
        project,
        profile,
        messages
      );

      const mentorMsg: MentorMessage = {
        id: `mentor-msg-${Date.now()}`,
        sender: 'mentor',
        content: response.reply,
        text: response.reply,
        timestamp: Date.now(),
        suggestedFollowUps: response.suggestedFollowUps,
      };
      onSaveMessage(mentorMsg);
    } catch (err: any) {
      console.error('Mentor error:', err);
      const errorMsg: MentorMessage = {
        id: `mentor-error-${Date.now()}`,
        sender: 'mentor',
        content: `I encountered an error connecting to the AI mentor engine: ${err.message}. Please try asking your question again.`,
        text: `I encountered an error connecting to the AI mentor engine: ${err.message}. Please try asking your question again.`,
        timestamp: Date.now(),
      };
      onSaveMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const presetQueries = [
    'What should I build next?',
    'What will the viva examiner ask about this project?',
    'How should I test this feature?',
    'Which database structure should I use?',
    'What security problems should I check?',
    'I completed Phase 2. What should I do next?',
  ];

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-100">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
          <Bot className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">No Active Project Selected</h2>
          <p className="text-xs text-slate-400 mb-6">
            The AI Mentor operates with full awareness of your selected project's architecture, completed milestones, and skills. Please select or save a project first.
          </p>
          <button
            onClick={onNavigateToGenerator}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
          >
            Select a Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-100 flex flex-col h-[calc(100vh-8rem)]">
      {/* Mentor Header Context Ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-4 flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white">ProjectForge AI Mentor</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-semibold">
                Context-Aware
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active Project: <strong className="text-slate-200">{project.idea.title}</strong> ({project.progressPercentage}% Completed)
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToRoadmap}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1 self-start sm:self-auto bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          <span>View Active Milestones</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex-shrink-0 mb-3 overflow-x-auto pb-1 flex gap-2">
        {presetQueries.map((query, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(query)}
            disabled={loading}
            className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user' || (msg.sender as string) === 'student';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80'
                }`}
              >
                <div className="prose prose-invert prose-xs max-w-none">
                  <Markdown>{msg.content || msg.text || ''}</Markdown>
                </div>

                {/* Suggested Follow-Ups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block w-full mb-1">
                      Suggested Follow-Ups:
                    </span>
                    {msg.suggestedFollowUps.map((followUp, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handleSendMessage(followUp)}
                        disabled={loading}
                        className="text-[10px] bg-slate-900 hover:bg-slate-950 text-blue-300 px-2 py-1 rounded border border-blue-900/60 transition-colors"
                      >
                        {followUp} →
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-800 px-4 py-3 rounded-2xl border border-slate-700 text-xs text-slate-400 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              <span>Analyzing code architecture and project state...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-3 flex-shrink-0 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${project.idea.title}, viva questions, bugs, or architecture...`}
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
