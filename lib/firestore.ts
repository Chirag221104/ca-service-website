import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Service, ServiceRequest, UserRole, ServiceStatus, RequestStatus, FAQ, Testimonial } from '@/types';

// Users Collection
export const usersCollection = collection(db, 'users');

export async function getUserData(uid: string): Promise<User | null> {
    const userDoc = await getDoc(doc(usersCollection, uid));
    if (userDoc.exists()) {
        return { uid, ...userDoc.data() } as User;
    }
    return null;
}

export async function createUser(uid: string, email: string, displayName: string, photoURL?: string) {
    const userData: Omit<User, 'uid'> = {
        email,
        displayName,
        photoURL: photoURL || '',
        role: email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? 'admin' : 'user',
        createdAt: Timestamp.now(),
        lastActive: Timestamp.now(),
    };
    await updateDoc(doc(usersCollection, uid), userData as any);
}

export async function updateUserActivity(uid: string) {
    await updateDoc(doc(usersCollection, uid), {
        lastActive: Timestamp.now(),
    });
}

// Services Collection
export const servicesCollection = collection(db, 'services');

export async function getAllServices(): Promise<Service[]> {
    const q = query(servicesCollection, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
}

export async function createService(title: string, description: string, status: ServiceStatus = 'available') {
    const serviceData = {
        title,
        description,
        status,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        order: 0,
    };
    return await addDoc(servicesCollection, serviceData);
}

export async function updateService(serviceId: string, updates: Partial<Service>) {
    await updateDoc(doc(servicesCollection, serviceId), {
        ...updates,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteService(serviceId: string) {
    await deleteDoc(doc(servicesCollection, serviceId));
}

// Service Requests Collection
export const requestsCollection = collection(db, 'serviceRequests');

export async function createServiceRequest(
    userId: string,
    userEmail: string,
    userName: string,
    serviceId: string,
    serviceName: string,
    message: string
): Promise<string> {
    const requestData: Omit<ServiceRequest, 'id'> = {
        userId,
        userEmail,
        userName,
        serviceId,
        serviceName,
        message,
        status: 'pending',
        requestedAt: Timestamp.now(),
    };
    const docRef = await addDoc(requestsCollection, requestData);
    return docRef.id;
}

export async function getUserRequests(userId: string): Promise<ServiceRequest[]> {
    const q = query(requestsCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceRequest));
    // Sort client-side to avoid needing a composite index
    return requests.sort((a, b) => b.requestedAt.toMillis() - a.requestedAt.toMillis());
}

export async function getAllRequests(): Promise<ServiceRequest[]> {
    const q = query(requestsCollection, orderBy('requestedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceRequest));
}

export async function updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    adminNotes?: string,
    estimatedTime?: string
) {
    const updates: any = {
        status,
        ...(adminNotes && { adminNotes }),
        ...(estimatedTime && { estimatedTime }),
    };

    if (status === 'resolved') {
        updates.resolvedAt = Timestamp.now();
    }

    await updateDoc(doc(requestsCollection, requestId), updates);
}

// FAQs Collection
export const faqsCollection = collection(db, 'faqs');

export async function getAllFAQs(): Promise<FAQ[]> {
    const q = query(faqsCollection, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ));
}

export async function createFAQ(question: string, answer: string) {
    const faqData = {
        question,
        answer,
        order: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };
    return await addDoc(faqsCollection, faqData);
}

export async function updateFAQ(faqId: string, updates: Partial<FAQ>) {
    await updateDoc(doc(faqsCollection, faqId), {
        ...updates,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteFAQ(faqId: string) {
    await deleteDoc(doc(faqsCollection, faqId));
}

// Testimonials Collection
export const testimonialsCollection = collection(db, 'testimonials');

export async function getAllTestimonials(): Promise<Testimonial[]> {
    const q = query(testimonialsCollection, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
}

export async function getVisibleTestimonials(): Promise<Testimonial[]> {
    const q = query(testimonialsCollection, where('isVisible', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
}

export async function createTestimonial(clientName: string, message: string, rating: number, clientRole?: string) {
    const testimonialData = {
        clientName,
        clientRole: clientRole || '',
        message,
        rating,
        order: 0,
        isVisible: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };
    return await addDoc(testimonialsCollection, testimonialData);
}

export async function updateTestimonial(testimonialId: string, updates: Partial<Testimonial>) {
    await updateDoc(doc(testimonialsCollection, testimonialId), {
        ...updates,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteTestimonial(testimonialId: string) {
    await deleteDoc(doc(testimonialsCollection, testimonialId));
}

// User Management
export async function getAllUsers(): Promise<User[]> {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
}

export async function getUserStats(uid: string) {
    const requestsQuery = query(requestsCollection, where('userId', '==', uid));
    const snapshot = await getDocs(requestsQuery);
    const requests = snapshot.docs.map(doc => doc.data() as ServiceRequest);

    return {
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        inProgressRequests: requests.filter(r => r.status === 'in_progress').length,
        resolvedRequests: requests.filter(r => r.status === 'resolved').length,
    };
}
