'use client';

import { Service, ServiceStatus } from '@/types';
import { useState } from 'react';
import { createService, updateService, deleteService } from '@/lib/firestore';
import toast from 'react-hot-toast';

interface ServiceManagementProps {
    services: Service[];
    onUpdate: () => void;
}

export default function ServiceManagement({ services, onUpdate }: ServiceManagementProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<ServiceStatus>('available');
    const [loading, setLoading] = useState(false);

    const openModal = (service?: Service) => {
        if (service) {
            setEditingService(service);
            setTitle(service.title);
            setDescription(service.description);
            setStatus(service.status);
        } else {
            setEditingService(null);
            setTitle('');
            setDescription('');
            setStatus('available');
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingService(null);
        setTitle('');
        setDescription('');
        setStatus('available');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingService) {
                await updateService(editingService.id, { title, description, status });
                toast.success('Service updated successfully!');
            } else {
                await createService(title, description, status);
                toast.success('Service created successfully!');
            }
            closeModal();
            onUpdate();
        } catch (error) {
            console.error('Error saving service:', error);
            toast.error('Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (serviceId: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            await deleteService(serviceId);
            toast.success('Service deleted successfully!');
            onUpdate();
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Failed to delete service');
        }
    };

    const statusOptions: { value: ServiceStatus; label: string; class: string }[] = [
        { value: 'available', label: 'Available', class: 'badge-available' },
        { value: 'starting_soon', label: 'Starting Soon', class: 'badge-soon' },
        { value: 'not_available', label: 'Not Available', class: 'badge-unavailable' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
                <button onClick={() => openModal()} className="btn-primary">
                    + Add New Service
                </button>
            </div>

            <div className="grid gap-4">
                {services.map((service) => {
                    const config = statusOptions.find(opt => opt.value === service.status)!;
                    return (
                        <div key={service.id} className="card flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                                    <span className={`badge ${config.class} text-xs`}>{config.label}</span>
                                </div>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openModal(service)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                            {editingService ? 'Edit Service' : 'Add New Service'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Service Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Tax Filing Services"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="input-field resize-none h-24"
                                    placeholder="Brief description of the service..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as ServiceStatus)}
                                    className="input-field"
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
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
                                    {loading ? 'Saving...' : (editingService ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
