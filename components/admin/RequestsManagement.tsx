'use client';

import { ServiceRequest, RequestStatus } from '@/types';
import { useState, useMemo } from 'react';
import { updateRequestStatus } from '@/lib/firestore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface RequestsManagementProps {
    requests: ServiceRequest[];
    onUpdate: () => void;
}

export default function RequestsManagement({ requests, onUpdate }: RequestsManagementProps) {
    const [filter, setFilter] = useState<RequestStatus | 'all'>('all');
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [newStatus, setNewStatus] = useState<RequestStatus>('pending');
    const [adminNotes, setAdminNotes] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [loading, setLoading] = useState(false);

    const filteredRequests = useMemo(() => {
        return filter === 'all' ? requests : requests.filter(r => r.status === filter);
    }, [requests, filter]);

    const openModal = (request: ServiceRequest) => {
        setSelectedRequest(request);
        setNewStatus(request.status);
        setAdminNotes(request.adminNotes || '');
        setEstimatedTime(request.estimatedTime || '');
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setAdminNotes('');
        setEstimatedTime('');
    };

    const handleUpdate = async () => {
        if (!selectedRequest) return;

        setLoading(true);
        try {
            await updateRequestStatus(selectedRequest.id, newStatus, adminNotes, estimatedTime);
            toast.success('Request updated successfully!');
            closeModal();
            onUpdate();
        } catch (error) {
            console.error('Error updating request:', error);
            toast.error('Failed to update request');
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = {
        pending: { label: 'Pending', class: 'badge-pending' },
        in_progress: { label: 'In Progress', class: 'badge-progress' },
        resolved: { label: 'Resolved', class: 'badge-resolved' },
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'all' ? 'bg-primary-950 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    All ({requests.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    Pending ({requests.filter(r => r.status === 'pending').length})
                </button>
                <button
                    onClick={() => setFilter('in_progress')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    In Progress ({requests.filter(r => r.status === 'in_progress').length})
                </button>
                <button
                    onClick={() => setFilter('resolved')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'resolved' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    Resolved ({requests.filter(r => r.status === 'resolved').length})
                </button>
            </div>

            <div className="grid gap-4">
                {filteredRequests.length === 0 ? (
                    <div className="card text-center py-8 text-gray-500">
                        No requests found
                    </div>
                ) : (
                    filteredRequests.map((request) => {
                        const config = statusConfig[request.status];
                        return (
                            <div key={request.id} className="card">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {request.serviceName}
                                        </h3>
                                        <p className="text-sm text-gray-600">Requested by: {request.userName} ({request.userEmail})</p>
                                    </div>
                                    <span className={`badge ${config.class}`}>{config.label}</span>
                                </div>
                                <p className="text-gray-700 mb-2 text-sm">{request.message}</p>
                                <p className="text-xs text-gray-500 mb-3">
                                    Requested: {format(request.requestedAt.toDate(), 'PPP p')}
                                </p>
                                <button
                                    onClick={() => openModal(request)}
                                    className="btn-primary text-sm"
                                >
                                    Manage Request
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Update Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                            Manage Request
                        </h3>

                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600"><strong>Service:</strong> {selectedRequest.serviceName}</p>
                            <p className="text-sm text-gray-600"><strong>User:</strong> {selectedRequest.userName}</p>
                            <p className="text-sm text-gray-600"><strong>Email:</strong> {selectedRequest.userEmail}</p>
                            <p className="text-sm text-gray-600"><strong>Message:</strong> {selectedRequest.message}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value as RequestStatus)}
                                    className="input-field"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Admin Notes
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    className="input-field resize-none h-24"
                                    placeholder="Add notes visible to the user..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estimated Time (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={estimatedTime}
                                    onChange={(e) => setEstimatedTime(e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., 2-3 business days"
                                />
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
                                    onClick={handleUpdate}
                                    className="flex-1 btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Request'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
