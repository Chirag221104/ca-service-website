'use client';

import { useEffect, useState } from 'react';
import { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/lib/firestore';
import { FAQ } from '@/types';
import toast from 'react-hot-toast';

export default function FAQManagement() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ question: '', answer: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchFAQs();
    }, []);

    async function fetchFAQs() {
        try {
            const data = await getAllFAQs();
            setFaqs(data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            // Don't show toast here - it will show on every page load
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd() {
        if (!formData.question.trim() || !formData.answer.trim()) {
            toast.error('Please fill in both question and answer');
            return;
        }

        setSaving(true);
        try {
            await createFAQ(formData.question, formData.answer);
            toast.success('FAQ created successfully!');
            setFormData({ question: '', answer: '' });
            setIsAdding(false);
            await fetchFAQs();
        } catch (error) {
            console.error('Error creating FAQ:', error);
            toast.error('Failed to create FAQ. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    async function handleUpdate(id: string) {
        if (!formData.question.trim() || !formData.answer.trim()) {
            toast.error('Please fill in both question and answer');
            return;
        }

        setSaving(true);
        try {
            await updateFAQ(id, {
                question: formData.question,
                answer: formData.answer,
            });
            toast.success('FAQ updated successfully!');
            setEditingId(null);
            setFormData({ question: '', answer: '' });
            await fetchFAQs();
        } catch (error) {
            console.error('Error updating FAQ:', error);
            toast.error('Failed to update FAQ. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            await deleteFAQ(id);
            toast.success('FAQ deleted successfully!');
            await fetchFAQs();
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            toast.error('Failed to delete FAQ. Please try again.');
        }
    }

    function startEdit(faq: FAQ) {
        setEditingId(faq.id);
        setFormData({ question: faq.question, answer: faq.answer });
        setIsAdding(false);
    }

    function cancelEdit() {
        setEditingId(null);
        setFormData({ question: '', answer: '' });
        setIsAdding(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">FAQ Management</h2>
                    <p className="text-gray-600 mt-1">Manage frequently asked questions</p>
                </div>
                <button
                    onClick={() => {
                        setIsAdding(true);
                        setEditingId(null);
                        setFormData({ question: '', answer: '' });
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-primary-950 to-primary-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    + Add FAQ
                </button>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {isAdding ? 'Add New FAQ' : 'Edit FAQ'}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Question
                            </label>
                            <input
                                type="text"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                placeholder="Enter the question..."
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Answer
                            </label>
                            <textarea
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                placeholder="Enter the answer..."
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none resize-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => (isAdding ? handleAdd() : handleUpdate(editingId!))}
                                disabled={saving}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : (isAdding ? 'Add FAQ' : 'Save Changes')}
                            </button>
                            <button
                                onClick={cancelEdit}
                                disabled={saving}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FAQs List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    ))}
                </div>
            ) : faqs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="inline-block mb-4 p-4 bg-gray-100 rounded-full">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No FAQs Yet</h3>
                    <p className="text-gray-600 mb-6">Create your first FAQ to get started</p>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-3 bg-gradient-to-r from-primary-950 to-primary-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        + Add First FAQ
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-primary-200 transition-all"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => startEdit(faq)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
