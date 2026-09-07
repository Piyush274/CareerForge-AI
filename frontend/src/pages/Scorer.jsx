import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import { FiAlertCircle, FiTrendingUp, FiUploadCloud, FiUser, FiZap, FiArrowLeft, FiCheck, FiRefreshCw, FiFileText } from 'react-icons/fi'
import { GiTwoCoins } from 'react-icons/gi'
import api from '../utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setResume } from '../redux/resumeSlice'
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { deductCoins } from '../apis/user.api'

const ScoreRing = ({ score = 0 }) => {
  const color = score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";
  return (
    <div className='relative flex items-center justify-center w-[120px] h-[120px]'>
      <RadialBarChart
        width={120}
        height={120}
        cx={60}
        cy={60}
        innerRadius={44}
        outerRadius={56}
        startAngle={90}
        endAngle={-270}
        data={[{ value: score, fill: color }]}
        barSize={9}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar background={{ fill: "rgba(255,255,255,0.06)" }} dataKey="value" cornerRadius={10} />
      </RadialBarChart>

      <div className='absolute flex flex-col items-center justify-center'>
        <span className='text-2xl font-bold font-mono text-white leading-none'>{score}</span>
        <span className='text-[10px] font-mono text-slate-500 mt-0.5'>/100</span>
      </div>
    </div>
  );
};

