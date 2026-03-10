import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    React.useEffect(() => {
        if (user) {
            navigate('/onboarding');
        }
    }, [user, navigate]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/onboarding');
        } catch (err: any) {
            setError(err.message || 'Failed to create an account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Background Blooms */}
            <div className="absolute top-[20%] left-[20%] w-[30vw] h-[30vw] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
            <div className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vw] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-text-muted hover:text-text-main transition-colors cursor-pointer">
                <ArrowLeft size={20} />
                <span>Back</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-surface/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">Create Account</h1>
                        <p className="text-text-muted">Start your journey with us today</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text-muted ml-1 block mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-text-main placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-text"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text-muted ml-1 block mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-text-main placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-text"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text-muted ml-1 block mb-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-text-main placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-text"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group mt-2"
                        >
                            {loading ? 'Creating...' : 'Sign Up'}
                            {!loading && <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-text-muted text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-secondary hover:text-white font-medium hover:underline cursor-pointer transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
