import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { FiCheck, FiChevronDown, FiClock, FiFileText, FiSend, FiX, FiArrowLeft, FiMap, FiCpu, FiLayers } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { BsRocketTakeoff } from "react-icons/bs"
import { deductCoins } from '../apis/user.api'
import api from '../utils/axios'
import { useSelector } from 'react-redux'
import RoadmapResult from '../components/roadmap/RoadmapResult'

const PACKAGE_OPTIONS = ["10 LPA", "15 LPA", "20 LPA", "30 LPA", "40 LPA+"];

function Roadmap({ setUser }) {
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [role, setRole] = useState("");
  const [targetPackage, setTargetPackage] = useState(PACKAGE_OPTIONS[2]);
  const [packageOpen, setPackageOpen] = useState(false);
  const [useResume, setUseResume] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const { resume } = useSelector((state) => state.resume);

  const getAllRoadmaps = async () => {
    setHistoryLoading(true);
    try {
      const response = await api.get("/api/roadmap/all");
      setHistory(response.data.data);
      setHistoryLoading(false);
    } catch (err) {
      console.error(err);
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    getAllRoadmaps();
  }, []);

  const getRoadmapById = async (id) => {
    try {
      const response = await api.get(`/api/roadmap/${id}`);
      setRoadmap(response.data.data);
      setHistoryOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    if (!role.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      try {
        const coinResponse = await deductCoins({ coins: 20, action: "roadmap-builder" });
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

      const response = await api.post("/api/roadmap/generate", {
        role: role.trim(),
        targetPackage,
        useResume,
        resume,
      });
      setRoadmap(response.data.data);
      getAllRoadmaps();
      setLoading(false);
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
      setError("Failed to generate learning path. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#07090E] text-[#F1F5F9] font-sans flex flex-col'>
      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='sticky top-0 z-30 border-b border-white/8 bg-[#07090E]/80 backdrop-blur-xl h-14 flex items-center'
      >
        <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6'>
          <div 
            onClick={() => navigate("/dashboard")}
            className='flex cursor-pointer items-center gap-2'
          >
            <span className='text-sm font-display font-extrabold text-white'>CareerForge AI</span>
            <span className='rounded bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-mono text-indigo-300'>
              Skill Roadmap
            </span>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className='flex h-8 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 transition px-3 hover:bg-white/10 text-xs cursor-pointer'
            >
              <FiClock size={13} />
              <span>History ({history?.length ?? 0})</span>
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

      {/* Main Container */}
      <main className='flex-1 overflow-y-auto pb-32 pt-6 sm:pt-10'>
        <div className='max-w-4xl mx-auto px-4'>
          <AnimatePresence mode='wait'>
            {!roadmap ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className='flex flex-col items-center justify-center min-h-[55vh] text-center px-4'
              >
                <div className='w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 shadow-[0_0_25px_rgba(99,102,241,0.3)]'>
                  <BsRocketTakeoff size={28} />
                </div>

                <span className='text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1'>
                  ADAPTIVE SKILL GRAPH
                </span>
                <h2 className='text-2xl sm:text-3xl font-display font-extrabold text-white mb-2'>
                  Engineering Milestone Generator
                </h2>
                <p className='text-slate-400 text-xs sm:text-sm max-w-md mb-6 leading-relaxed'>
                  Input your target role and salary bracket. Our LLM architect structures an end-to-end phased learning syllabus with curated references.
                </p>

                {error && <p className="mb-4 text-xs text-red-400 max-w-md">{error}</p>}

                {/* Role Pill Suggestions */}
                <div className='flex flex-wrap items-center justify-center gap-2 max-w-lg'>
                  {[
                    "Senior Backend (Go / Java)",
                    "Fullstack Next.js / Node",
                    "Distributed Systems Architect",
                    "MLOps / LLM Engineer",
                  ].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className='text-xs py-2 px-3 rounded-xl bg-[#0B0F17] border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all cursor-pointer'
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <RoadmapResult
                roadmap={roadmap}
                onClear={() => setRoadmap(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Interactive Command Bar at Bottom */}
      <div className='fixed bottom-0 left-0 right-0 z-20 pb-5 pt-3 px-4 bg-gradient-to-t from-[#07090E] via-[#07090E]/95 to-transparent pointer-events-auto'>
        <div className='max-w-3xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex items-center gap-2 p-2 rounded-2xl bg-[#0B0F17] border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.8)]'
          >
            <input
              type='text'
              placeholder='Enter target engineering role (e.g., Staff Backend Engineer)...'
              onChange={(e) => setRole(e.target.value)}
              value={role}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerate();
              }}
              className='flex-1 min-w-0 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 outline-none px-3 py-2 font-medium'
            />

            {/* Target Package Dropdown */}
            <div className='relative'>
              <button
                type='button'
                onClick={() => setPackageOpen(!packageOpen)}
                className='flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white bg-white/5 transition-all whitespace-nowrap cursor-pointer'
              >
                <span>{targetPackage}</span>
                <FiChevronDown size={12} className={`transition-transform ${packageOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {packageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className='absolute bottom-full mb-2 right-0 w-32 rounded-xl border border-white/10 bg-[#0E1322] shadow-2xl z-30 overflow-hidden'
                  >
                    {PACKAGE_OPTIONS.map((pkg) => (
                      <button
                        key={pkg}
                        onClick={() => {
                          setTargetPackage(pkg);
                          setPackageOpen(false);
                        }}
                        className={`w-full text-left text-xs px-3 py-2 transition-colors cursor-pointer ${
                          pkg === targetPackage
                            ? "bg-indigo-600 text-white font-semibold"
                            : "text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        {pkg}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Use Resume Toggle */}
            <button
              type='button'
              onClick={() => setUseResume(!useResume)}
              className={`flex items-center text-xs gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                useResume
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
              }`}
              title="Tailor roadmap using uploaded resume data"
            >
              {useResume ? <FiCheck size={13} /> : <FiFileText size={13} />}
              <span className='hidden sm:inline'>Resume</span>
            </button>

            {/* Generate Action Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type='button'
              onClick={handleGenerate}
              disabled={loading || !role.trim()}
              className='h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shrink-0'
            >
              {loading ? (
                <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              ) : (
                <>
                  <span>Build</span>
                  <FiSend size={12} />
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* History Slide-Out Drawer */}
      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryOpen(false)}
              className='fixed inset-0 bg-black/60 z-40 backdrop-blur-sm'
            />
            <motion.aside
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ duration: 0.25 }}
              className='fixed top-0 right-0 h-screen w-[320px] max-w-[85vw] bg-[#0B0F17] border-l border-white/10 z-50 p-5 flex flex-col justify-between overflow-y-auto'
            >
              <div>
                <div className='flex items-center justify-between pb-4 border-b border-white/8 mb-4'>
                  <h3 className='font-display font-bold text-sm text-white'>Generated Roadmaps</h3>
                  <button
                    onClick={() => setHistoryOpen(false)}
                    className='text-slate-400 hover:text-white p-1 rounded-lg'
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {historyLoading ? (
                  <div className='text-center py-8 text-xs text-slate-500'>Loading history...</div>
                ) : history?.length > 0 ? (
                  <div className='space-y-2'>
                    {history.map((h) => (
                      <div
                        key={h._id}
                        onClick={() => getRoadmapById(h._id)}
                        className='p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all cursor-pointer'
                      >
                        <p className='text-xs font-semibold text-white truncate'>{h.title}</p>
                        <p className='text-[10px] font-mono text-indigo-400 mt-0.5'>{h.targetPackage} · {h.level}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-xs text-slate-500 text-center py-8'>No past roadmaps found.</p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Roadmap;
