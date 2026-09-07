import React, { useState } from 'react'
import { motion } from "motion/react"
import { FiArrowLeft, FiArrowRight, FiBriefcase, FiCheck, FiCheckCircle, FiFileText, FiUploadCloud, FiCpu, FiAward, FiShield } from 'react-icons/fi'
import { GiTwoCoins, GiArtificialHive } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deductCoins } from '../../apis/user.api'
import api from '../../utils/axios'
import { setResume } from '../../redux/resumeSlice'
import { startInterview } from '../../apis/interview.api'

const QUICK_ROLES = [
  "Senior Frontend Engineer",
  "Backend / Distributed Systems",
  "Fullstack Developer",
  "AI / ML Engineer",
  "Engineering Manager"
];

function Step1setup({ user, setUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { resume } = useSelector((state) => state.resume);
  const [role, setRole] = useState(resume?.suggestedRole || "Backend Engineer");
  const [type, setType] = useState("technical");
  const [useResume, setUseResume] = useState(!!resume);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [starting, setStarting] = useState(false);

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }
    try {
      setUploading(true);
      try {
        const coinResponse = await deductCoins({ coins: 10, action: "resume-scorer" });
        setUser((prev) => ({
          ...prev,
          interviewCoin: coinResponse?.interviewCoin,
        }));
      } catch {
        setUploading(false);
        alert("Failed to use coins. Please ensure you have sufficient credits.");
        return;
      }

      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post("/api/resume/upload", formData);
      dispatch(setResume(response?.data?.data));
      setUploading(false);
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Resume upload failed. Please try again.");
      setUploading(false);
    }
  };

  const start = async () => {
    if (!role.trim()) return;
    setStarting(true);
    const response = await startInterview({ role, type, useResume, resume });

    if (!response || !response.interviewId) {
      setStarting(false);
      alert("Failed to generate interview questions. Please try again.");
      return;
    }

    try {
      const coinResponse = await deductCoins({ coins: 50, action: "start-interview" });
      setUser((prev) => ({
        ...prev,
        interviewCoin: coinResponse?.interviewCoin,
      }));
    } catch {
      setStarting(false);
      alert("Failed to use coins.");
      return;
    }

    setStarting(false);
    navigate(`/interview/${response.interviewId}`);
  };

  return (
    <div className='min-h-screen bg-[#07090E] text-[#F1F5F9] font-sans flex items-center justify-center p-4 sm:p-6 relative overflow-hidden'>
      {/* Background Glow */}
      <div className='absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-500/10 blur-[130px] pointer-events-none' />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full max-w-5xl bg-[#0B0F17] border border-white/10 rounded-3xl overflow-hidden grid lg:grid-cols-[40%_60%] shadow-[0_25px_80px_rgba(0,0,0,0.7)] relative'
      >
        {/* Left Column: Context & Overview */}
        <div className='p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/8 bg-[#090D15]/80 flex flex-col justify-between gap-6'>
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer'
            >
              <FiArrowLeft size={13} />
              <span>Back to Dashboard</span>
            </button>

            <div className='mt-6'>
              <div className='w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3'>
                <GiArtificialHive size={20} />
              </div>
              <h2 className='text-2xl font-display font-extrabold text-white tracking-tight'>
                Configure Interview Session
              </h2>
              <p className='mt-2 text-xs text-slate-400 leading-relaxed'>
                Our multi-agent orchestrator generates tailored problem sets matching actual interview rubrics from Tier-1 tech companies.
              </p>
            </div>

            {/* Feature Checkpoints */}
            <div className='space-y-2.5 mt-6'>
              {[
                { title: "Dynamic Monaco IDE & Code Evaluator", desc: "For DSA, concurrency & system algorithms" },
                { title: "Audio Speech Synthesizer & Speech Recognition", desc: "Real-time AI voice interviewer" },
                { title: "Multi-Axis Rubric Telemetry", desc: "Comprehensive diagnostic report card" },
              ].map((item, idx) => (
                <div key={idx} className='p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3'>
                  <div className='w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5'>
                    <FiCheck size={12} />
                  </div>
                  <div>
                    <p className='text-xs font-semibold text-slate-200'>{item.title}</p>
                    <p className='text-[11px] text-slate-500'>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coin Cost Info */}
          <div className='p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <GiTwoCoins size={18} className='text-amber-400' />
              <div>
                <span className='text-[10px] uppercase font-mono text-amber-300 block'>Session Cost</span>
                <span className='text-xs font-bold font-mono text-amber-200'>50 Credits</span>
              </div>
            </div>
            <span className='text-[11px] font-mono text-slate-400'>
              Balance: <strong className='text-white'>{user?.interviewCoin ?? 0}</strong>
            </span>
          </div>
        </div>

        {/* Right Column: Preferences Form */}
        <div className='p-6 sm:p-8 flex flex-col justify-between bg-[#0B0F17]'>
          <div>
            <div className='flex items-center justify-between mb-5'>
              <div>
                <h3 className='text-lg font-display font-bold text-white'>
                  Interview Parameters
                </h3>
                <p className='text-xs text-slate-400'>
                  Customize your role, discipline, and contextual resume data.
                </p>
              </div>
            </div>

            <div className='space-y-5'>
              {/* Target Role Field */}
              <div>
                <label className='text-xs font-mono font-medium text-slate-300 flex items-center justify-between mb-2'>
                  <span>TARGET ROLE</span>
                  <span className='text-[11px] text-indigo-400 font-sans'>Required</span>
                </label>
                <div className='relative'>
                  <FiBriefcase className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500' size={15} />
                  <input
                    type='text'
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder='e.g., Senior Fullstack Engineer'
                    className='w-full h-11 rounded-xl bg-[#101522] border border-white/10 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-500 outline-none focus:border-indigo-500/50 transition-all'
                  />
                </div>

                {/* Quick Role Suggestions */}
                <div className='flex flex-wrap gap-1.5 mt-2'>
                  {QUICK_ROLES.map((r) => (
                    <button
                      key={r}
                      type='button'
                      onClick={() => setRole(r)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        role === r
                          ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/40"
                          : "bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interview Type Selector */}
              <div>
                <label className='text-xs font-mono font-medium text-slate-300 block mb-2'>
                  EVALUATION DISCIPLINE
                </label>
                <div className='grid grid-cols-2 gap-2 p-1 bg-[#101522] rounded-xl border border-white/8'>
                  <button
                    type='button'
                    onClick={() => setType("technical")}
                    className={`h-10 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      type === "technical"
                        ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FiCpu size={14} /> Technical &amp; Coding
                  </button>
                  <button
                    type='button'
                    onClick={() => setType("hr")}
                    className={`h-10 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      type === "hr"
                        ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FiAward size={14} /> HR &amp; Behavioral
                  </button>
                </div>
              </div>

              {/* Resume Personalization Switch */}
              <div className='p-4 rounded-xl bg-[#101522] border border-white/8'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='text-xs font-semibold text-white'>Tailor with Uploaded Resume</h4>
                    <p className='text-[11px] text-slate-400 mt-0.5'>
                      AI extracts your verified project tech stack and career background.
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => setUseResume(!useResume)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      useResume ? "bg-indigo-600" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        useResume ? "translate-x-5.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Upload or Detected resume */}
                {useResume && (
                  <div className='mt-4 pt-3 border-t border-white/5'>
                    {resume ? (
                      <div className='flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20'>
                        <div className='flex items-center gap-2.5'>
                          <div className='w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center'>
                            <FiFileText size={15} />
                          </div>
                          <div>
                            <p className='text-xs font-semibold text-white'>Resume Linked</p>
                            <p className='text-[10px] text-slate-400 font-mono'>{resume?.suggestedRole || "Verified Profile"}</p>
                          </div>
                        </div>
                        <FiCheckCircle size={16} className='text-emerald-400' />
                      </div>
                    ) : (
                      <div className='p-4 rounded-xl border border-dashed border-white/15 bg-black/20 text-center'>
                        <label className='cursor-pointer flex flex-col items-center'>
                          <FiUploadCloud size={22} className='text-indigo-400 mb-2' />
                          <span className='text-xs font-semibold text-slate-200'>Upload PDF Resume</span>
                          <span className='text-[10px] text-slate-400 mt-0.5'>10 credits will be used for ATS parsing</span>
                          <input
                            type='file'
                            className='hidden'
                            accept='.pdf'
                            onChange={(e) => {
                              if (e.target.files[0]) setFile(e.target.files[0]);
                            }}
                          />
                        </label>
                        {file && (
                          <div className='mt-3 flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10'>
                            <span className='text-xs text-slate-300 truncate max-w-[200px]'>{file.name}</span>
                            <button
                              onClick={uploadResume}
                              disabled={uploading}
                              className='px-3 py-1 rounded-md bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 disabled:opacity-50'
                            >
                              {uploading ? "Parsing..." : "Upload"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <motion.button
            onClick={start}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={!role || starting || (useResume && !resume)}
            className='mt-6 w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(99,102,241,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer'
          >
            {starting ? (
              <span className='flex items-center gap-2 font-mono'>
                <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                INITIALIZING MULTI-AGENT SESSION...
              </span>
            ) : (
              <>
                <span>Launch Interview Simulation</span>
                <FiArrowRight size={15} />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Step1setup;
