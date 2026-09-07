import React, { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiAlertCircle, FiShield } from "react-icons/fi";
import { GiArtificialHive } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import { motion, AnimatePresence } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile 
} from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import api from '../utils/axios';

function LoginModel({ onClose, setUser }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleAuth = async () => {
        try {
            setError('');
            setLoading(true);
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();

            const response = await api.post("/api/auth/login", { token });
            setUser(response?.data?.user);
            onClose();
        } catch (err) {
            console.error("Google Auth Error:", err);
            handleFirebaseError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        if (isSignUp && !name.trim()) {
            setError('Please enter your full name.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            setLoading(true);
            let userCredential;

            if (isSignUp) {
                userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
                if (name.trim()) {
                    await updateProfile(userCredential.user, { displayName: name.trim() });
                }
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            }

            // Force refresh token so updated displayName is included in claims
            const token = await userCredential.user.getIdToken(true);

            const response = await api.post("/api/auth/login", { token });
            setUser(response?.data?.user);
            onClose();
        } catch (err) {
            console.error("Email Auth Error:", err);
            handleFirebaseError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFirebaseError = (err) => {
        const code = err.code || '';
        if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
            setError('Invalid email or password.');
        } else if (code === 'auth/email-already-in-use') {
            setError('An account with this email already exists. Please switch to Sign In.');
        } else if (code === 'auth/invalid-email') {
            setError('Please enter a valid email address.');
        } else if (code === 'auth/weak-password') {
            setError('Password is too weak. Please use at least 6 characters.');
        } else if (code === 'auth/popup-closed-by-user') {
            setError('Sign-in popup was closed before completing.');
        } else if (err.response?.data?.message) {
            setError(err.response.data.message);
        } else {
            setError(err.message || 'Authentication failed. Please try again.');
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4'>
            <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className='relative w-full max-w-md bg-[#0D0D0E] border border-white/10 rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.6)]'
            >
                {/* Subtle Ambient Radial Highlight */}
                <div className='absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-white/[0.06] blur-3xl pointer-events-none rounded-full' />

                <div className='relative p-6 sm:p-7'>
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className='absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer'
                        aria-label="Close modal"
                    >
                        <FiX size={17} />
                    </button>

                    {/* Brand Header */}
                    <div className='flex flex-col items-center text-center mb-5'>
                        <div className='w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/15 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.4)] mb-3'>
                            <GiArtificialHive size={22} className='text-white' />
                        </div>
                        <h2 className='text-lg font-bold text-white tracking-tight'>
                            CareerForge AI
                        </h2>
                        <p className='text-white/45 text-xs mt-1 max-w-[280px]'>
                            {isSignUp 
                                ? 'Create an account to start AI mock interviews & roadmaps' 
                                : 'Sign in to continue your interview preparation'}
                        </p>
                    </div>

                    {/* Segmented Tab Switcher */}
                    <div className='flex p-1 mb-5 rounded-xl bg-white/[0.04] border border-white/8'>
                        <button
                            type='button'
                            onClick={() => { setIsSignUp(false); setError(''); }}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                !isSignUp 
                                    ? 'bg-white text-[#0A0A0A] shadow-[0_2px_8px_rgba(0,0,0,0.25)]' 
                                    : 'text-white/50 hover:text-white'
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type='button'
                            onClick={() => { setIsSignUp(true); setError(''); }}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                isSignUp 
                                    ? 'bg-white text-[#0A0A0A] shadow-[0_2px_8px_rgba(0,0,0,0.25)]' 
                                    : 'text-white/50 hover:text-white'
                            }`}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Error Alert */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className='flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs'
                            >
                                <FiAlertCircle className='shrink-0' size={15} />
                                <span className='leading-snug'>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Google Auth Button */}
                    <motion.button
                        type='button'
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className='w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-white/12 bg-white/[0.05] hover:bg-white/[0.09] hover:border-white/20 transition-all disabled:opacity-50 cursor-pointer text-white font-medium text-xs sm:text-sm shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
                    >
                        <FcGoogle size={18} />
                        <span>Continue with Google</span>
                    </motion.button>

                    {/* Divider */}
                    <div className='relative flex items-center justify-center my-4.5'>
                        <div className='border-t border-white/10 w-full' />
                        <span className='absolute bg-[#0D0D0E] px-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider whitespace-nowrap'>
                            or with email
                        </span>
                    </div>

                    {/* Email / Password Form */}
                    <form onSubmit={handleEmailAuth} className='space-y-3'>
                        {isSignUp && (
                            <motion.div 
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='relative'
                            >
                                <FiUser className='absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35' size={15} />
                                <input
                                    type='text'
                                    placeholder='Full Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete='name'
                                    required={isSignUp}
                                    className='w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all'
                                />
                            </motion.div>
                        )}

                        <div className='relative'>
                            <FiMail className='absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35' size={15} />
                            <input
                                type='email'
                                placeholder='Email address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete='email'
                                required
                                className='w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all'
                            />
                        </div>

                        <div className='relative'>
                            <FiLock className='absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35' size={15} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Password (min. 6 characters)'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                                required
                                className='w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors p-0.5'
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type='submit'
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className='w-full py-2.5 px-4 mt-2 rounded-xl bg-white text-[#0A0A0A] font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(255,255,255,0.12)] hover:bg-neutral-200 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2'
                        >
                            {loading ? (
                                <span className='inline-flex items-center gap-2 text-[#0A0A0A]'>
                                    <span className='w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin'></span>
                                    Authenticating...
                                </span>
                            ) : (
                                <>
                                    <span>{isSignUp ? 'Create Account' : 'Sign In with Email'}</span>
                                    <FaArrowRight size={12} />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                {/* Footer Security Badge */}
                <div className='border-t border-white/8 bg-black/40 py-2.5 px-4 flex items-center justify-center gap-1.5 text-white/30 text-[11px]'>
                    <FiShield size={12} className='text-white/40' />
                    <span>End-to-end encrypted authentication</span>
                </div>
            </motion.div>
        </div>
    );
}

export default LoginModel;
