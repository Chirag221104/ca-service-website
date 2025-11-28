import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: '--font-urbanist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CA Kajal Malde | Chartered Accountant Services",
  description: "Professional chartered accountant services by CA Kajal Malde. Expert financial advisory, tax consultation, audit services, and more.",
  keywords: "chartered accountant, CA services, tax consultation, financial advisory, audit, Kajal Malde",
  authors: [{ name: "CA Kajal Malde" }],
  openGraph: {
    title: "CA Kajal Malde | Chartered Accountant Services",
    description: "Professional chartered accountant services",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${urbanist.variable} font-sans antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-primary-950 text-white py-8">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm">© {new Date().getFullYear()} CA Kajal Malde. All rights reserved.</p>
              <p className="text-xs text-gray-400 mt-2">Professional Chartered Accountant Services</p>
            </div>
          </footer>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
