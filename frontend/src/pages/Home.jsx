import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { GiArtificialHive, GiSparkles } from "react-icons/gi"
import { FaArrowRight, FaCheck, FaCode, FaMicrophone, FaPlay, FaRegFileAlt, FaShieldAlt, FaTerminal } from "react-icons/fa"
import { 
  FiMic, 
  FiFileText, 
  FiBarChart2, 
  FiMap, 
  FiCode, 
  FiCheckCircle, 
  FiCpu, 
  FiAward, 
  FiZap, 
  FiChevronDown, 
  FiLayers, 
  FiTrendingUp, 
  FiTerminal as FiTerminalIcon,
  FiArrowUpRight
} from "react-icons/fi"
import LoginModel from '../components/LoginModel'

const SANDBOX_MODES = [
  {
    id: "technical",
    label: "01. Coding & DSA",
    role: "Senior Backend Engineer",
    question: "Design an LRU Cache with O(1) get and put operations. Explain how you prevent race conditions under high concurrency.",
    codeSnippet: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n}`,
    scores: { algorithmic: 94, latency: 98, systemDesign: 88 },
    feedback: "Exceptional mastery of hashmap-doubly-linked-list hybrid structures with optimal cache invalidation."
  },
  {
    id: "system",
    label: "02. System Design",
    role: "Staff Infrastructure Architect",
    question: "How would you architect a globally distributed rate limiter handling 500,000 req/s with sub-5ms p99 latency?",
    codeSnippet: `// Redis sliding window + local token bucket\nasync function rateLimit(userId, limit = 100, windowSec = 60) {\n  const now = Date.now();\n  const windowStart = now - (windowSec * 1000);\n  const key = \`ratelimit:\${userId}\`;\n  return await redis.evalSha(LUA_SLIDING_WINDOW, 1, key, now, windowStart, limit);\n}`,
    scores: { algorithmic: 90, latency: 96, systemDesign: 95 },
    feedback: "Clear architectural tradeoff: Lua atomic script reduces round-trips while local in-memory fallback protects Redis."
  },
  {
    id: "behavioral",
    label: "03. Leadership & STAR",
    role: "Engineering Manager",
    question: "Describe a high-stakes production outage where conflicting stakeholder priorities arose. How did you resolve the deadlock?",
    codeSnippet: `// STAR Matrix Evaluation:\n[Situation] Payment gateway latency spike at 99.4% peak load\n[Task] Restore checkout reliability within 15-minute SLA\n[Action] Implemented dynamic circuit breaker & degraded analytics\n[Result] 99.98% uptime preserved; zero financial transaction loss`,
    scores: { algorithmic: 85, latency: 92, systemDesign: 96 },
    feedback: "Decisive cross-functional leadership, structured root-cause transparency, and blameless post-mortem execution."
  }
];

const FAQS = [
  {
    q: "How realistic is the AI voice and coding interview environment?",
    a: "Our interviews utilize real-time voice speech synthesis, live code execution in Monaco IDE, and multi-agent evaluators that analyze your answers according to actual FAANG / Tier-1 rubric benchmarks."
  },
  {
    q: "How does the ATS Resume Scorer evaluate my resume?",
    a: "It parses your PDF structure, analyzes keyword density against target job descriptions, identifies weak metric phrasing, and suggests concrete impact-focused revisions."
  },
  {
    q: "Can I practice for specific tech stacks and senior roles?",
    a: "Yes. You can select exact roles (Frontend, Backend, Fullstack, DevOps, ML/AI), target seniority levels (Junior, Mid, Senior, Staff), and custom difficulty parameters."
  },
  {
    q: "Are the interview recordings and reports downloadable?",
    a: "Yes. You receive a complete diagnostic report with radar charts, question-by-question scoring, transcribed audio logs, and downloadable PDF summaries."
  }
];

