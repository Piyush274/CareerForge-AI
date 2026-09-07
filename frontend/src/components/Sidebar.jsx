import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import { GiArtificialHive, GiTwoCoins } from 'react-icons/gi'
import { FiFileText, FiLogOut, FiMap, FiPlus, FiSidebar, FiStar, FiGrid, FiCreditCard } from 'react-icons/fi'
import { useNavigate, useLocation } from "react-router-dom"
import { FaCirclePlus } from "react-icons/fa6"

const NAV_ITEMS = [
  {
    icon: <FiGrid size={16} />,
    label: "Dashboard",
    path: "/dashboard",
    shortcut: "⌘D"
  },
  {
    icon: <FiFileText size={16} />,
    label: "Resume Builder",
    path: "/resume",
    shortcut: "⌘B"
  },
  {
    icon: <FiStar size={16} />,
    label: "Resume Scorer",
    path: "/scorer",
    shortcut: "⌘S"
  },
  {
    icon: <FiMap size={16} />,
    label: "Career Roadmap",
    path: "/roadmap",
    shortcut: "⌘R"
  },
  {
    icon: <FiCreditCard size={16} />,
    label: "Billing & Plans",
    path: "/billing",
    shortcut: "⌘P"
  }
];

function Sidebar({
  user,
  onNewInterview,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  moblieOpen,
  setMoblieOpen
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const avatar = user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const inner = (
    <div className='flex flex-col h-full bg-[#080B11] text-slate-300 select-none'>
      
      {/* Header Bar */}
      <div className={`px-4 h-[64px] border-b border-white/8 shrink-0 flex items-center ${sidebarOpen ? "justify-between" : "justify-center"}`}>
        {sidebarOpen && (
          <div 
            onClick={() => navigate("/dashboard")}
            className='flex items-center gap-2.5 cursor-pointer group'
          >
            <div className='w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.25)] group-hover:border-indigo-400/50 transition-all'>
              <GiArtificialHive size={18} className='text-indigo-400' />
            </div>
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className='flex flex-col'
            >
              <span className='font-display font-bold text-sm tracking-tight text-white'>CareerForge</span>
              <span className='text-[10px] text-indigo-400 font-mono -mt-1'>STUDIO_v3.4</span>
            </motion.div>
          </div>
        )}

        <div className='flex items-center'>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='cursor-pointer hidden md:flex p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors shrink-0'
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <FiSidebar size={16} />
          </button>

          <button
            onClick={() => setMoblieOpen(!moblieOpen)}
            className='cursor-pointer md:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors shrink-0'
          >
            <FiSidebar size={16} />
          </button>
        </div>
      </div>

      {/* CTA: Create New Interview */}
      <div className='px-3 pt-4 pb-2 shrink-0'>
        <motion.button
          onClick={onNewInterview}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl py-2.5 transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)] cursor-pointer ${
            sidebarOpen ? "px-3.5" : "justify-center px-0"
          }`}
        >
          <FiPlus size={16} className='shrink-0' />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className='text-xs font-medium tracking-wide whitespace-nowrap'
              >
                New Interview Session
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Navigation Label */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='px-4 pt-3 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500'
          >
            Navigation
          </motion.p>
        )}
      </AnimatePresence>

      {/* Nav List */}
      <nav className='flex flex-col gap-1 px-3 flex-1 overflow-y-auto pt-1'>
        {NAV_ITEMS.map((nav, i) => {
          const isActive = location.pathname === nav.path;
          return (
            <motion.button
              key={i}
              onClick={() => {
                navigate(nav.path);
                setMoblieOpen(false);
              }}
              whileHover={{ x: sidebarOpen ? 2 : 0 }}
              className={`relative flex items-center gap-3 rounded-xl py-2.5 transition-all text-xs font-medium cursor-pointer ${
                sidebarOpen ? "px-3" : "justify-center px-0"
              } ${
                isActive
                  ? "bg-indigo-600/15 text-white border border-indigo-500/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className='absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-500 rounded-r-full'
                />
              )}
              <span className={`shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400"}`}>{nav.icon}</span>

              {sidebarOpen && (
                <div className='flex items-center justify-between flex-1 min-w-0'>
                  <span className='whitespace-nowrap truncate font-medium'>{nav.label}</span>
                  <span className='text-[10px] font-mono text-slate-600 ml-2'>{nav.shortcut}</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Coins & Account Footer */}
      <div className='border-t border-white/8 p-3 shrink-0 bg-[#06080D]'>
        
        {/* Coin Balance Pill */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => navigate("/billing")}
              className='group flex cursor-pointer items-center justify-between gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 px-3 py-2 mb-3 transition-all'
            >
              <div className='flex items-center gap-2'>
                <div className='w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400'>
                  <GiTwoCoins size={14} />
                </div>
                <div className='flex flex-col'>
                  <span className='text-[9px] uppercase tracking-wider text-amber-400/80 font-mono'>Interview Credits</span>
                  <span className='text-xs font-bold font-mono text-amber-200'>{user?.interviewCoin ?? 0}</span>
                </div>
              </div>

              <div className='flex items-center gap-1 text-[11px] font-medium text-amber-300'>
                <span className='text-[10px]'>Add</span>
                <FaCirclePlus size={13} className='group-hover:rotate-90 transition-transform duration-200' />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Profile Strip */}
        <div className={`flex items-center gap-2.5 ${sidebarOpen ? "" : "justify-center"}`}>
          <div className='relative'>
            <div className='w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 p-[1px] shadow-inner'>
              <div className='w-full h-full bg-[#0E131F] rounded-[11px] flex items-center justify-center'>
                <span className='text-white font-bold text-[11px] font-mono'>{avatar}</span>
              </div>
            </div>
            <span className='absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#080B11]' />
          </div>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-white text-xs font-semibold truncate leading-tight">
                  {user?.name ?? "Candidate"}
                </p>
                <p className="text-slate-500 text-[10px] truncate font-mono">
                  {user?.email ?? "candidate@example.com"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.button
                onClick={onLogout}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.15 }}
                title="Log out"
                className='text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all ml-auto cursor-pointer'
              >
                <FiLogOut size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );

  return (
    <>
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className='hidden md:flex fixed top-0 left-0 h-screen bg-[#080B11] border-r border-white/8 flex-col z-40 overflow-hidden'
      >
        {inner}
      </motion.aside>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {moblieOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMoblieOpen(false)}
            className='fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-md'
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {moblieOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className='fixed top-0 left-0 h-screen w-[280px] max-w-[85vw] bg-[#080B11] border-r border-white/8 flex flex-col z-50 md:hidden overflow-hidden'
          >
            {inner}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
