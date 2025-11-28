export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="gradient-bg text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                        About CA Kajal Malde
                    </h1>
                    <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                        Your trusted partner in financial success
                    </p>
                </div>
            </section>

            {/* About Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                        <h2 className="text-3xl font-heading font-bold text-primary-950 mb-4">
                            Professional Excellence
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            CA Kajal Malde is a qualified Chartered Accountant dedicated to providing comprehensive
                            financial services to individuals and businesses. With expertise in taxation, auditing,
                            financial planning, and business advisory, we help our clients navigate complex financial
                            landscapes with confidence.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Our commitment is to deliver personalized, professional services that meet the unique
                            needs of each client, ensuring accuracy, compliance, and financial optimization.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-primary-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
                            <p className="text-gray-600">
                                To provide exceptional chartered accountant services with integrity, professionalism,
                                and a client-first approach that drives financial success.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="w-12 h-12 bg-accent-teal/10 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h3>
                            <p className="text-gray-600">
                                To be the most trusted chartered accountant service provider, known for excellence,
                                reliability, and innovative financial solutions.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
                        <h2 className="text-2xl font-heading font-bold text-primary-950 mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Have questions or need our services? Feel free to reach out to us.
                        </p>
                        <div className="space-y-2 text-gray-600">
                            <p className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <strong>Email:</strong> cakajalmalde08@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
