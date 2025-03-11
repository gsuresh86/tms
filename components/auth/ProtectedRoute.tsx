"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Skip redirection for auth pages
    if (pathname.startsWith('/auth/')) {
      return;
    }
    
    if (!isLoading && !user && pathname !== '/') {
      router.push('/auth/signin');
    }
  }, [user, isLoading, router, pathname]);

  // Handle redirection for authenticated users on auth pages
  useEffect(() => {
    if (!isLoading && user && pathname.startsWith('/auth/')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router, pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render children without conditional redirects in the render phase
  return <>{children}</>;
} 