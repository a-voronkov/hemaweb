'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Droplet, Calendar, Award, Heart, TrendingUp, Clock } from 'lucide-react';

interface DonorStats {
  totalDonations: number;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  bloodType?: string;
  isDonorVerified: boolean;
  upcomingAppointments: Array<{
    id: string;
    date: string;
    bloodDrive: {
      name: string;
      location: string;
    };
  }>;
  recentDonations: Array<{
    id: string;
    donationDate: string;
    bloodType: string;
    volume: number;
    medicalCenter: {
      name: string;
    };
  }>;
}

export default function DonorDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DonorStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role?.code !== 'donor') {
        router.push('/dashboard');
      } else {
        loadStats();
      }
    }
  }, [user, authLoading, router]);

  const loadStats = async () => {
    try {
      const res = await apiClient.get<DonorStats>('/donors/me/stats');
      setStats(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load donor statistics');
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysUntilEligible = (nextDate?: string) => {
    if (!nextDate) return null;
    const days = Math.ceil((new Date(nextDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <p>Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!stats) return null;

  const daysUntilEligible = calculateDaysUntilEligible(stats.nextEligibleDate);
  const canDonateNow = daysUntilEligible === 0;

  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Donor Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Track your donations and find opportunities to help.
            </p>
          </div>
          {stats.isDonorVerified ? (
            <Badge variant="default" className="text-sm">
              <Award className="h-4 w-4 mr-1" />
              Verified Donor
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-sm">
              Pending Verification
            </Badge>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Donations
              </CardTitle>
              <Droplet className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalDonations}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.bloodType && `Blood Type: ${stats.bloodType}`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Donation
              </CardTitle>
              <Calendar className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.lastDonationDate 
                  ? new Date(stats.lastDonationDate).toLocaleDateString()
                  : 'Never'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Next Eligible
              </CardTitle>
              <Clock className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              {canDonateNow ? (
                <div className="text-2xl font-bold text-green-600">Ready Now!</div>
              ) : daysUntilEligible !== null ? (
                <>
                  <div className="text-2xl font-bold">{daysUntilEligible} days</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stats.nextEligibleDate && new Date(stats.nextEligibleDate).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <div className="text-2xl font-bold">Unknown</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              onClick={() => router.push('/donor/blood-drives')}
              className="flex-1"
              disabled={!canDonateNow}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {canDonateNow ? 'Find Blood Drives' : 'Not Eligible Yet'}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/donor/donations')}
              className="flex-1"
            >
              <Droplet className="h-4 w-4 mr-2" />
              My Donations
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/donor/achievements')}
              className="flex-1"
            >
              <Award className="h-4 w-4 mr-2" />
              Achievements
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        {stats.upcomingAppointments && stats.upcomingAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled blood donation appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{appointment.bloodDrive.name}</p>
                      <p className="text-sm text-muted-foreground">{appointment.bloodDrive.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Donations */}
        {stats.recentDonations && stats.recentDonations.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="h-5 w-5" />
                    Recent Donations
                  </CardTitle>
                  <CardDescription>Your latest blood donations</CardDescription>
                </div>
                <Button variant="outline" onClick={() => router.push('/donor/donations')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                        <Droplet className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{donation.medicalCenter.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {donation.bloodType} • {donation.volume}ml
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{new Date(donation.donationDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action if no donations */}
        {stats.totalDonations === 0 && (
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Heart className="h-16 w-16 mx-auto text-red-600" />
                <div>
                  <h3 className="text-2xl font-bold">Start Your Journey as a Blood Donor</h3>
                  <p className="text-muted-foreground mt-2">
                    Every donation can save up to 3 lives. Find a blood drive near you and make a difference today!
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => router.push('/donor/blood-drives')}
                  disabled={!canDonateNow}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  {canDonateNow ? 'Find Blood Drives' : 'Complete Your Profile First'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

