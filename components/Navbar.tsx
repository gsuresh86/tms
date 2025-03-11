"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ticket, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Ticket className="h-6 w-6" />
          <span>Ticket Management System</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/dashboard" prefetch={true}>
                <Button variant={pathname === '/dashboard' ? 'default' : 'ghost'} className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              
              <Link href="/tickets" prefetch={true}>
                <Button variant={pathname === '/tickets' ? 'default' : 'ghost'} className="gap-2">
                  <Ticket className="h-4 w-4" />
                  Tickets
                </Button>
              </Link>
              
              {/* User info display in top bar */}
              <Link href="/profile" className="flex items-center gap-2 border rounded-full px-3 py-1 bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium truncate max-w-[150px]">
                  {user.email}
                </span>
                {user.email_confirmed_at && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                    Verified
                  </Badge>
                )}
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="text-sm">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm">
                    User ID: {user.id.substring(0, 8)}...
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm">
                    Last Sign In: {new Date(user.last_sign_in_at || '').toLocaleString() || 'N/A'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 