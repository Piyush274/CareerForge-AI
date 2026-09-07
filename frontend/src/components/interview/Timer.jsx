import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Timer({ timeLeft, totalTime }) {
  const percentage = Math.max(0, Math.min(100, (timeLeft / (totalTime || 60)) * 100));
  
  // Dynamic color coding based on remaining time
  const pathColor = timeLeft > 20 ? "#6366F1" : timeLeft > 10 ? "#F59E0B" : "#EF4444";
  const textColor = timeLeft <= 10 ? "#EF4444" : "#F1F5F9";

  return (
    <div className='w-16 h-16 relative flex items-center justify-center'>
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: "26px",
          pathColor: pathColor,
          textColor: textColor,
          trailColor: "rgba(255, 255, 255, 0.08)",
          strokeLinecap: "round",
        })}
      />
    </div>
  )
}

export default Timer
