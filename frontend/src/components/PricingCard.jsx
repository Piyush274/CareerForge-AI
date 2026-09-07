import React from 'react'
import { FiCheck, FiZap } from 'react-icons/fi'
import { GiTwoCoins } from 'react-icons/gi'
import { motion } from 'motion/react'

function PricingCard({
  title,
  price,
  coins,
  button,
  features,
  popular,
  disabled,
  onBuy,
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative w-full max-w-[340px] rounded-3xl overflow-hidden p-6 sm:p-7 flex flex-col justify-between transition-all ${
        popular
          ? "border-2 border-indigo-500/50 bg-[#0E1322] shadow-[0_20px_60px_rgba(99,102,241,0.25)]"
          : "border border-white/10 bg-[#0B0F17] shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
      }`}
    >
      {popular && (
        <div className='absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none' />
      )}

      <div>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='font-display text-lg font-bold text-white'>{title} Tier</h3>
          {popular && (
            <span className='rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-mono font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'>
              MOST POPULAR
            </span>
          )}
        </div>

        <div className='flex items-baseline gap-1.5 mb-5'>
          <span className='font-display text-3xl sm:text-4xl font-extrabold text-white'>
            {price === "Free" ? "Free" : `₹${price}`}
          </span>
          {price !== "Free" && <span className='text-xs font-mono text-slate-400'>/ one-time pack</span>}
        </div>

        {/* Coin badge */}
        <div className='flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 mb-6'>
          <div className='w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center'>
            <GiTwoCoins size={16} />
          </div>
          <div>
            <span className='text-[10px] uppercase font-mono text-amber-300 block'>INCLUDED BALANCE</span>
            <span className='text-xs font-bold font-mono text-white'>{coins} Interview Credits</span>
          </div>
        </div>

        {/* Feature List */}
        <div className='space-y-2.5 mb-8'>
          {features.map((f) => (
            <div key={f} className='flex items-center gap-2.5 text-xs text-slate-300'>
              <div className='w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] shrink-0'>
                <FiCheck size={10} />
              </div>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        disabled={disabled}
        onClick={onBuy}
        className={`w-full py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
          disabled
            ? "cursor-not-allowed bg-white/5 border border-white/5 text-slate-500"
            : popular
            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.45)]"
            : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
        }`}
      >
        {button}
      </button>
    </motion.div>
  );
}

export default PricingCard;
