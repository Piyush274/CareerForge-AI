import React, { useState } from 'react'
import { motion } from "motion/react"
import { FiArrowLeft, FiInfo, FiZap } from 'react-icons/fi'
import { GiTwoCoins } from 'react-icons/gi'
import PricingCard from '../components/PricingCard'
import api from '../utils/axios'
import { useNavigate } from 'react-router-dom'

const plan = [
  {
    title: "Free",
    price: "Free",
    coins: 150,
    button: "Claimed Initial Coins",
    popular: false,
    disabled: true,
    features: [
      "150 Complimentary Credits",
      "Full Resume ATS Scanner",
      "Basic AI Code Practice",
      "Career Roadmap Generator",
    ],
  },
  {
    title: "Starter",
    price: "199",
    coins: 300,
    button: "Top Up 300 Credits",
    popular: true,
    disabled: false,
    features: [
      "300 Multi-Agent Interview Credits",
      "Unlimited Resume ATS Rescans",
      "Priority Low-Latency Audio Stream",
      "Detailed Diagnostic Scorecards",
    ],
  },
];

const CREDIT_COSTS = [
  { name: "Resume ATS Scorer", cost: "10 Credits", desc: "Full structural & keyword audit" },
  { name: "Career Roadmap Generator", cost: "20 Credits", desc: "Customized multi-phase skill tree" },
  { name: "Live AI Interview Session", cost: "50 Credits", desc: "Full voice, IDE, and multi-agent rubric report" },
];

function Billing({ user, setUser }) {
  const navigate = useNavigate();

  const handlePayment = async (plan) => {
    if (plan.disabled) return;
    try {
      const result = await api.post("/api/billing/create", { planId: plan.title.toLowerCase() });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.order.amount,
        currency: result.data.order.currency,
        name: "CareerForge AI",
        description: `${plan.title} - ${plan.coins} Interview Credits`,
        order_id: result.data.order.id,
        handler: async function (response) {
          try {
            await api.post("/api/billing/verify", response);
            const coinRes = await api.post("/api/auth/add-coins", { coins: plan.coins });
            setUser((prev) => ({
              ...prev,
              interviewCoin: coinRes.data.interviewCoin,
            }));
            alert("Credits successfully added! 🎉");
            navigate("/dashboard");
          } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || "Payment verification failed");
          }
        },
        theme: {
          color: "#6366F1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='min-h-screen bg-[#07090E] text-[#F1F5F9] font-sans pb-16'>
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
              Billing &amp; Credits
            </span>
          </div>

          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20'>
              <GiTwoCoins className='text-amber-400' size={15} />
              <span className='text-xs font-mono font-bold text-amber-200'>
                {user?.interviewCoin ?? 0} Credits
              </span>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className='text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer'
            >
              <FiArrowLeft size={13} />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className='max-w-5xl mx-auto px-4 pt-12 sm:pt-16 text-center'>
        <span className='text-xs font-mono text-indigo-400 uppercase tracking-wider block mb-2'>
          TRANSPARENT USAGE CREDITS
        </span>
        <h1 className='text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight'>
          Power Your Interview Simulation Engine
        </h1>
        <p className='text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2'>
          Interview credits are only deducted upon successful session generation. Never worry about surprise monthly recurring bills.
        </p>

        {/* Pricing Cards Grid */}
        <div className='mt-12 flex flex-wrap justify-center gap-6'>
          {plan.map((p) => (
            <PricingCard
              key={p.title}
              {...p}
              onBuy={() => handlePayment(p)}
            />
          ))}
        </div>

        {/* Credit Breakdown Table */}
        <div className='mt-16 max-w-2xl mx-auto text-left'>
          <div className='p-6 rounded-3xl bg-[#0B0F17] border border-white/10'>
            <div className='flex items-center gap-2 mb-4'>
              <FiInfo className='text-indigo-400' size={16} />
              <h3 className='text-sm font-display font-bold text-white'>Feature Credit Consumption Rates</h3>
            </div>

            <div className='space-y-3'>
              {CREDIT_COSTS.map((item, idx) => (
                <div key={idx} className='p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between'>
                  <div>
                    <p className='text-xs font-semibold text-slate-200'>{item.name}</p>
                    <p className='text-[11px] text-slate-500'>{item.desc}</p>
                  </div>
                  <span className='font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg'>
                    {item.cost}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Billing;
