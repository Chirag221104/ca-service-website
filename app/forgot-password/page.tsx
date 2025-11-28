'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
            toast.success('Password reset email sent! Check your inbox.');
        } catch (error: any) {
            console.error('Password reset error:', error);
            if (error.code === 'auth/user-not-found') {
                toast.error('No account found with this email address.');
            } else if (error.code === 'auth/invalid-email') {
                toast.error('Please enter a valid email address.');
            } else {
                toast.error('Failed to send reset email. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-gray-50">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="inline-block p-3 bg-primary-100 rounded-full mb-4">
                            <svg className="w-12 h-12 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-primary-950 mb-2">
                            Forgot Password?
                        </h2>
                        <p className="text-gray-600">
                            {emailSent
                                ? "We've sent you an email!"
                                : "No worries, we'll send you reset instructions"}
                        </p>
                    </div>

                    {emailSent ? (
                        <div className="space-y-6">
                            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                                <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Check your email</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    We sent a password reset link to <strong>{email}</strong>
                                </p>
                                <p className="text-xs text-gray-500">
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setEmailSent(false);
                                    setEmail('');
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                            >
                                Try another email
                            </button>

                            <Link
                                href="/login"
                                className="block text-center text-primary-950 hover:text-primary-700 font-medium"
                            >
                                ← Back to login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link
                                    href="/login"
                                    className="text-sm text-primary-950 hover:text-primary-700 font-medium"
                                >
                                    ← Back to login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
