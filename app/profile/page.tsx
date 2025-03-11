"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, Calendar, Shield, Key, LogOut, RefreshCw } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser, signOut } = useAuth();
  const { toast } = useToast();
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    setIsResendingVerification(true);
    try {
      const { error } = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      }).then(res => res.json());

      if (error) throw new Error(error);
      
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox for the verification link.',
      });
    } catch (error) {
      console.error('Error resending verification:', error);
      toast({
        title: 'Error',
        description: 'Failed to resend verification email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-full">
            <p>Please sign in to view your profile.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">User Profile</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </span>
                <span className="font-medium">{user.email}</span>
                {user.email_confirmed_at ? (
                  <Badge className="w-fit bg-green-100 text-green-800 mt-1">
                    Verified
                  </Badge>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="w-fit bg-yellow-100 text-yellow-800">
                      Not Verified
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleResendVerification}
                      disabled={isResendingVerification}
                    >
                      {isResendingVerification ? 'Sending...' : 'Resend Verification'}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Key className="h-4 w-4" /> User ID
                </span>
                <span className="font-medium font-mono text-sm">{user.id}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Created At
                  </span>
                  <span className="font-medium">
                    {new Date(user.created_at || '').toLocaleString()}
                  </span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Last Sign In
                  </span>
                  <span className="font-medium">
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleString() 
                      : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Authentication Method
                </span>
                <div className="flex flex-wrap gap-2">
                  {user.app_metadata?.provider ? (
                    <Badge variant="outline">
                      {user.app_metadata.provider}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Email</Badge>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={refreshUser} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Profile
              </Button>
            </CardFooter>
          </Card>

          {/* Logout Section */}
          <Card className="mb-8 border-red-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <LogOut className="h-5 w-5" />
                Session Management
              </CardTitle>
              <CardDescription>Manage your current session</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Logging out will end your current session and redirect you to the login page.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? 'Logging out...' : 'Log Out'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 