import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'
import { motion } from "motion/react"
import { FiSidebar, FiPlus, FiFileText, FiStar, FiMap, FiAward, FiArrowUpRight, FiZap } from 'react-icons/fi'
import { getAllInterviews } from '../apis/interview.api'
import Statbox from '../components/Statbox'
import InterviewGraph from '../components/InterviewGraph'

function Dashboard({ user, setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [moblieOpen, setMoblieOpen] = useState(false)
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalQuestions: 0,
    completed: 0,
    averageScore: 0,
  })
  const [technicalData, setTechnicalData] = useState([])
  const [hrData, setHrData] = useState([])
  const [technicalCount, setTechnicalCount] = useState(0)
  const [hrCount, setHrCount] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await getAllInterviews()
        if (response) {
          if (response.stats) setStats(response.stats)
          if (response.technicalData) setTechnicalData(response.technicalData)
          if (response.hrData) setHrData(response.hrData)
          if (response.technicalCount !== undefined) setTechnicalCount(response.technicalCount)
          if (response.hrCount !== undefined) setHrCount(response.hrCount)
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
      }
    }
    fetchInterviews()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await api.get("/api/auth/logout")
      if (response.data.success) {
        setUser(null)
        navigate("/")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const candidateName = user?.name ? user.name.split(" ")[0] : "Candidate"
  const averageScoreNum = Math.round(stats?.averageScore || 0)
  const readinessTier = averageScoreNum >= 85 ? "L5 Senior (Strong Hire)" : averageScoreNum >= 70 ? "L4 Mid-Level (Hire)" : "In Training"

  return (
    <div className='bg-[#07090E] min-h-screen text-[#F1F5F9] font-sans flex'>
      <Sidebar
        user={user}
        onNewInterview={() => navigate("/interview")}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        moblieOpen={moblieOpen}
        setMoblieOpen={setMoblieOpen}
      />

      <motion.main 
        className={`flex-1 min-h-screen px-4 sm:px-6 md:px-8 py-6 transition-all duration-300 ${
          sidebarOpen ? "md:ml-[260px]" : "md:ml-[72px]"
        }`}
      >
        {/* Top App Bar */}
        <div className='flex items-center justify-between mb-8 pb-5 border-b border-white/8'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setMoblieOpen(true)}
              className='md:hidden p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer'
            >
              <FiSidebar size={18} />
            </button>

            <div>
              <div className='flex items-center gap-2'>
                <h1 className='text-xl sm:text-2xl font-display font-bold text-white tracking-tight'>
                  Welcome back, {candidateName}
                </h1>
                <span className='hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'>
                  <FiAward size={12} /> {readinessTier}
                </span>
              </div>
              <p className='text-slate-400 text-xs mt-0.5'>
                Your AI interview telemetry, diagnostic rubrics, and career metrics.
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate("/interview")}
              className='hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all cursor-pointer'
            >
              <FiPlus size={14} /> Start Practice
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8'>
          <Statbox
            label="Total Sessions"
            value={stats?.totalInterviews || 0}
            subHighlight="All-Time"
            sub="Simulations created"
            index={0}
          />
          <Statbox
            label="Problems Answered"
            value={stats?.totalQuestions || 0}
            subHighlight="Validated"
            sub="Technical & HR questions"
            index={1}
          />
          <Statbox
            label="Completed Rounds"
            value={stats?.completed || 0}
            subHighlight={`${stats?.totalInterviews || 0} Total`}
            sub="Full reports generated"
            index={2}
          />
          <Statbox
            label="Rubric Average"
            value={`${averageScoreNum}/100`}
            subHighlight={averageScoreNum >= 75 ? "Target Pass" : "Refining"}
            sub="Composite candidate score"
            index={3}
          />
        </div>

        {/* Quick Launch Action Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          
          <div 
            onClick={() => navigate("/interview")}
            className='p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-indigo-900/10 to-transparent border border-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col justify-between'
          >
            <div>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold'>
                  INSTANT_LAUNCH
                </span>
                <FiArrowUpRight className='text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform' size={16} />
              </div>
              <h3 className='text-base font-display font-bold text-white mb-1'>Simulate Coding / System Design</h3>
              <p className='text-xs text-slate-400 leading-relaxed'>
                Practice live LeetCode DSA, concurrency, and architecture rounds with real-time video/voice feedback.
              </p>
            </div>
            <span className='text-xs font-semibold text-indigo-400 mt-4 flex items-center gap-1'>
              Start Technical Round →
            </span>
          </div>

          <div 
            onClick={() => navigate("/scorer")}
            className='p-5 rounded-2xl bg-gradient-to-br from-sky-950/40 via-sky-900/10 to-transparent border border-sky-500/20 hover:border-sky-500/40 transition-all cursor-pointer group flex flex-col justify-between'
          >
            <div>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold'>
                  ATS_SCANNER
                </span>
                <FiArrowUpRight className='text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-transform' size={16} />
              </div>
              <h3 className='text-base font-display font-bold text-white mb-1'>Scan Resume Match Strength</h3>
              <p className='text-xs text-slate-400 leading-relaxed'>
                Upload your latest resume PDF to get instant keyword gap analysis and bullet point impact metrics.
              </p>
            </div>
            <span className='text-xs font-semibold text-sky-400 mt-4 flex items-center gap-1'>
              Upload &amp; Scan PDF →
            </span>
          </div>

          <div 
            onClick={() => navigate("/roadmap")}
            className='p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-purple-900/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group flex flex-col justify-between'
          >
            <div>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold'>
                  CAREER_GRAPH
                </span>
                <FiArrowUpRight className='text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-transform' size={16} />
              </div>
              <h3 className='text-base font-display font-bold text-white mb-1'>Generate Skill Roadmap</h3>
              <p className='text-xs text-slate-400 leading-relaxed'>
                Generate customized milestones to bridge conceptual gaps between your current level and target tier.
              </p>
            </div>
            <span className='text-xs font-semibold text-purple-400 mt-4 flex items-center gap-1'>
              View Skill Tree →
            </span>
          </div>

        </div>

        {/* Performance & Rubric Radar Section */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <span className='text-xs font-mono text-indigo-400 uppercase tracking-wider'>
                Rubric Telemetry
              </span>
              <h2 className='text-lg font-display font-bold text-white'>
                Candidate Competency Breakdown
              </h2>
            </div>
          </div>

          <InterviewGraph
            technicalData={technicalData}
            technicalCount={technicalCount}
            hrData={hrData}
            hrCount={hrCount}
          />
        </div>

      </motion.main>
    </div>
  )
}

export default Dashboard
