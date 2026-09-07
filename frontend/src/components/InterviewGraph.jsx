import React from 'react';
import { motion } from "motion/react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

function CustomTooltip({ active, payload }) {
    if (active && payload?.length) {
        const item = payload[0];
        return (
            <div className='bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 text-xs text-white shadow-2xl'>
                <p className="text-white/50 text-[10px] uppercase font-semibold tracking-wider mb-0.5">
                    {item.payload?.skill}
                </p>
                <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">{item.value}%</span>
                    <span className="text-[10px] text-white/40">score</span>
                </div>
            </div>
        );
    }
    return null;
}

function BarChartCard({ title, data, count, gradientId, colorStart, colorEnd, index }) {
    const hasData = count > 0 && data && data.length > 0;
    const avgScore = hasData
        ? Math.round(data.reduce((sum, item) => sum + (item.score || 0), 0) / data.length)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -4 }}
            className='relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 rounded-xl p-4 md:p-5
                 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.18)] hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition-all'
        >
            <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none' />

            <div className='relative flex items-center justify-between mb-3'>
                <div>
                    <h4 className='text-white font-semibold text-sm md:text-base'>{title}</h4>
                    <p className='text-white/40 text-[11px]'>{count} {count === 1 ? 'Session' : 'Sessions'} Recorded</p>
                </div>
                {hasData && (
                    <div className='flex items-center gap-1.5 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full'>
                        <span className='text-[10px] text-white/50 font-medium'>Avg</span>
                        <span className='text-xs font-bold text-white'>{avgScore}%</span>
                    </div>
                )}
            </div>

            <div className='relative w-full'>
                {hasData ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart
                            layout="vertical"
                            data={data}
                            margin={{ top: 8, right: 20, left: 10, bottom: 0 }}
                            barCategoryGap="16%"
                        >
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor={colorStart} stopOpacity={0.7} />
                                    <stop offset="100%" stopColor={colorEnd} stopOpacity={1} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.06)"
                                horizontal={false}
                            />

                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                ticks={[0, 25, 50, 75, 100]}
                                stroke="rgba(255,255,255,0.15)"
                                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                                tickFormatter={(val) => `${val}%`}
                                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                tickLine={false}
                            />

                            <YAxis
                                type="category"
                                dataKey="skill"
                                stroke="rgba(255,255,255,0.15)"
                                tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                                width={110}
                            />

                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                            />

                            <Bar
                                dataKey="score"
                                fill={`url(#${gradientId})`}
                                radius={[0, 6, 6, 0]}
                                barSize={12}
                                animationDuration={800}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className='h-[260px] flex flex-col items-center justify-center text-center p-4'>
                        <div className='w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 mb-2'>
                            📊
                        </div>
                        <p className='text-white/60 text-xs font-medium'>No completed interview data yet</p>
                        <p className='text-white/30 text-[11px] mt-1'>Complete an interview to see skill analytics</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function InterviewGraph({ technicalData, hrData, technicalCount = 0, hrCount = 0 }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5'>
            <BarChartCard
                title="Technical Interviews"
                data={technicalData}
                count={technicalCount}
                gradientId="techGradient"
                colorStart="#3b82f6"
                colorEnd="#60a5fa"
                index={0}
            />
            <BarChartCard
                title="HR Interviews"
                data={hrData}
                count={hrCount}
                gradientId="hrGradient"
                colorStart="#8b5cf6"
                colorEnd="#c084fc"
                index={1}
            />
        </div>
    );
}

export default InterviewGraph;