function Home({ setUser }) {
  const [showLogin, setShowLogin] = useState(false);
  const [activeSandbox, setActiveSandbox] = useState(SANDBOX_MODES[0]);
  const [simulatingWave, setSimulatingWave] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className='min-h-screen bg-[#07090E] text-[#F1F5F9] font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden'>
      
      {/* Ambient Radial Mesh Background */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-[140px] pointer-events-none' />
      <div className='absolute top-[800px] right-[-100px] w-[500px] h-[500px] bg-sky-500/10 blur-[130px] pointer-events-none' />
      <div className='absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none' />

      {/* Modern Frosted Header */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className='fixed top-0 left-0 right-0 z-50 h-[64px] border-b border-white/8 bg-[#07090E]/80 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between'
      >
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] shadow-[0_0_24px_rgba(99,102,241,0.4)]'>
            <div className='w-full h-full bg-[#0B0F17] rounded-[11px] flex items-center justify-center'>
              <GiArtificialHive size={18} className='text-indigo-400' />
            </div>
          </div>
          <div className='flex flex-col'>
            <span className='font-display font-bold text-base tracking-tight text-white flex items-center gap-1.5'>
              CareerForge <span className='text-xs px-1.5 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono'>AI</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className='hidden md:flex items-center gap-7 text-xs font-medium text-slate-300'>
          <a href='#sandbox' className='hover:text-white transition-colors'>Live Sandbox</a>
          <a href='#features' className='hover:text-white transition-colors'>Engine Architecture</a>
          <a href='#workflow' className='hover:text-white transition-colors'>Interview Journey</a>
          <a href='#faq' className='hover:text-white transition-colors'>FAQ</a>
        </div>

        <div className='flex items-center gap-3'>
          <div className='hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
            <span>AI Multi-Agent v3.4</span>
          </div>

          <motion.button
            onClick={() => setShowLogin(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className='relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 p-[1px] shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all'
          >
            <span className='flex items-center gap-2 px-4 py-2 rounded-[11px] bg-[#0B0F17] text-xs font-semibold text-white group-hover:bg-transparent transition-all'>
              Launch Studio <FaArrowRight className='text-[10px] group-hover:translate-x-0.5 transition-transform' />
            </span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className='relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center'>
        
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-slate-300 mb-6 backdrop-blur-md shadow-inner'
        >
          <GiSparkles className='text-indigo-400 text-sm' />
          <span>Next-Generation Career & Interview Simulation</span>
          <span className='text-indigo-400 flex items-center gap-0.5 ml-1 font-semibold hover:underline cursor-pointer'>
            Explore Demo <FiArrowUpRight size={13} />
          </span>
        </motion.div>

        {/* Main Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className='text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.08] mb-6 max-w-5xl mx-auto'
        >
          Engineered for <br className='hidden sm:block' />
          <span className='text-gradient-accent'>High-Stakes Technical</span> & Leadership Interviews
        </motion.h1>

        {/* Narrative Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className='text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal'
        >
          Master algorithmic problem solving, distributed systems, and executive behavioral rounds with multi-agent AI. Real-time voice synthesis, integrated Monaco IDE, and rubric-driven scorecards.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className='flex flex-wrap items-center justify-center gap-4 mb-16'
        >
          <motion.button
            onClick={() => setShowLogin(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className='px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all flex items-center gap-2 cursor-pointer'
          >
            Start Free Practice Session <FaArrowRight className='text-xs' />
          </motion.button>

          <a
            href='#sandbox'
            className='px-5 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md'
          >
            <FaTerminal className='text-xs text-indigo-400' /> Interactive Sandbox
          </a>
        </motion.div>

        {/* Trust & Telemetry Metric Strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/8'
        >
          {[
            { metric: "99.2%", label: "ATS Keyword Precision", sub: "Based on 50k+ job specs" },
            { metric: "<180ms", label: "Realtime Voice Latency", sub: "Natural conversational flow" },
            { metric: "14+", label: "Target Engineering Tracks", sub: "From L3 Junior to Staff" },
            { metric: "4.4x", label: "Offer Conversion Rate", sub: "Measured across 8,000 users" },
          ].map((stat, idx) => (
            <div key={idx} className='flex flex-col items-center p-3 rounded-xl bg-white/[0.02] border border-white/5'>
              <span className='font-mono font-bold text-xl sm:text-2xl text-white'>{stat.metric}</span>
              <span className='text-xs font-medium text-slate-300 mt-0.5'>{stat.label}</span>
              <span className='text-[10px] text-slate-500'>{stat.sub}</span>
            </div>
          ))}
        </motion.div>

      </section>

      {/* Interactive Live Hero Sandbox Section */}
      <section id='sandbox' className='py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-3'>
            <FiTerminalIcon size={13} /> LIVE_SIMULATION_PREVIEW
          </div>
          <h2 className='text-2xl sm:text-4xl font-display font-bold text-white tracking-tight'>
            Test the Multi-Agent Evaluation Engine
          </h2>
          <p className='text-slate-400 text-sm max-w-xl mx-auto mt-2'>
            Select an interview discipline below to test live speech waveform rendering, code evaluation syntax, and instant rubric scoring.
          </p>
        </div>

        {/* Sandbox Tabs */}
        <div className='flex flex-wrap items-center justify-center gap-2 mb-6'>
          {SANDBOX_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveSandbox(mode)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeSandbox.id === mode.id
                  ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/40"
                  : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Sandbox Interactive Window */}
        <div className='rounded-2xl bg-[#0B0F17] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden'>
          
          {/* Window Title Bar */}
          <div className='flex items-center justify-between px-4 py-3 bg-[#0E131F] border-b border-white/8'>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1.5'>
                <span className='w-3 h-3 rounded-full bg-red-500/80 inline-block' />
                <span className='w-3 h-3 rounded-full bg-yellow-500/80 inline-block' />
                <span className='w-3 h-3 rounded-full bg-emerald-500/80 inline-block' />
              </div>
              <span className='ml-3 text-xs font-mono text-slate-400'>
                simulation_runner // {activeSandbox.role}
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <span className='text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10'>
                WebRTC Active
              </span>
            </div>
          </div>

          {/* Sandbox Body: Split Pane */}
          <div className='grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/8'>
            
            {/* Left: Question & Audio Simulation (5 Cols) */}
            <div className='lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-[#0B0F17]/90'>
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-xs font-mono text-indigo-400 uppercase tracking-wider'>
                    Target Question
                  </span>
                  <span className='text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'>
                    L5 Senior Rubric
                  </span>
                </div>

                <p className='text-sm text-slate-200 font-medium leading-relaxed mb-6'>
                  "{activeSandbox.question}"
                </p>

                {/* AI Audio Waveform Preview */}
                <div className='p-4 rounded-xl bg-white/[0.03] border border-white/8 mb-6'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400'>
                        <FiMic size={13} />
                      </div>
                      <span className='text-xs font-medium text-slate-300'>AI Voice Synthesizer</span>
                    </div>
                    <span className='text-[10px] font-mono text-emerald-400 flex items-center gap-1'>
                      <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
                      Streaming
                    </span>
                  </div>

                  {/* Simulated Waveform Bars */}
                  <div className='flex items-center justify-center gap-1.5 h-10 px-2 py-1 bg-black/40 rounded-lg'>
                    {[12, 24, 18, 32, 28, 14, 22, 36, 18, 26, 30, 16, 22, 34, 20, 12, 28, 16].map((h, i) => (
                      <motion.div
                        key={i}
                        className='w-1 bg-gradient-to-t from-indigo-500 to-sky-400 rounded-full'
                        animate={{ height: simulatingWave ? [`${h * 0.3}px`, `${h}px`, `${h * 0.4}px`] : "6px" }}
                        transition={{ duration: 0.7 + (i % 4) * 0.15, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Rubric Score Breakdown */}
              <div className='pt-4 border-t border-white/8'>
                <div className='text-xs font-mono text-slate-400 mb-2.5 flex items-center justify-between'>
                  <span>Agent Diagnostic Telemetry</span>
                  <span className='text-emerald-400 font-bold'>Grade: Strong Hire</span>
                </div>
                <div className='grid grid-cols-3 gap-2'>
                  <div className='p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center'>
                    <span className='text-[10px] text-slate-400 block'>Algorithm</span>
                    <span className='font-mono font-bold text-sm text-indigo-400'>{activeSandbox.scores.algorithmic}%</span>
                  </div>
                  <div className='p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center'>
                    <span className='text-[10px] text-slate-400 block'>Efficiency</span>
                    <span className='font-mono font-bold text-sm text-emerald-400'>{activeSandbox.scores.latency}%</span>
                  </div>
                  <div className='p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center'>
                    <span className='text-[10px] text-slate-400 block'>Architecture</span>
                    <span className='font-mono font-bold text-sm text-sky-400'>{activeSandbox.scores.systemDesign}%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Code Sandbox & Realtime Terminal Feedback (7 Cols) */}
            <div className='lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between bg-[#080B11]'>
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-2 text-xs font-mono text-slate-400'>
                    <FaCode className='text-indigo-400' /> solution_candidate.ts
                  </div>
                  <span className='text-[11px] font-mono text-slate-500'>Monaco Engine v0.45</span>
                </div>

                {/* Code Block Container */}
                <div className='rounded-xl bg-[#06080D] border border-white/5 p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed'>
                  <pre className='text-indigo-300/90 whitespace-pre-wrap'>{activeSandbox.codeSnippet}</pre>
                </div>
              </div>

              {/* Real-time Agent Feedback Card */}
              <div className='mt-4 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20'>
                <div className='flex items-center gap-2 mb-1 text-xs font-semibold text-indigo-300'>
                  <FiCheckCircle size={14} className='text-emerald-400' /> Multi-Agent Rubric Feedback:
                </div>
                <p className='text-xs text-slate-300 leading-relaxed'>
                  {activeSandbox.feedback}
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Asymmetric Bento Grid Features Section */}
      <section id='features' className='py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        <div className='text-center max-w-3xl mx-auto mb-14'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-indigo-400 mb-3'>
            <FiLayers size={13} /> FULL_STACK_ENGINEERING_SUITE
          </div>
          <h2 className='text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight'>
            Four Specialized Agents. One Unified Career Engine.
          </h2>
          <p className='text-slate-400 text-sm sm:text-base mt-3'>
            Each agent operates on dedicated LLM rubrics trained on hundreds of verified engineering and leadership interview prompts.
          </p>
        </div>

        {/* Bento Grid */}
        <div className='grid grid-cols-1 md:grid-cols-12 gap-5'>
          
          {/* Card 1: Interactive Live Interview Studio (Span 7) */}
          <div className='md:col-span-7 glass-card glass-card-hover rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group'>
            <div className='absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none' />
            <div>
              <div className='w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5'>
                <FiMic size={22} />
              </div>
              <span className='text-xs font-mono text-indigo-400 font-semibold'>01 // INTERVIEW AGENT</span>
              <h3 className='text-xl sm:text-2xl font-display font-bold text-white mt-1 mb-3'>
                Multi-Modal Live Voice & Coding Sessions
              </h3>
              <p className='text-slate-400 text-sm leading-relaxed mb-6'>
                Practice realistic technical and behavioral interviews with video/audio speech recognition. Live Monaco IDE integration enables coding challenges with immediate syntax validation and time constraints.
              </p>
            </div>

            {/* Visual Preview Widget */}
            <div className='p-4 rounded-xl bg-[#090D15] border border-white/8 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300'>
                  <FaTerminal size={14} />
                </div>
                <div>
                  <p className='text-xs font-semibold text-white'>Live DSA & System Design</p>
                  <p className='text-[11px] text-slate-400'>JavaScript, Python, Java, C++</p>
                </div>
              </div>
              <span className='text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'>
                Auto-Evaluated
              </span>
            </div>
          </div>

          {/* Card 2: ATS Resume Score Engine (Span 5) */}
          <div className='md:col-span-5 glass-card glass-card-hover rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group'>
            <div className='absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none' />
            <div>
              <div className='w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-5'>
                <FiFileText size={22} />
              </div>
              <span className='text-xs font-mono text-sky-400 font-semibold'>02 // RESUME AGENT</span>
              <h3 className='text-xl sm:text-2xl font-display font-bold text-white mt-1 mb-3'>
                Precision ATS Keyword & Impact Analyzer
              </h3>
              <p className='text-slate-400 text-sm leading-relaxed mb-6'>
                Upload your resume to discover missing technical keywords, weak impact metrics, and structural formatting errors before recruiters ever see them.
              </p>
            </div>

            {/* Score Dial Mini-Widget */}
            <div className='p-4 rounded-xl bg-[#090D15] border border-white/8 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full border-2 border-indigo-400 flex items-center justify-center font-mono font-bold text-xs text-white'>
                  92%
                </div>
                <div>
                  <p className='text-xs font-semibold text-white'>ATS Pass Rating</p>
                  <p className='text-[10px] text-slate-400'>Top 5% candidate threshold</p>
                </div>
              </div>
              <span className='text-xs font-mono text-indigo-300'>+18% Match</span>
            </div>
          </div>

          {/* Card 3: Deep Rubric Feedback Agent (Span 5) */}
          <div className='md:col-span-5 glass-card glass-card-hover rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group'>
            <div>
              <div className='w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5'>
                <FiBarChart2 size={22} />
              </div>
              <span className='text-xs font-mono text-purple-400 font-semibold'>03 // FEEDBACK AGENT</span>
              <h3 className='text-xl sm:text-2xl font-display font-bold text-white mt-1 mb-3'>
                Rubric Radar Diagnostics
              </h3>
              <p className='text-slate-400 text-sm leading-relaxed mb-6'>
                Receive multidimensional radar breakdowns on problem formulation, algorithmic complexity, clarity of thought, and behavioral confidence.
              </p>
            </div>

            <div className='p-4 rounded-xl bg-[#090D15] border border-white/8'>
              <div className='flex justify-between text-xs font-mono text-slate-400 mb-1.5'>
                <span>STAR Method Adherence</span>
                <span className='text-purple-300'>94/100</span>
              </div>
              <div className='w-full h-1.5 bg-white/10 rounded-full overflow-hidden'>
                <div className='w-[94%] h-full bg-purple-500 rounded-full' />
              </div>
            </div>
          </div>

          {/* Card 4: Career Mastery Roadmap (Span 7) */}
          <div className='md:col-span-7 glass-card glass-card-hover rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group'>
            <div className='absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none' />
            <div>
              <div className='w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5'>
                <FiMap size={22} />
              </div>
              <span className='text-xs font-mono text-emerald-400 font-semibold'>04 // ROADMAP AGENT</span>
              <h3 className='text-xl sm:text-2xl font-display font-bold text-white mt-1 mb-3'>
                Dynamic Skill Tree & Milestone Generator
              </h3>
              <p className='text-slate-400 text-sm leading-relaxed mb-6'>
                Transform diagnostic weaknesses into a step-by-step master plan with curated industry readings, practice challenges, and certification checkpoints.
              </p>
            </div>

            <div className='grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#090D15] border border-white/8 text-center'>
              <div className='p-2 rounded bg-white/[0.03]'>
                <span className='text-[10px] text-slate-400 block'>Phase 1</span>
                <span className='text-xs font-semibold text-emerald-400'>Data Structures</span>
              </div>
              <div className='p-2 rounded bg-white/[0.03]'>
                <span className='text-[10px] text-slate-400 block'>Phase 2</span>
                <span className='text-xs font-semibold text-sky-400'>System Design</span>
              </div>
              <div className='p-2 rounded bg-white/[0.03]'>
                <span className='text-[10px] text-slate-400 block'>Phase 3</span>
                <span className='text-xs font-semibold text-indigo-400'>Mock Defense</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* 4-Step Interactive Workflow Timeline */}
      <section id='workflow' className='py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/8'>
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <span className='text-xs font-mono text-indigo-400 uppercase tracking-wider'>
            Structured Mastery Loop
          </span>
          <h2 className='text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mt-2'>
            How CareerForge Prepares You for Day 1
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 relative'>
          {[
            {
              step: "01",
              title: "Target Role Calibration",
              desc: "Select company tier, tech stack requirements, and target compensation bracket."
            },
            {
              step: "02",
              title: "Live Voice & IDE Session",
              desc: "Engage in an AI-moderated session with dynamic audio questions and code validation."
            },
            {
              step: "03",
              title: "Multi-Agent Rubric Scoring",
              desc: "Receive deep scorecards across architectural clarity, algorithm complexity, and communication."
            },
            {
              step: "04",
              title: "Adaptive Gap Remediation",
              desc: "Follow automated step-by-step milestones to fix deficiencies before your real interview."
            }
          ].map((item, i) => (
            <div key={i} className='p-6 rounded-2xl bg-white/[0.02] border border-white/8 flex flex-col justify-between relative'>
              <div>
                <span className='font-mono text-2xl font-extrabold text-indigo-500/60 block mb-3'>
                  {item.step}
                </span>
                <h3 className='text-base font-bold text-white mb-2'>{item.title}</h3>
                <p className='text-xs text-slate-400 leading-relaxed'>{item.desc}</p>
              </div>
              <div className='mt-6 pt-4 border-t border-white/5 flex items-center text-[11px] text-indigo-400 font-mono'>
                Verified Checkpoint <FaCheck className='ml-1 text-[9px]' />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id='faq' className='py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/8'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-display font-bold text-white tracking-tight'>
            Frequently Asked Questions
          </h2>
          <p className='text-slate-400 text-sm mt-2'>
            Everything you need to know about the CareerForge AI evaluation engine.
          </p>
        </div>

        <div className='space-y-3'>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className='rounded-xl bg-white/[0.02] border border-white/8 overflow-hidden transition-all'
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className='w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02]'
              >
                <span className='text-sm font-semibold text-slate-200'>{faq.q}</span>
                <FiChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180 text-indigo-400" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='px-4 sm:px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3'
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action Strip */}
      <section className='py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center'>
        <div className='p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-indigo-900/30 to-indigo-950/10 border border-indigo-500/20 relative overflow-hidden'>
          <div className='absolute inset-0 bg-radial-glow opacity-60 pointer-events-none' />
          <h2 className='text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-4 relative'>
            Ready to Ace Your Next Senior Engineering Interview?
          </h2>
          <p className='text-slate-300 text-sm max-w-xl mx-auto mb-8 relative'>
            Join thousands of developers using CareerForge AI to sharpen their system design, code problem solving, and behavioral storytelling.
          </p>
          <motion.button
            onClick={() => setShowLogin(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className='px-7 py-3.5 rounded-xl bg-white text-[#0A0A0A] font-bold text-sm hover:bg-slate-100 shadow-[0_0_35px_rgba(255,255,255,0.3)] transition-all cursor-pointer relative'
          >
            Get Started For Free
          </motion.button>
        </div>
      </section>

      {/* Auth Modal */}
      {showLogin && <LoginModel onClose={() => setShowLogin(false)} setUser={setUser} />}

      {/* Modern Studio Footer */}
      <footer className='border-t border-white/8 py-10 px-4 sm:px-8 bg-[#05070A] text-slate-500 text-xs'>
        <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2.5'>
            <div className='w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center'>
              <GiArtificialHive size={13} className='text-indigo-400' />
            </div>
            <span className='font-display font-bold text-slate-300 text-sm'>CareerForge AI</span>
          </div>
          <div className='flex items-center gap-6'>
            <a href='#sandbox' className='hover:text-slate-300 transition-colors'>Sandbox</a>
            <a href='#features' className='hover:text-slate-300 transition-colors'>Features</a>
            <a href='#workflow' className='hover:text-slate-300 transition-colors'>Workflow</a>
            <a href='#faq' className='hover:text-slate-300 transition-colors'>FAQ</a>
          </div>
          <p>© {new Date().getFullYear()} CareerForge AI. Built for serious engineers.</p>
        </div>
      </footer>

    </div>
  )
}

export default Home
