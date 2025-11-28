'use client';

import { useEffect, useState } from 'react';
import { getAllFAQs } from '@/lib/firestore';
import { FAQ } from '@/types';

export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchFAQs() {
            try {
                const data = await getAllFAQs();
                setFaqs(data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFAQs();
    }, []);

    const filteredFAQs = searchTerm
        ? faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : faqs;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-300 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <span className="text-sm font-semibold text-gold-200">Get Answers</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-gray-200 leading-relaxed">
                            Find answers to common questions about our chartered accountant services
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-lg shadow-lg"
                        />
                        <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* FAQs List */}
                {loading ? (
                    <div className="max-w-4xl mx-auto space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredFAQs.length === 0 ? (
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="inline-block mb-4 p-4 bg-gray-100 rounded-full">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {searchTerm ? 'No FAQs Found' : 'No FAQs Available'}
                        </h3>
                        <p className="text-gray-600">
                            {searchTerm
                                ? 'Try adjusting your search term'
                                : 'FAQs will be added soon. Check back later!'}
                        </p>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-4">
                        {filteredFAQs.map((faq) => (
                            <div
                                key={faq.id}
                                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:border-primary-200 transition-all overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 pr-8 flex-1">
                                        {faq.question}
                                    </h3>
                                    <svg
                                        className={`w-6 h-6 text-primary-700 flex-shrink-0 transition-transform duration-300 ${expandedId === faq.id ? 'transform rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {expandedId === faq.id && (
                                    <div className="px-6 pb-5 pt-2 border-t border-gray-100">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Contact CTA */}
                <div className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-primary-950 to-primary-800 rounded-2xl shadow-2xl p-8 text-center text-white">
                    <h2 className="text-3xl font-heading font-bold mb-4">Still have questions?</h2>
                    <p className="text-gray-200 mb-6 text-lg">
                        Can't find what you're looking for? Feel free to contact us directly
                    </p>
                    <a
                        href="/services"
                        className="inline-block px-8 py-4 bg-white text-primary-950 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        Browse Our Services
                    </a>
                </div>
            </div>
        </div>
    );
}
