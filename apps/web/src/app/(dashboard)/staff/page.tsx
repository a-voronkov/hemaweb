'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function StaffDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<any>(null);
  const [stats, setStats] = useState({
    todayDonations: 0,
    weekDonations: 0,
    monthDonations: 0,
    verifiedDonors: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      // Check if user is staff/admin
      const allowedRoles = ['staff', 'admin', 'super_admin'];
      if (!user.role || !allowedRoles.includes(user.role.code)) {
        router.push('/profile');
        return;
      }

      loadDashboard();
    }
  }, [user, authLoading, router]);

  const loadDashboard = async () => {
    try {
      const [centerRes, donationsRes, donorsRes] = await Promise.all([
        apiClient.get('/medical-centers/staff/my-center'),
        apiClient.get('/medical-centers/staff/donations'),
        apiClient.get('/medical-centers/staff/donors'),
      ]);

      setCenter(centerRes.data);

      // Calculate stats
      const donations = donationsRes.data || [];
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      setStats({
        todayDonations: donations.filter((d: any) => new Date(d.donatedAt) >= today).length,
        weekDonations: donations.filter((d: any) => new Date(d.donatedAt) >= weekAgo).length,
        monthDonations: donations.filter((d: any) => new Date(d.donatedAt) >= monthAgo).length,
        verifiedDonors: (donorsRes.data || []).length,
      });
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          {center && (
            <p className="text-muted-foreground mt-2">
              {center.name} - {center.city}
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Today</CardDescription>
              <CardTitle className="text-3xl">{stats.todayDonations}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Donations today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-3xl">{stats.weekDonations}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Donations this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-3xl">{stats.monthDonations}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Donations this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Verified Donors</CardDescription>
              <CardTitle className="text-3xl">{stats.verifiedDonors}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Total verified</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/staff/verify-donor">
                <Button className="w-full" variant="default">
                  Verify Donor
                </Button>
              </Link>
              <Link href="/staff/record-donation">
                <Button className="w-full" variant="default">
                  Record Donation
                </Button>
              </Link>
              <Link href="/staff/donors">
                <Button className="w-full" variant="outline">
                  View Donors
                </Button>
              </Link>
              <Link href="/staff/donations">
                <Button className="w-full" variant="outline">
                  View Donations
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical Center Info</CardTitle>
              <CardDescription>Your center details</CardDescription>
            </CardHeader>
            <CardContent>
              {center ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {center.name}
                  </div>
                  <div>
                    <span className="font-medium">Code:</span> {center.code}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span> {center.address}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {center.phone}
                  </div>
                  <div>
                    <span className="font-medium">Hours:</span> {center.operatingHours}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No center information available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

