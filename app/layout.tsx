import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ticket Management System',
  description: 'A modern ticket management system built with Next.js and Supabase',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
} 