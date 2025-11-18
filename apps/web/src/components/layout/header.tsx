'use client';

/**
 * Header Component
 * Mobile-first navigation header
 */

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">HemaWeb</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          {user ? (
            <>
              {['admin', 'super_admin', 'system_admin'].includes(user.role?.code || '') && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              {['staff', 'admin', 'super_admin'].includes(user.role?.code || '') && (
                <Link href="/staff/dashboard">
                  <Button variant="ghost" size="sm">
                    Staff
                  </Button>
                </Link>
              )}
              {user.role?.code === 'donor' && (
                <>
                  <Link href="/blood-drives">
                    <Button variant="ghost" size="sm">
                      Blood Drives
                    </Button>
                  </Link>
                  <Link href="/donations">
                    <Button variant="ghost" size="sm">
                      My Donations
                    </Button>
                  </Link>
                </>
              )}
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

