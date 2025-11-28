'use client';

import { useEffect, useState } from 'react';
import { getAllServices } from '@/lib/firestore';
import { Service } from '@/types';
import ServiceCard from '@/components/services/ServiceCard';

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'available' | 'starting_soon' | 'not_available'>('all');

    useEffect(() => {
        async function fetchServices() {
            try {
                const servicesData = await getAllServices();
                setServices(servicesData);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
    }, []);

    const filteredServices = filter === 'all'
        ? services
        : services.filter(s => s.status === filter);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-20 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-300 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <span className="text-sm font-semibold text-gold-200">Professional CA Services</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                            Our Services
                        </h1>
                        <p className="text-xl text-gray-200 leading-relaxed">
                            Professional chartered accountant services tailored to meet your unique business needs with expertise and dedication
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${filter === 'all'
                                ? 'bg-gradient-to-r from-primary-950 to-primary-800 text-white shadow-primary-900/30'
                                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-gray-200'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            All Services
                        </span>
                    </button>
                    <button
                        onClick={() => setFilter('available')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${filter === 'available'
                                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-green-500/30'
                                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-gray-200'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Available
                        </span>
                    </button>
                    <button
                        onClick={() => setFilter('starting_soon')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${filter === 'starting_soon'
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-amber-500/30'
                                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-gray-200'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Starting Soon
                        </span>
                    </button>
                    <button
                        onClick={() => setFilter('not_available')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${filter === 'not_available'
                                ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white shadow-gray-500/30'
                                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-gray-200'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            Not Available
                        </span>
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-block mb-4 p-4 bg-gray-100 rounded-full">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-xl text-gray-500 mb-2">No services found</p>
                        <p className="text-gray-400">Try adjusting your filter to see more services.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
