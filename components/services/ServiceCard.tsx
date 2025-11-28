'use client';

import { Service } from '@/types';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import RequestServiceModal from './RequestServiceModal';

interface ServiceCardProps {
    service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    const statusConfig = {
        available: {
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            label: 'Available',
            class: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30',
            cardAccent: 'from-green-50 to-emerald-50',
            borderColor: 'border-green-200',
        },
        starting_soon: {
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            label: 'Starting Soon',
            class: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30',
            cardAccent: 'from-amber-50 to-yellow-50',
            borderColor: 'border-amber-200',
        },
        not_available: {
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
            ),
            label: 'Not Available',
            class: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30',
            cardAccent: 'from-gray-50 to-gray-100',
            borderColor: 'border-gray-200',
        },
    };

    const config = statusConfig[service.status];
    const isAvailable = service.status === 'available';

    const handleRequestClick = () => {
        if (!user) {
            router.push('/login?redirect=/services');
        } else {
            setShowModal(true);
        }
    };

    return (
        <>
            <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${config.borderColor} hover:border-primary-300 hover:-translate-y-1`}>
                {/* Gradient accent bar on top */}
                <div className={`h-2 bg-gradient-to-r ${config.cardAccent}`}></div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-heading font-bold text-gray-900 group-hover:text-primary-950 transition-colors flex-1">
                            {service.title}
                        </h3>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${config.class}`}>
                            {config.icon}
                            {config.label}
                        </span>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed min-h-[3rem]">
                        {service.description}
                    </p>

                    <button
                        onClick={handleRequestClick}
                        disabled={!isAvailable}
                        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform ${isAvailable
                                ? 'bg-gradient-to-r from-primary-950 to-primary-800 text-white hover:from-primary-900 hover:to-primary-700 hover:shadow-xl hover:scale-105 shadow-lg shadow-primary-900/30'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isAvailable ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                                Request Service
                            </span>
                        ) : (
                            'Not Available'
                        )}
                    </button>
                </div>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {showModal && (
                <RequestServiceModal
                    service={service}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
