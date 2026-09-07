import React from 'react'
import { motion } from "motion/react"
import { FiTrendingUp, FiActivity } from 'react-icons/fi'

function Statbox({ label, value, sub, subHighlight, icon, trend = "+12%", index = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -3 }}
      className='relative overflow-hidden rounded-2xl bg-[#0C101A] border border-white/8 p-4 sm:p-5 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:border-indigo-500/30 transition-all group'
    >
      {/* Ambient background glow */}
      <div className='absolute top-0 right-0 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none' />

      <div className='flex items-center justify-between mb-3'>
        <span className='text-slate-400 text-xs font-medium uppercase tracking-wider font-mono'>
          {label}
        </span>
        <div className='w-7 h-7 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center text-indigo-400'>
          {icon || <FiActivity size={14} />}
        </div>
      </div>

      <div className='mb-2'>
        <span className='text-white font-mono text-2xl sm:text-3xl font-extrabold tracking-tight'>
          {value}
        </span>
      </div>

      <div className='flex items-center justify-between pt-2 border-t border-white/5'>
        {subHighlight ? (
          <span className='inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'>
            <FiTrendingUp size={10} /> {subHighlight}
          </span>
        ) : (
          <span className='text-[10px] font-mono text-slate-500'>Verified Metric</span>
        )}

        {sub && (
          <span className='text-slate-400 text-[11px] truncate ml-2'>{sub}</span>
        )}
      </div>
    </motion.div>
  )
}

export default Statbox