const Tag = ({ text, color }) => {
  const styles = {
    purple: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    red: "bg-red-500/10 text-red-300 border-red-500/20",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    yellow: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${styles[color] || styles.purple}`}>
      {text}
    </span>
  );
};

const Navbar = ({ label }) => {
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className='fixed inset-x-0 top-0 z-30 border-b border-white/8 bg-[#07090E]/80 backdrop-blur-xl h-14 flex items-center'
    >
      <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6'>
        <div 
          onClick={() => navigate("/dashboard")}
          className='flex cursor-pointer items-center gap-2'
        >
          <span className='text-sm font-display font-extrabold text-white'>CareerForge AI</span>
          <span className='rounded bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-mono text-indigo-300'>
            {label}
          </span>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className='text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer'
        >
          <FiArrowLeft size={13} />
          <span>Dashboard</span>
        </button>
      </div>
    </motion.nav>
  );
};

function Scorer({ setUser }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { resume } = useSelector((state) => state.resume);

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a PDF resume to analyze.");
      return;
    }
    try {
      setLoading(true);
      try {
        const coinResponse = await deductCoins({ coins: 10, action: "resume-scorer" });
        if (setUser) {
          setUser((prev) => ({
            ...prev,
            interviewCoin: coinResponse?.interviewCoin,
          }));
        }
      } catch {
        setLoading(false);
        alert("Insufficient credits. Please top up your balance in billing.");
        return;
      }

      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post("/api/resume/upload", formData);
      dispatch(setResume(response?.data?.data));
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Resume analysis failed. Please try a valid PDF file.");
      setLoading(false);
    }
  };

  // Result Analysis View
  if (resume) {
    const scoreVal = resume?.score ?? 0;
    const ratingLabel = scoreVal >= 75 ? "Top 5% ATS Match" : scoreVal >= 50 ? "Average ATS Match" : "Significant Keyword Gaps";
    
    return (
      <div className='min-h-screen bg-[#07090E] text-[#F1F5F9] font-sans pb-12'>
        <Navbar label="ATS Resume Scorer" />

        <section className='max-w-5xl mx-auto px-4 pt-20 sm:pt-24 space-y-5'>
          {/* Header */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/8'>
            <div>
              <span className='text-xs font-mono text-indigo-400 uppercase tracking-wider'>
                ATS AUDIT COMPLETED
              </span>
              <h1 className='text-xl sm:text-2xl font-display font-bold text-white mt-0.5'>
                {resume?.name || "Candidate Profile"}
              </h1>
            </div>

            <button
              onClick={() => dispatch(setResume(null))}
              className='inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer'
            >
              <FiRefreshCw size={13} />
              <span>Scan New Resume</span>
            </button>
          </div>

          {/* Score Header Card */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className='rounded-3xl bg-[#0B0F17] border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
          >
            <ScoreRing score={scoreVal} />

            <div className='flex-1 text-center sm:text-left'>
              <span className='text-xs font-mono text-slate-400 uppercase tracking-wider'>
                COMPOSITE ATS READINESS
              </span>
              <h2 className='text-xl sm:text-2xl font-display font-bold text-white mt-0.5 mb-2'>
                {ratingLabel}
              </h2>

              <div className='flex flex-wrap items-center justify-center sm:justify-start gap-2'>
                <div className='flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono'>
                  <FiUser size={13} />
                  <span>Target: {resume?.suggestedRole || "Software Engineer"}</span>
                </div>
                <span className='text-xs text-slate-400'>
                  Matched against 2026 Tier-1 hiring rubrics
                </span>
              </div>
            </div>
          </motion.div>

          {/* Strengths & Weaknesses 2-Column Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            
            {/* Strengths */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className='rounded-2xl bg-[#0B0F17] border border-emerald-500/20 p-5'
            >
              <div className='flex items-center gap-2 mb-3'>
                <FiCheck className='text-emerald-400' size={16} />
                <h3 className='text-sm font-display font-bold text-white'>High-Impact Keywords Found</h3>
              </div>
              <div className='flex flex-wrap gap-2'>
                {resume?.strengths?.length > 0 ? (
                  resume.strengths.map((s) => <Tag key={s} text={s} color="green" />)
                ) : (
                  <p className='text-xs text-slate-500'>No strong keywords detected.</p>
                )}
              </div>
            </motion.div>

            {/* Weaknesses */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className='rounded-2xl bg-[#0B0F17] border border-amber-500/20 p-5'
            >
              <div className='flex items-center gap-2 mb-3'>
                <FiAlertCircle className='text-amber-400' size={16} />
                <h3 className='text-sm font-display font-bold text-white'>Formatting &amp; Metric Flags</h3>
              </div>
              <div className='flex flex-wrap gap-2'>
                {resume?.weaknesses?.length > 0 ? (
                  resume.weaknesses.map((w) => <Tag key={w} text={w} color="yellow" />)
                ) : (
                  <p className='text-xs text-slate-500'>No critical formatting errors.</p>
                )}
              </div>
            </motion.div>

          </div>

          {/* Missing ATS Skills */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className='rounded-2xl bg-[#0B0F17] border border-red-500/20 p-5'
          >
            <div className='flex items-center gap-2 mb-3'>
              <FiZap className='text-red-400' size={16} />
              <h3 className='text-sm font-display font-bold text-white'>Missing Target Role Keywords</h3>
            </div>
            <div className='flex flex-wrap gap-2'>
              {resume?.missingSkills?.length > 0 ? (
                resume.missingSkills.map((s) => <Tag key={s} text={s} color="red" />)
              ) : (
                <p className='text-xs text-slate-500'>All primary industry keywords present.</p>
              )}
            </div>
          </motion.div>

          {/* Actionable Recommendations */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className='rounded-2xl bg-[#0B0F17] border border-indigo-500/20 p-5'
          >
            <div className='flex items-center gap-2 mb-3'>
              <FiTrendingUp className='text-indigo-400' size={16} />
              <h3 className='text-sm font-display font-bold text-white'>Actionable Revision Steps</h3>
            </div>
            <div className='space-y-2'>
              {resume?.recommendations?.length > 0 ? (
                resume.recommendations.map((rec, i) => (
                  <div key={i} className='p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5'>
                    <span className='font-mono text-xs font-bold text-indigo-400 mt-0.5'>{i + 1}.</span>
                    <p className='text-xs text-slate-300 leading-relaxed'>{rec}</p>
                  </div>
                ))
              ) : (
                <p className='text-xs text-slate-500'>No specific recommendations generated.</p>
              )}
            </div>
          </motion.div>

        </section>
      </div>
    );
  }

  // Upload Screen
  return (
    <div className='min-h-screen bg-[#07090E] text-[#F1F5F9] font-sans flex items-center justify-center p-4 relative overflow-hidden'>
      <Navbar label="ATS Resume Scorer" />

      {/* Background Glow */}
      <div className='absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-500/10 blur-[130px] pointer-events-none' />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='relative w-full max-w-md rounded-3xl bg-[#0B0F17] border border-white/10 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)]'
      >
        <div className='flex items-center justify-between mb-4'>
          <span className='text-xs font-mono text-indigo-400 uppercase tracking-wider'>
            STEP 01 // ATS SCAN
          </span>
          <div className='flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md'>
            <GiTwoCoins size={13} className='text-amber-400' />
            <span>10 Credits</span>
          </div>
        </div>

        <h2 className='text-xl font-display font-bold text-white mb-1'>
          Upload Resume for ATS Audit
        </h2>
        <p className='text-xs text-slate-400 mb-5 leading-relaxed'>
          Our parser extracts keyword density, structural formatting, and metrics calibration against 50,000+ job descriptions.
        </p>

        {/* Drag & Drop Zone */}
        <label
          className={`relative flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            file
              ? "border-indigo-500/60 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
              : "border-white/15 bg-white/[0.02] hover:border-indigo-500/40 hover:bg-white/[0.04]"
          }`}
        >
          <div className='w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3'>
            <FiUploadCloud size={24} />
          </div>
          <p className="text-xs font-semibold text-slate-200 text-center px-4">
            {file ? file.name : "Click to select or drag & drop PDF"}
          </p>
          <p className="text-[10px] font-mono text-slate-500 mt-1">PDF Format Only · Max 20MB</p>

          <input
            type='file'
            accept='.pdf'
            className='hidden'
            onChange={(e) => {
              if (e.target.files[0]) setFile(e.target.files[0]);
            }}
          />
        </label>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={uploadResume}
          disabled={!file || loading}
          className='mt-5 w-full h-11 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2'
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Analyzing Keywords &amp; Metrics...</span>
            </>
          ) : (
            <>
              <span>Run Deep ATS Analysis</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Scorer;
