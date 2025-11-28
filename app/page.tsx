'use client';

import { useEffect, useState } from 'react';
import { getAllServices } from '@/lib/firestore';
import { Service } from '@/types';
import ServiceCard from '@/components/services/ServiceCard';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchServices() {
      try {
        const servicesData = await getAllServices();
        setServices(servicesData.slice(0, 6)); // Show only first 6 on homepage
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 animate-fade-in">
            Welcome to CA Kajal Malde
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto animate-slide-up">
            Professional Chartered Accountant services tailored to your financial needs.
            Expert guidance in taxation, auditing, financial planning, and business advisory.
          </p>
          {!isAdmin && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link href="/services" className="btn-primary bg-white text-primary-950 hover:bg-gray-100">
                Explore Services
              </Link>
              <Link href="/about" className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 border-2 border-white text-white hover:bg-white hover:text-primary-950">
                Learn More
              </Link>
            </div>
          )}
          {isAdmin && (
            <Link href="/admin" className="btn-primary bg-white text-primary-950 hover:bg-gray-100">
              Go to Admin Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Services Section - Hidden for Admin */}
      {!isAdmin && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-950 mb-4">
                Our Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive chartered accountant services to help you achieve your financial goals
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p className="text-lg">No services available at the moment.</p>
                <p className="text-sm mt-2">Please check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/services" className="btn-primary">
                View All Services
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-950 mb-12 text-center">
            Why Choose CA Kajal Malde?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Professional and certified CA with years of experience</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Timely Service</h3>
              <p className="text-gray-600">Quick response and efficient service delivery</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Client-Focused</h3>
              <p className="text-gray-600">Tailored solutions for your specific needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Hidden for Admin */}
      {!isAdmin && (
        <section className="gradient-bg text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
              Request a service today and let us help you with your financial needs
            </p>
            <Link href="/services" className="btn-primary bg-white text-primary-950 hover:bg-gray-100">
              Request a Service
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
