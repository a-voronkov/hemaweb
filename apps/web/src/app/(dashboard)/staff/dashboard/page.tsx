'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Calendar, Users, Activity } from 'lucide-react';
import Link from 'next/link';

interface StaffDashboardData {
  center: {
    id: string;
    name: string;
    organization: string;
  };
  stats: {
    totalDonations: number;
    recentDonations: number;
    totalBloodDrives: number;
    upcomingBloodDrives: number;
    activeBloodDrives: number;
    uniqueDonors: number;
  };
  bloodTypeDistribution: Array<{
    bloodType: string;
    count: number;
  }>;
}

export default function StaffDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StaffDashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role?.code !== 'donor') {
      loadDashboard();
    } else if (user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const loadDashboard = async () => {
    try {
      const res = await apiClient.get<StaffDashboardData>('/medical-centers/staff/dashboard/stats');
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <MainLayout>
        <div className="container max-w-7xl px-4 py-8">
          <p>Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout>
        <div className="container max-w-7xl px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive">{error || 'Failed to load dashboard'}</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            {data.center.name} - {data.center.organization}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalDonations}</div>
              <p className="text-xs text-muted-foreground">
                {data.stats.recentDonations} in last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Blood Drives</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalBloodDrives}</div>
              <p className="text-xs text-muted-foreground">
                {data.stats.upcomingBloodDrives} upcoming, {data.stats.activeBloodDrives} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unique Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.uniqueDonors}</div>
              <p className="text-xs text-muted-foreground">
                Donors who donated at this center
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg per Month</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((data.stats.recentDonations / 30) * 30)}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blood Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Blood Type Distribution</CardTitle>
              <CardDescription>Donations by blood type at your center</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.bloodTypeDistribution.map((item) => (
                  <div key={item.bloodType} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{item.bloodType}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{
                            width: `${(item.count / data.stats.totalDonations) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for staff members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/staff/blood-drives/create">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-1">Create Blood Drive</h3>
                  <p className="text-sm text-muted-foreground">
                    Schedule a new blood drive event
                  </p>
                </div>
              </Link>

              <Link href="/staff/donors">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-1">Verify Donors</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify and manage donor profiles
                  </p>
                </div>
              </Link>

              <Link href="/staff/donations/record">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-1">Record Donation</h3>
                  <p className="text-sm text-muted-foreground">
                    Record a new blood donation
                  </p>
                </div>
              </Link>

              <Link href="/staff/blood-drives">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-1">Manage Blood Drives</h3>
                  <p className="text-sm text-muted-foreground">
                    View and manage your blood drives
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

