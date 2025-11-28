'use client';

import { useEffect, useState, useMemo } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getUserRequests } from '@/lib/firestore';
import { ServiceRequest, RequestStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import Link from 'next/link';

export default function UserDashboard() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | RequestStatus>('all');

    useEffect(() => {
        async function fetchRequests() {
            if (!user) return;

            try {
                const data = await getUserRequests(user.uid);
                setRequests(data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchRequests();
    }, [user]);

    const stats = useMemo(() => ({
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        inProgress: requests.filter(r => r.status === 'in_progress').length,
        resolved: requests.filter(r => r.status === 'resolved').length,
    }), [requests]);

    const filteredRequests = useMemo(() => {
        if (activeFilter === 'all') return requests;
        return requests.filter(r => r.status === activeFilter);
    }, [requests, activeFilter]);

    const statusConfig = {
        pending: {
            label: 'Pending',
            class: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        in_progress: {
            label: 'In Progress',
            class: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
        },
        resolved: {
            label: 'Resolved',
            class: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-16 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-300 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">
                            My Dashboard
                        </h1>
                        <p className="text-gray-200 text-lg">View and track all your service requests</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-primary-200 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 font-semibold">Total Requests</span>
                                <div className="p-3 bg-primary-100 rounded-xl">
                                    <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-100 hover:border-amber-300 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 font-semibold">Pending</span>
                                <div className="p-3 bg-amber-100 rounded-xl">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-amber-600">{stats.pending}</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 hover:border-blue-300 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 font-semibold">In Progress</span>
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-blue-600">{stats.inProgress}</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100 hover:border-green-300 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 font-semibold">Resolved</span>
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-green-600">{stats.resolved}</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${activeFilter === 'all'
                                    ? 'bg-gradient-to-r from-primary-950 to-primary-800 text-white shadow-lg shadow-primary-900/30'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                                }`}
                        >
                            All Requests
                        </button>
                        <button
                            onClick={() => setActiveFilter('pending')}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${activeFilter === 'pending'
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setActiveFilter('in_progress')}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${activeFilter === 'in_progress'
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                                }`}
                        >
                            In Progress
                        </button>
                        <button
                            onClick={() => setActiveFilter('resolved')}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${activeFilter === 'resolved'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                                }`}
                        >
                            Resolved
                        </button>
                    </div>

                    {/* Requests List */}
                    {loading ? (
                        <div className="grid gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="inline-block mb-4 p-4 bg-gray-100 rounded-full">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {activeFilter === 'all' ? 'No Requests Yet' : `No ${statusConfig[activeFilter as RequestStatus].label} Requests`}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {activeFilter === 'all'
                                    ? "You haven't requested any services yet"
                                    : `You don't have any ${statusConfig[activeFilter as RequestStatus].label.toLowerCase()} requests`}
                            </p>
                            {activeFilter === 'all' && (
                                <Link href="/services" className="btn-primary inline-block">
                                    Browse Services
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredRequests.map((request) => {
                                const config = statusConfig[request.status];
                                return (
                                    <div key={request.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-gray-100 hover:border-primary-200">
                                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <h3 className="text-2xl font-heading font-bold text-gray-900">
                                                        {request.serviceName}
                                                    </h3>
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${config.class}`}>
                                                        {config.icon}
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-4 leading-relaxed">{request.message}</p>
                                                <div className="space-y-2 text-sm text-gray-500">
                                                    <p className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <strong>Requested:</strong> {format(request.requestedAt.toDate(), 'PPP p')}
                                                    </p>
                                                    {request.estimatedTime && (
                                                        <p className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <strong>Estimated Time:</strong> {request.estimatedTime}
                                                        </p>
                                                    )}
                                                    {request.resolvedAt && (
                                                        <p className="flex items-center gap-2 text-green-600">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <strong>Resolved:</strong> {format(request.resolvedAt.toDate(), 'PPP p')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {request.adminNotes && (
                                                <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-4 lg:max-w-sm border-2 border-primary-100">
                                                    <p className="text-sm font-bold text-primary-950 mb-2 flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                        </svg>
                                                        Admin Notes:
                                                    </p>
                                                    <p className="text-sm text-gray-700">{request.adminNotes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
