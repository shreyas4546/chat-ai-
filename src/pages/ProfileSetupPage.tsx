import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AvatarPicker, AvatarOption } from '@/components/ui/AvatarPicker';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

const AI_AVATARS: AvatarOption[] = [
    { id: 'av-1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop', name: 'Aria' },
    { id: 'av-2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop', name: 'Luna' },
    { id: 'av-3', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop', name: 'Orion' },
    { id: 'av-4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop', name: 'Nova' },
];

export function ProfileSetupPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return setError('User not authenticated.');
        if (!selectedAvatarId) return setError('Please select an AI companion avatar.');
        if (!name.trim()) return setError('Please enter your name.');

        setLoading(true);
        setError('');

        try {
            const selectedAvatar = AI_AVATARS.find(a => a.id === selectedAvatarId);

            // Save to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                displayName: name,
                email: user.email,
                companionAvatarId: selectedAvatar?.id,
                companionAvatarUrl: selectedAvatar?.url,
                companionName: selectedAvatar?.name,
                createdAt: new Date().toISOString()
            }, { merge: true });

            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to basic profile setup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-main py-12 px-4 sm:px-6">

            <div className="max-w-3xl mx-auto space-y-12">
                <header className="text-center space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-bold">Customize Your Experience</h1>
                    <p className="text-text-muted">Tell us a bit about you and pick your companion.</p>
                </header>

                <form onSubmit={handleSaveProfile} className="space-y-10 bg-surface/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* User Details */}
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Your Information
                        </h2>
                        <div className="relative pt-2">
                            <label className="text-sm font-medium text-text-muted ml-1 block mb-1">What should Velora call you?</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="e.g. Alex"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-border w-full" />

                    {/* Avatar Details */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Choose Your Companion</h2>
                        <p className="text-sm text-text-muted">Select the AI representation you prefer.</p>

                        <AvatarPicker
                            options={AI_AVATARS}
                            selectedId={selectedAvatarId}
                            onChange={setSelectedAvatarId}
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group cursor-pointer"
                        >
                            {loading ? 'Saving...' : 'Finish Setup'}
                            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
