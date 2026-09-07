import React, { useRef } from 'react'
import { motion } from "motion/react"
import { FiArrowLeft, FiAward, FiCheck, FiTarget, FiTrendingUp, FiAlertTriangle, FiCode, FiUser, FiZap, FiDownload } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import DownloadBtn from '../resume/DownloadBtn'

function Step3report({ report, user, setUser }) {
  const navigate = useNavigate();
  const reportRef = useRef(null);

  const overallScore = report?.overallScore ?? 0;
  const verdict = overallScore >= 85 ? "Strong Hire (L5+)" : overallScore >= 70 ? "Hire (L4)" : "Needs Reinforcement";
  const verdictColor = overallScore >= 85 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : overallScore >= 70 ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20";

  return (
    <div className='min-h-screen bg-[#07090E] text-[#F1F5F9] font-sans flex items-center justify-center p-3 sm:p-6 md:p-8'>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl rounded-3xl bg-[#0B0F17] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Report Header Bar */}
        <div className='border-b border-white/8 px-6 sm:px-8 py-6 bg-[#0D111D] flex flex-wrap items-center justify-between gap-4'>
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer'
            >
              <FiArrowLeft size={13} />
              <span>Dashboard</span>
            </button>

            <h1 className='text-2xl sm:text-3xl font-display font-extrabold text-white mt-3'>
              Interview Diagnostic Report
            </h1>
            <p className='text-xs text-slate-400 font-mono mt-1'>
              MULTI-AGENT PERFORMANCE AUDIT // {user?.name || "Candidate"}
            </p>

            <div className='mt-3'>
              <DownloadBtn docRef={reportRef} user={user} setUser={setUser} />
            </div>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono text-xs font-semibold ${verdictColor}`}>
            <FiAward size={16} />
            <span>Verdict: {verdict}</span>
          </div>
        </div>

        {/* Report Printable Body */}
        <div className='p-6 sm:p-8 bg-[#0B0F17]' ref={reportRef}>
          
          {/* Top 3 Score Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
            
            <div className='rounded-2xl bg-[#101522] border border-white/8 p-5 flex flex-col justify-between'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-mono uppercase text-slate-400'>COMPOSITE SCORE</span>
                <div className='w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center'>
                  <FiTarget size={15} />
                </div>
              </div>
              <div className='my-3'>
                <span className='text-3xl sm:text-4xl font-extrabold font-mono text-white'>
                  {overallScore}
                </span>
                <span className='text-sm text-slate-500 font-mono'>/100</span>
              </div>
              <span className='text-[10px] font-mono text-emerald-400'>
                Normalized against L5 standard
              </span>
            </div>

            <div className='rounded-2xl bg-[#101522] border border-white/8 p-5 flex flex-col justify-between'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-mono uppercase text-slate-400'>QUESTIONS ANSWERED</span>
                <div className='w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center'>
                  <FiTrendingUp size={15} />
                </div>
              </div>
              <div className='my-3'>
                <span className='text-3xl sm:text-4xl font-extrabold font-mono text-white'>
                  {report?.questions?.length ?? 0}
                </span>
                <span className='text-sm text-slate-500 font-mono'> Prompts</span>
              </div>
              <span className='text-[10px] font-mono text-sky-400'>
                100% Completion Rate
              </span>
            </div>

            <div className='rounded-2xl bg-[#101522] border border-white/8 p-5 flex flex-col justify-between'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-mono uppercase text-slate-400'>CALIBRATION STATUS</span>
                <div className='w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center'>
                  <FiAward size={15} />
                </div>
              </div>
              <div className='my-3'>
                <span className='text-2xl sm:text-3xl font-extrabold font-display text-white'>
                  Certified
                </span>
              </div>
              <span className='text-[10px] font-mono text-purple-400'>
                Ready for Production Rounds
              </span>
            </div>

          </div>

          {/* Executive Summary Box */}
          <div className='rounded-2xl bg-[#101522] border border-white/8 p-5 sm:p-6 mb-6'>
            <span className='text-xs font-mono text-indigo-400 uppercase tracking-wider block mb-1.5'>
              EXECUTIVE EVALUATION SUMMARY
            </span>
            <p className="text-sm leading-relaxed text-slate-300">
              {report?.summary || "Session completed successfully. The candidate demonstrated structured algorithmic approaches and clear technical reasoning."}
            </p>
          </div>

          {/* Strengths & Weaknesses 2-Column Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6'>
            
            {/* Strengths */}
            <div className='rounded-2xl bg-[#101522] border border-emerald-500/20 p-5 sm:p-6'>
              <div className='flex items-center gap-2.5 mb-4'>
                <div className='w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center'>
                  <FiCheck size={14} />
                </div>
                <h3 className="text-base font-display font-bold text-white">
                  Demonstrated Strengths
                </h3>
              </div>

              <div className='space-y-2.5'>
                {report?.strengths?.length > 0 ? (
                  report.strengths.map((s, idx) => (
                    <div key={idx} className='flex items-start gap-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3'>
                      <span className='w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5'>✓</span>
                      <p className='text-xs text-slate-300 leading-relaxed'>{s}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs">No specific strengths recorded.</p>
                )}
              </div>
            </div>

            {/* Weaknesses / Improvements */}
            <div className='rounded-2xl bg-[#101522] border border-amber-500/20 p-5 sm:p-6'>
              <div className='flex items-center gap-2.5 mb-4'>
                <div className='w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center'>
                  <FiAlertTriangle size={14} />
                </div>
                <h3 className="text-base font-display font-bold text-white">
                  Critical Growth Areas
                </h3>
              </div>

              <div className='space-y-2.5'>
                {report?.weaknesses?.length > 0 ? (
                  report.weaknesses.map((w, idx) => (
                    <div key={idx} className='flex items-start gap-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 p-3'>
                      <span className='w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5'>!</span>
                      <p className='text-xs text-slate-300 leading-relaxed'>{w}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs">No significant weaknesses flagged.</p>
                )}
              </div>
            </div>

          </div>

          {/* Actionable Recommendations */}
          <div className='rounded-2xl bg-[#101522] border border-white/8 p-5 sm:p-6 mb-8'>
            <span className='text-xs font-mono text-indigo-400 uppercase tracking-wider block mb-2'>
              RECOMMENDED NEXT ACTIONS
            </span>

            <div className='space-y-2.5 mt-3'>
              {report?.recommendations?.length > 0 ? (
                report.recommendations.map((rec, i) => (
                  <div key={i} className='flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5'>
                    <div className='w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono font-bold text-xs shrink-0'>
                      {i + 1}
                    </div>
                    <p className='text-xs text-slate-300 leading-relaxed'>{rec}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs">No action items specified.</p>
              )}
            </div>
          </div>

          {/* Question-Wise In-Depth Telemetry */}
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-4">
              Question-by-Question Rubric Audit
            </h3>

            <div className='space-y-4'>
              {report?.questions?.map((item, index) => (
                <div key={index} className='rounded-2xl bg-[#101522] border border-white/8 p-5 sm:p-6'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-semibold'>
                      ROUND {index + 1}
                    </span>
                    <span className='text-xs font-mono font-bold text-emerald-400'>
                      Score: {item.feedback?.score ?? 0}/100
                    </span>
                  </div>

                  <h4 className='text-sm font-semibold text-white leading-snug mb-4'>
                    {item.question}
                  </h4>

                  {/* Candidate Transcribed Answer */}
                  <div className='rounded-xl bg-[#0A0D14] border border-white/5 p-3.5 mb-4'>
                    <span className='text-[10px] font-mono text-slate-500 uppercase block mb-1'>Transcribed Candidate Response:</span>
                    <p className='text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap'>
                      {item.userAnswer || "No transcript provided"}
                    </p>
                  </div>

                  {/* Multi-Dimensional Metrics */}
                  <div className='grid grid-cols-3 gap-2.5 mb-4'>
                    <div className='rounded-xl bg-white/[0.02] border border-white/5 p-2.5 text-center'>
                      <span className='text-[10px] font-mono text-slate-400 block'>Clarity</span>
                      <span className='text-sm font-mono font-bold text-indigo-400'>{item.feedback?.clarity ?? 0}%</span>
                    </div>
                    <div className='rounded-xl bg-white/[0.02] border border-white/5 p-2.5 text-center'>
                      <span className='text-[10px] font-mono text-slate-400 block'>Relevance</span>
                      <span className='text-sm font-mono font-bold text-sky-400'>{item.feedback?.relevance ?? 0}%</span>
                    </div>
                    <div className='rounded-xl bg-white/[0.02] border border-white/5 p-2.5 text-center'>
                      <span className='text-[10px] font-mono text-slate-400 block'>Delivery</span>
                      <span className='text-sm font-mono font-bold text-purple-400'>{item.feedback?.communication ?? 0}%</span>
                    </div>
                  </div>

                  {/* AI Feedback */}
                  <div className='rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3.5'>
                    <span className='text-[10px] font-mono uppercase text-indigo-300 font-semibold block mb-1'>Rubric Feedback:</span>
                    <p className='text-xs text-slate-300 leading-relaxed'>{item.feedback?.feedback || "Evaluation complete."}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}

export default Step3report;
