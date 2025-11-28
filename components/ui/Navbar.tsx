'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src="/logo.png"
                                alt="CA Kajal Malde"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-heading font-bold text-xl text-primary-950 hidden sm:block group-hover:text-primary-800 transition-colors">
                            CA Kajal Malde
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/"
                                className={`text-sm font-semibold tracking-wide transition-colors ${isActive('/') ? 'text-primary-950' : 'text-gray-500 hover:text-primary-950'}`}
                            >
                                HOME
                            </Link>
                            {/* Hide Services link for admin users */}
                            {user?.role !== 'admin' && (
                                <Link
                                    href="/services"
                                    className={`text-sm font-semibold tracking-wide transition-colors ${isActive('/services') ? 'text-primary-950' : 'text-gray-500 hover:text-primary-950'}`}
                                >
                                    SERVICES
                                </Link>
                            )}
                            <Link
                                href="/about"
                                className={`text-sm font-semibold tracking-wide transition-colors ${isActive('/about') ? 'text-primary-950' : 'text-gray-500 hover:text-primary-950'}`}
                            >
                                ABOUT
                            </Link>
                            {/* Hide FAQ link for admin users - they manage FAQs from dashboard */}
                            {user?.role !== 'admin' && (
                                <Link
                                    href="/faq"
                                    className={`text-sm font-semibold tracking-wide transition-colors ${isActive('/faq') ? 'text-primary-950' : 'text-gray-500 hover:text-primary-950'}`}
                                >
                                    FAQ
                                </Link>
                            )}
                        </div>

                        <div className="h-6 w-px bg-gray-200"></div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.role === 'admin' ? (
                                    <Link href="/admin" className="px-4 py-2 bg-gold-50 text-gold-700 rounded-lg text-sm font-semibold hover:bg-gold-100 transition-colors border border-gold-200">
                                        Admin Dashboard
                                    </Link>
                                ) : (
                                    <Link href="/dashboard" className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-semibold hover:bg-primary-100 transition-colors border border-primary-100">
                                        My Dashboard
                                    </Link>
                                )}

                                <div className="flex items-center gap-3 pl-2">
                                    <div className="text-right hidden lg:block">
                                        <p className="text-sm font-bold text-gray-900 leading-none">{user.displayName}</p>
                                        <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
                                    </div>
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                                        {user.photoURL ? (
                                            <Image
                                                src={user.photoURL}
                                                alt={user.displayName}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                {user.displayName?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={signOut}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Logout"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-primary-950 transition-colors">
                                    Log In
                                </Link>
                                <Link href="/signup" className="btn-primary text-sm shadow-lg shadow-primary-900/20">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down bg-white absolute left-0 right-0 px-4 shadow-lg">
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-600 hover:text-primary-950 font-medium px-4 py-3 rounded-lg hover:bg-gray-50"
                            >
                                Home
                            </Link>
                            {/* Hide Services link for admin users */}
                            {user?.role !== 'admin' && (
                                <Link
                                    href="/services"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-600 hover:text-primary-950 font-medium px-4 py-3 rounded-lg hover:bg-gray-50"
                                >
                                    Services
                                </Link>
                            )}
                            <Link
                                href="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-600 hover:text-primary-950 font-medium px-4 py-3 rounded-lg hover:bg-gray-50"
                            >
                                About
                            </Link>
                            {/* Hide FAQ link for admin users - they manage FAQs from dashboard */}
                            {user?.role !== 'admin' && (
                                <Link
                                    href="/faq"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-600 hover:text-primary-950 font-medium px-4 py-3 rounded-lg hover:bg-gray-50"
                                >
                                    FAQ
                                </Link>
                            )}

                            <div className="h-px bg-gray-100 my-2"></div>

                            {user ? (
                                <>
                                    <div className="px-4 py-2 flex items-center gap-3 mb-2">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                            {user.photoURL ? (
                                                <Image
                                                    src={user.photoURL}
                                                    alt={user.displayName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                    {user.displayName?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.displayName}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                    </div>

                                    {user.role === 'admin' ? (
                                        <Link
                                            href="/admin"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-gold-700 font-medium px-4 py-3 rounded-lg bg-gold-50 mb-2"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-primary-700 font-medium px-4 py-3 rounded-lg bg-primary-50 mb-2"
                                        >
                                            My Dashboard
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => {
                                            signOut();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="text-red-600 hover:text-red-700 font-medium w-full text-left px-4 py-3 rounded-lg hover:bg-red-50"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 mt-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-center text-gray-600 font-medium px-4 py-3 rounded-lg hover:bg-gray-50"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="btn-primary text-center justify-center"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
