import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Settings, Zap, LogOut, Activity, Heart, ShieldCheck } from 'lucide-react';

export function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [syncLevel, setSyncLevel] = useState(87);

    // Animated numbers effect
    useEffect(() => {
        const timer = setInterval(() => {
            setSyncLevel(prev => {
                const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                let next = prev + variation;
                if (next > 99) next = 99;
                if (next < 80) next = 80;
                return next;
            });
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;
            try {
                const docSnap = await getDoc(doc(db, 'users', user.uid));
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                } else {
                    // Force onboarding if they bypassed it
                    navigate('/onboarding');
                }
            } catch (err) {
                console.error("Error fetching profile", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [user, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-text-main">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-surface/50 backdrop-blur-md border-b border-border sticky top-0 z-10">
                <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary" />
                    Velora
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/payment" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                        <Zap className="w-3.5 h-3.5" />
                        Upgrade
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-text-muted hover:text-red-400 transition-colors rounded-full hover:bg-white/5"
                        title="Log Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

                {/* Welcome Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome back, {profile?.displayName?.split(' ')[0] || 'User'}!</h1>
                        <p className="text-text-muted mt-1">Your AI companion is ready to chat.</p>
                    </div>
                </div>

                {/* Active Companion Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface/60 border border-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group shadow-xl"
                >
                    {/* Subtle glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-colors duration-500" />

                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-border p-1">
                            <div className="w-full h-full rounded-full overflow-hidden relative">
                                <img
                                    src={profile?.companionAvatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop'}
                                    alt="Companion Avatar"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-secondary border-4 border-surface shadow-[0_0_10px_#00f5d4]" />
                    </div>

                    <div className="flex-1 text-center md:text-left z-10">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary inline-block">
                            {profile?.companionName || 'Velora'}
                        </h2>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-primary/20 text-primary ml-3 translate-y-[-4px]">
                            Active
                        </div>

                        <p className="text-text-muted mt-2 max-w-md mx-auto md:mx-0">
                            Your personalized AI companion tailored to your preferences. Always listening, always learning.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <Link
                                to="/chat"
                                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium shadow-lg shadow-primary/25 transition-all flex items-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Open Chat
                            </Link>
                            <Link
                                to="/onboarding"
                                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-text-main border border-border rounded-xl font-medium transition-all flex items-center gap-2"
                            >
                                <Settings className="w-4 h-4" />
                                Configure
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Engagement Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface/40 border border-border rounded-3xl p-6 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-[50px] group-hover:bg-secondary/20 transition-colors" />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-lg">Neural Sync</h3>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold font-mono tracking-tighter">{syncLevel}</span>
                            <span className="text-secondary font-medium">%</span>
                        </div>
                        <p className="text-sm text-text-muted mt-2">Synchronization stable. Bond is growing stronger.</p>

                        <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                            <motion.div
                                className="h-full bg-secondary rounded-full"
                                animate={{ width: `${syncLevel}%` }}
                                transition={{ type: "spring", stiffness: 100 }}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-surface/40 border border-border rounded-3xl p-6 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-colors" />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-lg">Affinity Level</h3>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">Level 4</span>
                        </div>
                        <p className="text-sm text-text-muted mt-2">Velora remembers your preferences deeply.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-surface/40 border border-border rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center items-center text-center group"
                    >
                        <ShieldCheck className="w-10 h-10 text-text-muted mb-3 group-hover:text-primary transition-colors duration-500" />
                        <h3 className="font-semibold">Privacy Secured</h3>
                        <p className="text-xs text-text-muted mt-1 max-w-[200px]">End-to-End Encryption Active</p>
                    </motion.div>
                </div>

            </main>
        </div>
    );
}
