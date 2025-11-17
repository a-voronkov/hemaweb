'use client';

import { useAuth } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
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
      <div className="container max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            View and manage your personal information
          </p>
        </div>

        {/* Profile Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              <Link href="/profile/edit">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  First Name
                </label>
                <p className="text-lg">{user.firstName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Name
                </label>
                <p className="text-lg">{user.lastName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </label>
                <p className="text-lg">{user.phoneNumber || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donor Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Donor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Blood Type
                </label>
                <p className="text-lg font-semibold text-primary">
                  {user.bloodType || 'Not Set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Verification Status
                </label>
                <div className="mt-1">
                  <Badge variant={isVerified ? 'default' : 'secondary'}>
                    {isVerified ? '✓ Verified Donor' : 'Unverified'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </label>
                <p className="text-lg">
                  {user.dateOfBirth 
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Gender
                </label>
                <p className="text-lg capitalize">
                  {user.gender?.toLowerCase() || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Address
              </label>
              <p className="text-lg">{user.address || 'Not provided'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email Verified
                </label>
                <div className="mt-1">
                  <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                    {user.emailVerified ? '✓ Verified' : 'Not Verified'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Member Since
                </label>
                <p className="text-lg">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

