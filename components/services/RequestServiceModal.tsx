'use client';

import { Service } from '@/types';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createServiceRequest } from '@/lib/firestore';
import toast from 'react-hot-toast';

interface RequestServiceModalProps {
    service: Service;
    onClose: () => void;
}

export default function RequestServiceModal({ service, onClose }: RequestServiceModalProps) {
    const { user } = useAuth();
    const [customMessage, setCustomMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);

        try {
            const defaultMessage = `User ${user.displayName} has requested the service: ${service.title}`;
            const message = customMessage.trim() || defaultMessage;

            // Create service request
            await createServiceRequest(
                user.uid,
                user.email,
                user.displayName,
                service.id,
                service.title,
                message
            );

            // Notification is now handled by Cloud Functions trigger on document creation


            toast.success('Service request submitted successfully!');
            onClose();
        } catch (error) {
            console.error('Error submitting request:', error);
            toast.error('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-heading font-bold text-gray-900">Request Service</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4 p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-bold text-primary-950 mb-1">{service.title}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Additional Message (Optional)
                    </label>
                    <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        className="input-field resize-none h-24"
                        placeholder="Add any specific requirements or questions..."
                    />

                    <p className="text-xs text-gray-500 mt-2 mb-4">
                        You will receive a confirmation email and our team will get back to you soon.
                    </p>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Submitting...
                                </span>
                            ) : (
                                'Submit Request'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
