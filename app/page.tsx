"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { ArrowRight, CheckCircle, Clock, Ticket } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Streamline Your Support Process
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Efficiently manage support tickets, track issues, and provide timely resolutions to your customers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href={user ? "/dashboard" : "/auth/signin"}>
                    <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                      {user ? "Go to Dashboard" : "Get Started"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Ticket className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Ticket Management</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Create, update, and track tickets in one place.
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Real-time Updates</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Get instant updates on ticket status changes.
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Resolution Tracking</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Track resolution times and improve customer satisfaction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © {new Date().getFullYear()} Ticket Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 