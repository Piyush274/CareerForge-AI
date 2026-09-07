import React, { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
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
            setError('An account with this email already exists. Please sign in.');
        } else if (code === 'auth/invalid-email') {
            setError('Please enter a valid email address.');
        } else if (code === 'auth/weak-password') {
            setError('Password is too weak. Please use at least 6 characters.');
        } else if (code === 'auth/popup-closed-by-user') {
            setError('Google sign-in popup was closed.');
        } else {
            setError(err.message || 'Authentication failed. Please try again.');
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4'>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className='relative w-full max-w-md bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
            >
                {/* Glow Overlay */}
                <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/[0.08] via-transparent to-purple-500/[0.05] pointer-events-none' />

                <div className='relative p-7'>
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className='absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5'
                    >
                        <FiX size={18} />
                    </button>

                    {/* Header */}
                    <div className='text-center mb-6'>
                        <h2 className='text-xl font-bold text-white tracking-tight'>
                            {isSignUp ? 'Create your account' : 'Welcome back to'}{' '}
                            <span className='bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent'>
                                CareerForge AI
                            </span>
                        </h2>
                        <p className='text-white/45 text-xs mt-1.5'>
                            {isSignUp 
                                ? 'Sign up to accelerate your interview preparation' 
                                : 'Sign in to continue your AI interview journey'}
                        </p>
                    </div>

                    {/* Error Alert */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className='mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs'
                            >
                                <FiAlertCircle className='shrink-0' size={15} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Google Auth Button */}
                    <motion.button
                        type='button'
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-white/15 bg-white/[0.07] backdrop-blur-md hover:border-white/30 hover:bg-white/[0.12] transition-all disabled:opacity-50 cursor-pointer'
                    >
                        <FcGoogle size={19} />
                        <span className='text-white font-medium text-sm'>
                            Continue with Google
                        </span>
                    </motion.button>

                    {/* Divider */}
                    <div className='relative flex items-center justify-center my-5'>
                        <div className='border-t border-white/10 w-full'></div>
                        <span className='bg-[#0A0A0A] px-3 text-[11px] font-medium text-white/35 uppercase tracking-wider'>
                            Or with email
                        </span>
                        <div className='border-t border-white/10 w-full'></div>
                    </div>

                    {/* Email / Password Form */}
                    <form onSubmit={handleEmailAuth} className='space-y-3.5'>
                        {isSignUp && (
                            <motion.div 
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='relative'
                            >
                                <FiUser className='absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35' size={16} />
                                <input
                                    type='text'
                                    placeholder='Full Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='w-full pl-10 pr-4 py-2.5 text-sm bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all'
                                />
                            </motion.div>
                        )}

                        <div className='relative'>
                            <FiMail className='absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35' size={16} />
                            <input
                                type='email'
                                placeholder='Email address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className='w-full pl-10 pr-4 py-2.5 text-sm bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all'
                            />
                        </div>

                        <div className='relative'>
                            <FiLock className='absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35' size={16} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Password (min. 6 characters)'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className='w-full pl-10 pr-10 py-2.5 text-sm bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors'
                            >
                                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>

                        <motion.button
                            type='submit'
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full py-2.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer'
                        >
                            {loading ? (
                                <span className='inline-flex items-center gap-2'>
                                    <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>
                                    Processing...
                                </span>
                            ) : isSignUp ? (
                                'Create Account'
                            ) : (
                                'Sign In with Email'
                            )}
                        </motion.button>
                    </form>

                    {/* Toggle between Sign In and Sign Up */}
                    <div className='mt-5 text-center'>
                        <p className='text-xs text-white/50'>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                type='button'
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError('');
                                }}
                                className='text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 transition-colors ml-1 cursor-pointer'
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className='relative border-t border-white/10 bg-black/40 py-3 px-4 text-center'>
                    <p className='text-white/30 text-[11px]'>
                        Secure authentication powered by Firebase
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default LoginModel;
