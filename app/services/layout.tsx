'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect admin users away from services page
        if (!loading && user?.role === 'admin') {
            router.push('/admin');
        }
    }, [user, loading, router]);

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-950"></div>
            </div>
        );
    }

    // Prevent admin from seeing services page
    if (user?.role === 'admin') {
        return null;
    }

    return <>{children}</>;
}
