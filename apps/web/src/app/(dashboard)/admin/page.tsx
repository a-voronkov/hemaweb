'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Users, Heart, Calendar, Building2, UserCheck, Activity } from 'lucide-react';

interface DashboardStats {
  overview: {
    totalDonors: number;
    verifiedDonors: number;
    totalDonations: number;
    recentDonations: number;
    totalBloodDrives: number;
    upcomingBloodDrives: number;
    activeBloodDrives: number;
    totalMedicalCenters: number;
    totalStaff: number;
  };
  bloodTypeDistribution: Array<{
    bloodType: string;
    count: number;
  }>;
  donationsByMonth: Array<{
    month: string;
    count: number;
    volume: number;
  }>;
}

interface RecentActivity {
  id: string;
  type: string;
  date: string;
  donor: {
    name: string;
    email: string;
  };
  bloodType: string;
  volume: number;
  medicalCenter: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    // Check if user is admin
    if (user && !['admin', 'super_admin', 'system_admin'].includes(user.role?.code || '')) {
      router.push('/');
      return;
    }

    if (user) {
      loadDashboard();
    }
  }, [user, authLoading, router]);

  const loadDashboard = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        apiClient.get<DashboardStats>('/admin/dashboard/stats'),
        apiClient.get<RecentActivity[]>('/admin/dashboard/activity?limit=10'),
      ]);

      setStats(statsRes);
      setActivity(activityRes);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (error || !stats) {
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of system statistics and activity</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalDonors}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overview.verifiedDonors} verified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalDonations}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overview.recentDonations} in last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Blood Drives</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalBloodDrives}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overview.upcomingBloodDrives} upcoming, {stats.overview.activeBloodDrives} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Medical Centers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalMedicalCenters}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overview.totalStaff} staff members
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Blood Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Blood Type Distribution</CardTitle>
              <CardDescription>Registered donors by blood type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.bloodTypeDistribution.map((item) => (
                  <div key={item.bloodType} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{item.bloodType}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{
                            width: `${(item.count / stats.overview.totalDonors) * 100}%`,
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

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest donations in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                ) : (
                  activity.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{item.donor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Donated {item.volume}ml of {item.bloodType} at {item.medicalCenter}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donations by Month */}
        <Card>
          <CardHeader>
            <CardTitle>Donations Trend</CardTitle>
            <CardDescription>Donation volume over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.donationsByMonth.map((item) => (
                <div key={item.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {item.count} donations
                    </span>
                    <span className="text-sm font-medium">{item.volume.toLocaleString()} ml</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

