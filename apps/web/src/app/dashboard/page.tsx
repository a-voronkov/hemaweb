'use client';

import { useAuth } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  const isVerified = user.role === 'VERIFIED_DONOR';

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user.firstName || user.email}!
          </h1>
          <p className="text-muted-foreground">
            {isVerified 
              ? 'Thank you for being a verified blood donor. Your contribution saves lives!'
              : 'Complete your verification to start donating blood and saving lives.'}
          </p>
        </div>

        {/* Verification Status */}
        {!isVerified && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Account Not Verified
              </CardTitle>
              <CardDescription>
                Visit a partner hospital to verify your eligibility and become a certified donor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/medical-centers">
                <Button>Find Nearby Medical Centers</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={isVerified ? 'default' : 'secondary'}>
                  {isVerified ? '✓ Verified' : 'Unverified'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Blood Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.bloodType || 'Not Set'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isVerified ? '0' : '-'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                Profile
              </CardTitle>
              <CardDescription>
                View and update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {isVerified && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🩸</span>
                    Blood Drives
                  </CardTitle>
                  <CardDescription>
                    Find nearby blood donation opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/blood-drives">
                    <Button variant="outline" className="w-full">
                      Browse Blood Drives
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Donation History
                  </CardTitle>
                  <CardDescription>
                    View your past donations and certificates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/donations">
                    <Button variant="outline" className="w-full">
                      View History
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

