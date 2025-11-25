'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Users, Activity, Droplet, Calendar, TrendingUp } from 'lucide-react';

interface GlobalStats {
  overview: {
    totalOrganizations: number;
    activeOrganizations: number;
    totalMedicalCenters: number;
    activeMedicalCenters: number;
    totalStaff: number;
    activeStaff: number;
    totalDonors: number;
    verifiedDonors: number;
    totalDonations: number;
    totalBloodDrives: number;
  };
  topOrganizations: Array<{
    id: string;
    name: string;
    isActive: boolean;
    _count: {
      medicalCenters: number;
      staff: number;
    };
  }>;
}

export default function SystemAdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role?.code !== 'system_admin') {
        router.push('/dashboard');
      } else {
        loadStats();
      }
    }
  }, [user, authLoading, router]);

  const loadStats = async () => {
    try {
      const res = await apiClient.get<GlobalStats>('/admin/dashboard/global-stats');
      setStats(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="container max-w-7xl px-4 py-8">
          <p>Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container max-w-7xl px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Organizations',
      value: stats.overview.totalOrganizations,
      subtitle: `${stats.overview.activeOrganizations} active`,
      icon: Building2,
      color: 'text-blue-600',
    },
    {
      title: 'Medical Centers',
      value: stats.overview.totalMedicalCenters,
      subtitle: `${stats.overview.activeMedicalCenters} active`,
      icon: Activity,
      color: 'text-green-600',
    },
    {
      title: 'Staff Members',
      value: stats.overview.totalStaff,
      subtitle: `${stats.overview.activeStaff} active`,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Total Donors',
      value: stats.overview.totalDonors,
      subtitle: `${stats.overview.verifiedDonors} verified`,
      icon: Users,
      color: 'text-orange-600',
    },
    {
      title: 'Total Donations',
      value: stats.overview.totalDonations,
      icon: Droplet,
      color: 'text-red-600',
    },
    {
      title: 'Blood Drives',
      value: stats.overview.totalBloodDrives,
      icon: Calendar,
      color: 'text-indigo-600',
    },
  ];

  return (
    <MainLayout>
      <div className="container max-w-7xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Global platform statistics and overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
                {stat.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Organizations */}
        <Card>
          <CardHeader>
            <CardTitle>Top Organizations</CardTitle>
            <CardDescription>Organizations by number of medical centers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topOrganizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => router.push(`/system-admin/organizations/${org.id}`)}
                >
                  <div>
                    <p className="font-medium">{org.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {org._count.medicalCenters} centers • {org._count.staff} staff
                    </p>
                  </div>
                  <div>
                    {org.isActive ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Inactive</span>
                    )}
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

