'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    User as FirebaseUser,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    resetSessionTimer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '30') * 60 * 1000; // Convert to ms
const WARNING_TIME = 2 * 60 * 1000; // 2 minutes before timeout

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
    const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);
    const [showWarning, setShowWarning] = useState(false);
    const router = useRouter();

    const clearTimers = useCallback(() => {
        if (sessionTimer) clearTimeout(sessionTimer);
        if (warningTimer) clearTimeout(warningTimer);
    }, [sessionTimer, warningTimer]);

    const handleSessionTimeout = useCallback(async () => {
        clearTimers();
        await firebaseSignOut(auth);
        setUser(null);
        setShowWarning(false);
        router.push('/login?timeout=true');
    }, [clearTimers, router]);

    const resetSessionTimer = useCallback(() => {
        clearTimers();
        setShowWarning(false);

        // Set warning timer
        const warning = setTimeout(() => {
            setShowWarning(true);
        }, SESSION_TIMEOUT - WARNING_TIME);

        // Set logout timer
        const logout = setTimeout(() => {
            handleSessionTimeout();
        }, SESSION_TIMEOUT);

        setWarningTimer(warning);
        setSessionTimer(logout);
    }, [clearTimers, handleSessionTimeout]);

    // Auth State Observer
    useEffect(() => {
        setPersistence(auth, browserLocalPersistence);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            console.log('Auth State Changed:', firebaseUser ? 'User Logged In' : 'User Logged Out', firebaseUser?.email);

            if (firebaseUser) {
                try {
                    console.log('Fetching user data from Firestore...');
                    // Fetch additional user data from Firestore
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    const isAdminEmail = firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
                    console.log('Is Admin Email:', isAdminEmail);

                    if (userDoc.exists()) {
                        console.log('User document exists');
                        const userData = userDoc.data();

                        // Check if admin role needs to be updated
                        if (isAdminEmail && userData.role !== 'admin') {
                            console.log('Updating user role to admin...');
                            await setDoc(doc(db, 'users', firebaseUser.uid), { role: 'admin' }, { merge: true });
                            userData.role = 'admin';
                        }

                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email!,
                            displayName: userData.displayName || firebaseUser.displayName || 'User',
                            photoURL: userData.photoURL || firebaseUser.photoURL || '',
                            role: userData.role || 'user',
                            createdAt: userData.createdAt,
                            lastActive: userData.lastActive,
                        });
                    } else {
                        console.log('Creating new user document...');
                        // Create user document if it doesn't exist
                        const newUser: Omit<User, 'uid'> = {
                            email: firebaseUser.email!,
                            displayName: firebaseUser.displayName || 'User',
                            photoURL: firebaseUser.photoURL || '',
                            role: isAdminEmail ? 'admin' : 'user',
                            createdAt: new Date() as any,
                            lastActive: new Date() as any,
                        };

                        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
                        setUser({ uid: firebaseUser.uid, ...newUser });
                    }
                    console.log('User state set successfully');
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    // Fallback to basic auth user if Firestore fails
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email!,
                        displayName: firebaseUser.displayName || 'User',
                        photoURL: firebaseUser.photoURL || '',
                        role: 'user', // Default to user if DB fails
                        createdAt: new Date() as any,
                        lastActive: new Date() as any,
                    });
                    console.log('Fallback user state set');
                }

                resetSessionTimer();
            } else {
                console.log('Clearing user state');
                setUser(null);
                clearTimers();
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
            clearTimers();
        };
    }, [resetSessionTimer, clearTimers]);

    // Reset timer on any user activity
    useEffect(() => {
        if (user) {
            const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
            events.forEach(event => {
                window.addEventListener(event, resetSessionTimer);
            });

            return () => {
                events.forEach(event => {
                    window.removeEventListener(event, resetSessionTimer);
                });
            };
        }
    }, [user, resetSessionTimer]);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string, displayName: string) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const isAdmin = email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

        const newUser: Omit<User, 'uid'> = {
            email,
            displayName,
            photoURL: '',
            role: isAdmin ? 'admin' : 'user',
            createdAt: new Date() as any,
            lastActive: new Date() as any,
        };

        await setDoc(doc(db, 'users', credential.user.uid), newUser);
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        const userDoc = await getDoc(doc(db, 'users', result.user.uid));

        if (!userDoc.exists()) {
            const isAdmin = result.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
            const newUser: Omit<User, 'uid'> = {
                email: result.user.email!,
                displayName: result.user.displayName || 'User',
                photoURL: result.user.photoURL || '',
                role: isAdmin ? 'admin' : 'user',
                createdAt: new Date() as any,
                lastActive: new Date() as any,
            };

            await setDoc(doc(db, 'users', result.user.uid), newUser);
        }
    };

    const signOut = async () => {
        clearTimers();
        await firebaseSignOut(auth);
        setUser(null);
        router.push('/');
    };

    const value = {
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetSessionTimer,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            {showWarning && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full animate-slide-down">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Session Timeout Warning</h3>
                        <p className="text-gray-600 mb-4">
                            Your session will expire in 2 minutes due to inactivity. Would you like to stay logged in?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={resetSessionTimer}
                                className="flex-1 bg-primary-950 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors"
                            >
                                Stay Logged In
                            </button>
                            <button
                                onClick={handleSessionTimeout}
                                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
