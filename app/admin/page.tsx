'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getAllRequests, getAllServices } from '@/lib/firestore';
import { ServiceRequest, Service } from '@/types';
import AdminOverview from '@/components/admin/AdminOverview';
import ServiceManagement from '@/components/admin/ServiceManagement';
import RequestsManagement from '@/components/admin/RequestsManagement';
import FAQManagement from '@/components/admin/FAQManagement';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'requests' | 'faqs'>('overview');
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [requestsData, servicesData] = await Promise.all([
                getAllRequests(),
                getAllServices(),
            ]);
            setRequests(requestsData);
            setServices(servicesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            id: 'services',
            label: 'Services',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'requests',
            label: 'Requests',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            id: 'faqs',
            label: 'FAQs',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
    ];

    return (
        <ProtectedRoute requireAdmin>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
                {/* Hero Header */}
                <div className="bg-gradient-to-br from-gold-600 via-gold-500 to-amber-600 text-white py-12 shadow-lg">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gold-100 text-lg">Manage your CA services platform</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Tabs */}
                    <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-primary-950 to-primary-800 text-white shadow-lg shadow-primary-900/30'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {loading && activeTab !== 'faqs' ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-950"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'overview' && (
                                <AdminOverview requests={requests} services={services} />
                            )}
                            {activeTab === 'services' && (
                                <ServiceManagement services={services} onUpdate={fetchData} />
                            )}
                            {activeTab === 'requests' && (
                                <RequestsManagement requests={requests} onUpdate={fetchData} />
                            )}
                            {activeTab === 'faqs' && (
                                <FAQManagement />
                            )}
                        </>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
