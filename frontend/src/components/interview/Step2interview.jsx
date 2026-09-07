import React, { useEffect, useRef, useState } from 'react'
import maleVideo from "../../assets/male-ai.mp4"
import femaleVideo from "../../assets/female-ai.mp4"
import { AnimatePresence, motion } from "motion/react"
import { FiArrowRight, FiCamera, FiCameraOff, FiClock, FiCode, FiMessageSquare, FiMic, FiMicOff, FiCpu, FiCheckCircle } from 'react-icons/fi'
import CodeEditor from './CodeEditor'
import Timer from './Timer'
import { submitAnswer } from '../../apis/interview.api'
import { useNavigate } from 'react-router-dom'

function Step2interview({ interviewData, user }) {
  const navigate = useNavigate();

  // ── State ──
  const [question, setQuestion] = useState(interviewData.question);
  const [currentIndex, setCurrentIndex] = useState(interviewData.currentQuestion || 0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interviewData.question.timer || 60);
  const [timerActive, setTimerActive] = useState(true);

  // UI toggles
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  // Speech
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [introSpoken, setIntroSpoken] = useState(false);

  // Refs
  const aiVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  const videoSource = voiceGender === "female" ? femaleVideo : maleVideo;
  const progress = ((currentIndex + 1) / (interviewData.totalQuestions || 1)) * 100;
  const showMicon = micOn && !isAIPlaying;

  // Speech recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const rec = new window.webkitSpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const t = e.results[e.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + t);
    };
    recognitionRef.current = rec;
  }, []);

  const startMic = () => {
    try {
      recognitionRef.current?.start();
    } catch {
      // recognition already running
    }
  };

  const stopMic = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // recognition not running
    }
  };

  const toggleMic = () => {
    if (micOn) {
      stopMic();
    } else {
      startMic();
    }
    setMicOn(!micOn);
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        setCameraOn(true);
        setTimeout(() => {
          if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        }, 100);
      } catch {
        setCameraOn(false);
      }
    }
  };

  const handleSubmitCode = (code) => {
    setAnswer((prev) => {
      const separator = prev.trim() ? "\n\n// --- Algorithmic Solution ---\n" : "// --- Algorithmic Solution ---\n";
      return prev + separator + code;
    });
    setCodeOpen(false);
  };

  useEffect(() => {
    if (timeLeft <= 0 || !timerActive) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, timerActive]);

  useEffect(() => {
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const female = voices.find((v) => /zira|samantha|female/i.test(v.name));
      const male = voices.find((v) => /david|mark|male/i.test(v.name));
      if (female) {
        setSelectedVoice(female);
        setVoiceGender("female");
      } else if (male) {
        setSelectedVoice(male);
        setVoiceGender("male");
      } else {
        setSelectedVoice(voices[0]);
        setVoiceGender("female");
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  const speakText = (text) =>
    new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice || !text?.trim()) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(text.replace(/,/g, ", ... ").replace(/\./g, ". ... "));
        utter.voice = selectedVoice;
        utter.rate = 0.92;
        utter.pitch = 1.05;
        utter.volume = 1;
        utter.onstart = () => {
          setIsAIPlaying(true);
          stopMic();
          aiVideoRef.current?.play();
        };
        utter.onend = () => {
          aiVideoRef.current?.pause();
          setIsAIPlaying(false);
          if (micOn) startMic();
          setTimeout(() => {
            setSubtitle("");
            resolve();
          }, 300);
        };
        setSubtitle(text);
        window.speechSynthesis.speak(utter);
      }, 150);
    });

  useEffect(() => {
    if (!selectedVoice || introSpoken) return;
    const runIntro = async () => {
      setIntroSpoken(true);
      await new Promise((r) => setTimeout(r, 1200));
      const candidateName = user?.name ? user.name.split(" ")[0] : "Candidate";
      await speakText(`Welcome ${candidateName}! Let's begin your interview session.`);
      await new Promise((r) => setTimeout(r, 900));
      await speakText(interviewData.question.question);
    };
    runIntro();
  }, [selectedVoice]);

  useEffect(() => {
    setQuestion(interviewData.question);
    setCurrentIndex(interviewData.currentQuestion || 0);
    setTimeLeft(interviewData.question.timer || 60);
  }, [interviewData]);

  useEffect(() => {
    if (!selectedVoice || !introSpoken) return;
    const speakQuestion = async () => {
      await new Promise((r) => setTimeout(r, 900));
      await speakText(question.question);
    };
    speakQuestion();
  }, [question]);

  useEffect(() => {
    setTimeLeft(question.timer || 60);
    setTimerActive(true);
  }, [question]);

  // Auto-submit when time expires
  useEffect(() => {
    if (timeLeft !== 0) return;
    const autoSubmit = async () => {
      await speakText("Time has expired. Submitting your current response now.");
      const finalAnswer = answer.trim() || "No answer provided within the allotted time limit.";

      setLoading(true);

      const res = await submitAnswer({ interviewId: interviewData.interviewId, answer: finalAnswer });

      if (!res) {
        setLoading(false);
        setTimerActive(true);
        return;
      }

      if (res.completed) {
        setFeedback(res.feedback);
        await new Promise((r) => setTimeout(r, 700));
        await speakText(
          res.feedback?.feedback ||
          "Great job! Your interview session is complete. Compiling your final scorecard now."
        );
        setLoading(false);
        navigate(`/interview/${interviewData.interviewId}/report`);
        return;
      }

      setFeedback(res.feedback);
      await new Promise((r) => setTimeout(r, 700));
      await speakText(
        res.feedback?.feedback ||
        "Response received. Moving forward to the next challenge."
      );
      setLoading(false);
      setQuestion(res.question);
      setCurrentIndex(res.currentQuestion);
      setAnswer("");
      setFeedback(null);
    };

    autoSubmit();
  }, [timeLeft]);

  const submit = async () => {
    if (!answer.trim()) return;

    setTimerActive(false);
    setLoading(true);

    const res = await submitAnswer({ interviewId: interviewData.interviewId, answer });

    if (!res) {
      setLoading(false);
      setTimerActive(true);
      alert("Failed to submit answer. Please try again.");
      return;
    }

    if (res.completed) {
      setFeedback(res.feedback);
      await new Promise((r) => setTimeout(r, 700));
      await speakText(
        res.feedback?.feedback ||
        "Excellent work! Your interview is complete. Navigating to your comprehensive report."
      );
      setLoading(false);
      navigate(`/interview/${interviewData.interviewId}/report`);
      return;
    }

    setFeedback(res.feedback);
    await new Promise((r) => setTimeout(r, 700));
    await speakText(
      res.feedback?.feedback ||
      "Noted your answer. Let's proceed to the next question."
    );
    setLoading(false);
    setQuestion(res.question);
    setCurrentIndex(res.currentQuestion);
    setAnswer("");
    setFeedback(null);
  };

  return (
    <div className='min-h-screen bg-[#07090E] text-[#F1F5F9] font-sans flex items-center justify-center p-3 sm:p-6 relative overflow-hidden'>
      {/* Code Editor Modal */}
      {codeOpen && <CodeEditor onClose={() => setCodeOpen(false)} onSubmitCode={handleSubmitCode} />}

      {/* Main Studio Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className='w-full max-w-6xl bg-[#0B0F17] border border-white/10 rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)] grid lg:grid-cols-[38%_62%]'
      >
        {/* Left Column: AI Stream & AV Controls */}
        <div className='flex flex-col border-b lg:border-b-0 lg:border-r border-white/8 p-5 sm:p-6 gap-4 bg-[#090D15]/90'>
          
          {/* Header pill */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
              <span className='text-xs font-mono font-medium text-slate-300'>LIVE_EVALUATOR_STREAM</span>
            </div>
            <span className='text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'>
              {voiceGender === "female" ? "Voice: Sarah (AI Lead)" : "Voice: David (Staff Architect)"}
            </span>
          </div>

          {/* AI Video Feed Container */}
          <div className='relative rounded-2xl overflow-hidden bg-black aspect-video border border-white/8 shadow-inner'>
            <video
              src={videoSource}
              ref={aiVideoRef}
              muted
              playsInline
              preload="auto"
              loop
              className="w-full h-full object-cover"
            />
            {isAIPlaying && (
              <div className='absolute bottom-3 left-3 flex items-center gap-2 bg-[#090D15]/80 backdrop-blur-md rounded-full px-3 py-1 border border-white/10'>
                <div className='flex gap-1 items-end h-3'>
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-indigo-400 rounded-full"
                      animate={{ height: ["4px", "14px", "4px"] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                    />
                  ))}
                </div>
                <span className='text-[11px] font-medium text-white'>AI Speaking</span>
              </div>
            )}
          </div>

          {/* Live Subtitle Transcript Banner */}
          <div className='min-h-[50px] flex items-center'>
            <AnimatePresence>
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className='w-full rounded-xl bg-indigo-950/40 border border-indigo-500/20 px-3.5 py-2.5'
                >
                  <p className="text-xs text-indigo-200 leading-relaxed text-center font-medium">
                    "{subtitle}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Candidate Webcam / Avatar Container */}
          <div className='relative rounded-2xl overflow-hidden bg-[#101522] border border-white/8 aspect-video flex items-center justify-center shadow-inner'>
            {cameraOn ? (
              <>
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className='absolute top-3 left-3 bg-black/70 backdrop-blur-md rounded-full px-2.5 py-0.5 border border-white/10'>
                  <span className="text-[10px] font-mono text-white">Candidate Video</span>
                </div>
              </>
            ) : (
              <div className='flex flex-col items-center gap-2'>
                <div className='w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center'>
                  <span className='text-xl font-bold font-mono text-indigo-300'>
                    {user?.name?.charAt(0).toUpperCase() || "C"}
                  </span>
                </div>
                <span className='text-xs text-slate-400 font-medium'>{user?.name || "Candidate"}</span>
              </div>
            )}
          </div>

          {/* Studio Audio/Video Controls */}
          <div className='flex flex-col items-center gap-2 pt-1'>
            <div className='flex items-center justify-center gap-3'>
              <motion.button
                onClick={toggleMic}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                  showMicon
                    ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                    : "bg-red-500/20 border-red-500/30 text-red-400"
                }`}
                title={showMicon ? "Microphone Active" : "Microphone Muted"}
              >
                {showMicon ? <FiMic size={17} /> : <FiMicOff size={17} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={toggleCamera}
                className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                  cameraOn
                    ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
                title={cameraOn ? "Turn Camera Off" : "Turn Camera On"}
              >
                {cameraOn ? <FiCamera size={17} /> : <FiCameraOff size={17} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setCodeOpen(true)}
                className="w-11 h-11 rounded-xl flex items-center justify-center border bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all cursor-pointer"
                title="Launch Monaco IDE"
              >
                <FiCode size={17} />
              </motion.button>
            </div>

            <div className='min-h-[16px] flex items-center justify-center'>
              {micOn && isAIPlaying && (
                <span className="text-[11px] font-mono text-amber-400">Mic paused while AI speaks</span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Click <FiCode size={11} className="inline -mt-0.5 text-indigo-400" /> to open the full Monaco Code IDE.
            </p>
          </div>

        </div>

        {/* Right Column: Problem Prompt & Answer Canvas */}
        <div className='flex flex-col p-5 sm:p-7 justify-between bg-[#0B0F17]'>
          
          <div>
            {/* Top Challenge Header */}
            <div className='flex items-start justify-between mb-5'>
              <div>
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-mono text-indigo-400 uppercase tracking-wider'>
                    Problem Challenge
                  </span>
                  <span className='text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 font-mono'>
                    {question.difficulty || "Medium"}
                  </span>
                </div>
                <h2 className='text-lg sm:text-xl font-display font-bold text-white mt-0.5'>
                  Question {currentIndex + 1} of {interviewData.totalQuestions}
                </h2>
              </div>

              {/* Countdown Timer */}
              <div className='flex items-center gap-2'>
                <Timer timeLeft={timeLeft} totalTime={question.timer || 60} />
              </div>
            </div>

            {/* Structured Question Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='relative overflow-hidden rounded-2xl bg-[#101522] border border-white/8 p-5 mb-5 shadow-inner'
            >
              <p className='relative text-slate-200 text-sm sm:text-base leading-relaxed font-medium'>
                {question.question}
              </p>
            </motion.div>

            {/* Session Progress Bar */}
            <div className='mb-4'>
              <div className='flex justify-between text-[11px] font-mono text-slate-400 mb-1.5'>
                <span>COMPLETION_TRACKER</span>
                <span>{currentIndex + 1}/{interviewData.totalQuestions} Rounds</span>
              </div>
              <div className='w-full h-1.5 rounded-full bg-white/10 overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-500'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Candidate Answer Canvas */}
            <div className='flex flex-col'>
              <label className='text-xs font-mono font-medium text-slate-400 mb-2 flex items-center justify-between'>
                <span>YOUR RESPONSE (VOICE TRANSCRIPTION &amp; CODE)</span>
                <span className='text-indigo-400 text-[11px] font-sans'>Auto-captures speech</span>
              </label>
              <textarea
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
                rows={6}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === "Enter") submit();
                }}
                placeholder='Type your solution, speak aloud into the microphone, or click the Code button to insert snippets...'
                className='w-full rounded-2xl bg-[#101522] border border-white/10 p-4 font-mono text-xs sm:text-sm text-slate-200 outline-none resize-none focus:border-indigo-500/50 transition-all placeholder-slate-500 leading-relaxed'
              />
            </div>

            {/* Dynamic Evaluation Feedback Toast */}
            <div className='mt-3 min-h-[0px]'>
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className='rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-4 max-h-40 overflow-y-auto'
                  >
                    <p className='text-xs font-mono uppercase tracking-wider text-indigo-300 mb-1.5 flex items-center gap-1.5'>
                      <FiCheckCircle className='text-emerald-400' /> Multi-Agent Rubric Feedback
                    </p>
                    <p className='text-xs text-slate-300 leading-relaxed'>{feedback.feedback}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Submission Footer */}
          <div className='flex items-center justify-between mt-5 pt-4 border-t border-white/8'>
            <span className='text-xs font-mono text-slate-500 hidden sm:block'>
              Shortcut: <span className='px-1.5 py-0.5 rounded bg-white/10 text-slate-300'>Ctrl + Enter</span>
            </span>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={submit}
              disabled={loading || !answer.trim()}
              className='ml-auto h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer'
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Evaluating Rubric...</span>
                </>
              ) : (
                <>
                  <span>Submit Round Answer</span>
                  <FiArrowRight size={14} />
                </>
              )}
            </motion.button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default Step2interview;
