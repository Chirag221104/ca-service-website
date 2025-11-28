import { Timestamp } from 'firebase/firestore';

export type UserRole = 'user' | 'admin';

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: UserRole;
    createdAt: Timestamp;
    lastActive: Timestamp;
}

export type ServiceStatus = 'available' | 'starting_soon' | 'not_available';

export interface Service {
    id: string;
    title: string;
    description: string;
    status: ServiceStatus;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    order: number;
}

export type RequestStatus = 'pending' | 'in_progress' | 'resolved';

export interface ServiceRequest {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    serviceId: string;
    serviceName: string;
    message: string;
    status: RequestStatus;
    requestedAt: Timestamp;
    resolvedAt?: Timestamp;
    adminNotes?: string;
    estimatedTime?: string;
}

export interface AnalyticsData {
    date: string;
    totalRequests: number;
    requestsByService: Record<string, number>;
    newUsers: number;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    order: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Testimonial {
    id: string;
    clientName: string;
    clientRole?: string;
    message: string;
    rating: number; // 1-5
    order: number;
    isVisible: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
