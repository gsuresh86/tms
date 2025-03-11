"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthForm } from '@/components/ui/auth/AuthForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Ticket className="h-12 w-12 text-primary" />
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm mode="signup" onSuccess={handleSuccess} />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 