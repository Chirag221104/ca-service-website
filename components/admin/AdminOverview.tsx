'use client';

import { Service, ServiceRequest } from '@/types';
import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface AdminOverviewProps {
    requests: ServiceRequest[];
    services: Service[];
}

export default function AdminOverview({ requests, services }: AdminOverviewProps) {
    const stats = useMemo(() => {
        const pending = requests.filter(r => r.status === 'pending').length;
        const inProgress = requests.filter(r => r.status === 'in_progress').length;
        const resolved = requests.filter(r => r.status === 'resolved').length;

        // Count requests by service
        const requestsByService: Record<string, number> = {};
        requests.forEach(r => {
            requestsByService[r.serviceName] = (requestsByService[r.serviceName] || 0) + 1;
        });

        return {
            total: requests.length,
            pending,
            inProgress,
            resolved,
            requestsByService,
        };
    }, [requests]);

    const statusChartData = {
        labels: ['Pending', 'In Progress', 'Resolved'],
        datasets: [
            {
                data: [stats.pending, stats.inProgress, stats.resolved],
                backgroundColor: ['#fbbf24', '#3b82f6', '#10b981'],
                borderColor: ['#f59e0b', '#2563eb', '#059669'],
                borderWidth: 1,
            },
        ],
    };

    const serviceChartData = {
        labels: Object.keys(stats.requestsByService),
        datasets: [
            {
                label: 'Requests',
                data: Object.values(stats.requestsByService),
                backgroundColor: '#1e3a8a',
                borderColor: '#1e3a8a',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card bg-gradient-to-br from-primary-950 to-primary-700 text-white">
                    <p className="text-sm opacity-90 mb-1">Total Requests</p>
                    <p className="text-4xl font-bold">{stats.total}</p>
                </div>
                <div className="card bg-gradient-to-br from-yellow-600 to-yellow-500 text-white">
                    <p className="text-sm opacity-90 mb-1">Pending</p>
                    <p className="text-4xl font-bold">{stats.pending}</p>
                </div>
                <div className="card bg-gradient-to-br from-blue-600 to-blue-500 text-white">
                    <p className="text-sm opacity-90 mb-1">In Progress</p>
                    <p className="text-4xl font-bold">{stats.inProgress}</p>
                </div>
                <div className="card bg-gradient-to-br from-green-600 to-green-500 text-white">
                    <p className="text-sm opacity-90 mb-1">Resolved</p>
                    <p className="text-4xl font-bold">{stats.resolved}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Request Status Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                        <Pie data={statusChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Most Requested Services</h3>
                    <div className="h-64">
                        <Bar
                            data={serviceChartData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: { stepSize: 1 },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Info */}
            <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Total Services</p>
                        <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Available Services</p>
                        <p className="text-2xl font-bold text-green-600">
                            {services.filter(s => s.status === 'available').length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
