'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                displayName: displayName
            });
            toast.success('Profile updated! Please refresh the page.');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="p-8 text-center">Please log in to view this page.</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6">My Profile</h1>

                <div className="mb-6">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium capitalize">{user.role}</p>
                    {user.email === 'cakajalmalde08@gmail.com' && user.role !== 'admin' && (
                        <p className="text-xs text-red-500 mt-1">
                            You should be an admin. The system will attempt to fix this on next login.
                        </p>
                    )}
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="input-field"
                            placeholder="Enter your name"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
