import React from 'react'
import { motion } from "motion/react";
import { FiCheckCircle, FiClock, FiMap, FiTarget, FiX } from 'react-icons/fi';
import ModuleCard from './ModuleCard';

function RoadmapResult({ roadmap, onClear }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='relative overflow-hidden bg-[#0B0F17] border border-white/10 rounded-3xl p-6 sm:p-7 mb-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
      >
        <div className='flex items-start justify-between mb-4'>
          <div>
            <span className='text-[10px] font-mono text-indigo-400 uppercase tracking-widest block mb-1'>
              GENERATED SYLLABUS
            </span>
            <h2 className='text-xl sm:text-2xl font-display font-bold text-white'>{roadmap.title}</h2>
            <p className='text-xs text-slate-400 mt-1'>
              Target Bracket: <span className="text-indigo-300 font-mono font-semibold">{roadmap.targetPackage}</span>
            </p>
          </div>
          <button
            onClick={onClear}
            className='p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer'
            title="Create new roadmap"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/8'>
          {[
            { icon: FiTarget, label: "Difficulty Tier", value: roadmap.level },
            { icon: FiClock, label: "Estimated Duration", value: roadmap.duration },
            { icon: FiCheckCircle, label: "Structured Modules", value: `${roadmap.modules?.length ?? 0} Chapters` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className='rounded-2xl p-3.5 bg-[#101522] border border-white/5'>
              <div className='flex items-center gap-1.5 mb-1'>
                <Icon size={13} className="text-indigo-400" />
                <span className='text-[11px] font-mono text-slate-400'>{label}</span>
              </div>
              <p className='text-xs sm:text-sm font-semibold text-white'>{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Modules List */}
      <div className='mb-6'>
        <p className='text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2'>
          <FiMap size={13} className='text-indigo-400' /> Phased Milestone Chapters
        </p>
        <div className='flex flex-col gap-3'>
          {roadmap.modules?.map((m, i) => (
            <ModuleCard key={m.title} mod={m} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default RoadmapResult;
