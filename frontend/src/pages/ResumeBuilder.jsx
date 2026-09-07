import React, { useState } from 'react'
import ResumeForm from '../components/resume/ResumeForm'
import initialData from '../components/resume/initialData'
import { motion } from "motion/react"
import { FiArrowLeft, FiArrowRight, FiEye, FiCheck } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import PreviewResume from '../components/resume/PreviewResume'

const STEPS = [
  { step: 1, title: "Personal Details & Contacts", subtitle: "Name, email, portfolio, and location" },
  { step: 2, title: "Executive Summary", subtitle: "Compelling career snapshot and core strengths" },
  { step: 3, title: "Technical Skills & Tools", subtitle: "Languages, frameworks, databases, and cloud platforms" },
  { step: 4, title: "Work Experience", subtitle: "Demonstrated impact, metrics, and past roles" },
  { step: 5, title: "Key Projects & Architecture", subtitle: "Notable open source or engineering projects" },
  { step: 6, title: "Education & Certifications", subtitle: "Degrees, academic background, and credentials" },
];

const TOTAL_STEPS = STEPS.length;

function ResumeBuilder({ user, setUser }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const progressPct = (currentStep / TOTAL_STEPS) * 100;
  const activeStep = STEPS.find((s) => s.step === currentStep) || STEPS[0];

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isLastStep = currentStep === TOTAL_STEPS;

  if (showPreview) {
    return (
      <PreviewResume
        data={data}
        user={user}
        setUser={setUser}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className='min-h-screen bg-[#07090E] text-[#F1F5F9] font-sans flex flex-col'>
      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='sticky top-0 z-30 border-b border-white/8 bg-[#07090E]/80 backdrop-blur-xl h-14 flex items-center'
      >
        <div className='mx-auto flex w-full max-w-5xl items-center justify-between px-4 sm:px-6'>
          <div 
            onClick={() => navigate("/dashboard")}
            className='flex cursor-pointer items-center gap-2'
          >
            <span className='text-sm font-display font-extrabold text-white'>CareerForge AI</span>
            <span className='rounded bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-mono text-indigo-300'>
              ATS Resume Builder
            </span>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={() => setShowPreview(true)}
              className='flex h-8 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 transition px-3 hover:bg-white/10 text-xs cursor-pointer'
            >
              <FiEye size={13} />
              <span>Live Preview</span>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className='text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer'
            >
              <FiArrowLeft size={13} />
              <span className='hidden sm:inline'>Dashboard</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Main Form Container */}
      <div className='flex-1 px-4 py-8 sm:px-6 sm:py-10'>
        <div className='mx-auto w-full max-w-2xl'>
          
          {/* Progress Header */}
          <div className='mb-6'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-[10px] font-mono text-indigo-400 uppercase tracking-widest'>
                STEP {currentStep} OF {TOTAL_STEPS}
              </span>
              <span className='text-[10px] font-mono text-slate-400'>
                {Math.round(progressPct)}% Completed
              </span>
            </div>

            <div className='w-full h-1.5 bg-white/10 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-300'
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className='mt-4'>
              <h2 className='text-xl sm:text-2xl font-display font-bold text-white'>
                {activeStep.title}
              </h2>
              <p className='mt-1 text-xs text-slate-400'>
                {activeStep.subtitle}
              </p>
            </div>
          </div>

          {/* Form Content Area */}
          <div className='p-6 sm:p-8 rounded-3xl bg-[#0B0F17] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'>
            <ResumeForm step={currentStep} data={data} setData={setData} />

            {/* Stepper Navigation Buttons */}
            <div className='flex items-center justify-between mt-8 pt-5 border-t border-white/8'>
              <button
                disabled={currentStep === 1}
                onClick={goPrev}
                className='px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1.5'
              >
                <FiArrowLeft size={13} />
                <span>Previous</span>
              </button>

              {isLastStep ? (
                <button
                  onClick={() => setShowPreview(true)}
                  className='px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all cursor-pointer flex items-center gap-1.5'
                >
                  <span>Review &amp; Export</span>
                  <FiCheck size={14} />
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className='px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all cursor-pointer flex items-center gap-1.5'
                >
                  <span>Continue</span>
                  <FiArrowRight size={13} />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
