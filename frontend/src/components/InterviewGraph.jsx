import React from 'react'
import { motion } from "motion/react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { FiCode, FiUserCheck, FiLayers } from 'react-icons/fi';

function CustomTooltip({ active, payload }) {
  if (active && payload?.length) {
    const item = payload[0]?.payload;
    return (
      <div className='bg-[#0F172A] border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-white shadow-2xl backdrop-blur-xl'>
        <p className="text-slate-400 font-mono text-[10px] uppercase mb-0.5">{item?.skill || "Skill Domain"}</p>
        <p className="font-bold font-mono text-indigo-300 text-sm">{payload[0]?.value}% Proficiency</p>
      </div>
    );
  }
  return null;
}

const DEFAULT_TECH = [
  { skill: "Data Structures", score: 85 },
  { skill: "Algorithms", score: 80 },
  { skill: "System Design", score: 75 },
  { skill: "Problem Solving", score: 90 },
  { skill: "Code Quality", score: 82 },
];

const DEFAULT_HR = [
  { skill: "Communication", score: 88 },
  { skill: "STAR Method", score: 84 },
  { skill: "Leadership", score: 78 },
  { skill: "Conflict Resolution", score: 85 },
  { skill: "Culture Fit", score: 92 },
];

function RadarCard({ title, data, count, color, fillColor, icon, index }) {
  const chartData = (data && data.length > 0) ? data : (index === 0 ? DEFAULT_TECH : DEFAULT_HR);
  const isMock = !data || data.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 + index * 0.1 }}
      className='relative overflow-hidden rounded-2xl bg-[#0C101A] border border-white/8 p-5 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
    >
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400'>
            {icon}
          </div>
          <div>
            <h4 className='text-sm font-display font-bold text-white'>{title}</h4>
            <span className='text-[11px] font-mono text-slate-400'>
              {count} Session{count === 1 ? "" : "s"} Logged {isMock && "(Sample Benchmark)"}
            </span>
          </div>
        </div>

        <span className='text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10'>
          Multi-Axis Rubric
        </span>
      </div>

      <div className='relative w-full h-[220px] my-2'>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(255, 255, 255, 0.08)" gridType="circle" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "rgba(203, 213, 225, 0.7)", fontSize: 10, fontWeight: 500 }}
            />
            <Radar
              name={title}
              dataKey="score"
              stroke={color}
              fill={fillColor}
              fillOpacity={0.25}
              strokeWidth={2}
              dot={{ r: 3, fill: color, strokeWidth: 1, stroke: "#0C101A" }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className='pt-3 border-t border-white/5 flex items-center justify-between text-xs'>
        <span className='text-slate-400'>Top Trait:</span>
        <span className='font-mono font-semibold text-indigo-300'>
          {chartData[0]?.skill} ({chartData[0]?.score}%)
        </span>
      </div>
    </motion.div>
  );
}

function InterviewGraph({ technicalData = [], hrData = [], technicalCount = 0, hrCount = 0 }) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
      <RadarCard
        title="Technical & Coding Competency"
        data={technicalData}
        count={technicalCount}
        color="#818CF8"
        fillColor="#6366F1"
        icon={<FiCode size={16} />}
        index={0}
      />
      <RadarCard
        title="Behavioral & Leadership Metrics"
        data={hrData}
        count={hrCount}
        color="#38BDF8"
        fillColor="#0284C7"
        icon={<FiUserCheck size={16} />}
        index={1}
      />
    </div>
  );
}

export default InterviewGraph;
