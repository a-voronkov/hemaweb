'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Droplet, Calendar, MapPin, Activity } from 'lucide-react';

interface Donation {
  id: string;
  donationDate: string;
  bloodType: string;
  volume: number;
  hemoglobin?: number;
  bloodPressure?: string;
  status: string;
  medicalCenter: {
    id: string;
    name: string;
    city: string;
  };
}

export default function MyDonationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role?.code !== 'donor') {
        router.push('/dashboard');
      } else {
        loadDonations();
      }
    }
  }, [user, authLoading, router]);

  const loadDonations = async () => {
    try {
      const res = await apiClient.get<{ data: Donation[] }>('/donors/me/donations');
      setDonations(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      completed: 'default',
      pending: 'secondary',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <p>Loading donations...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Donations</h1>
          <p className="text-muted-foreground mt-2">
            Your complete blood donation history
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-3xl font-bold">{donations.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-3xl font-bold">
                  {donations.reduce((sum, d) => sum + d.volume, 0)}ml
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lives Saved</p>
                <p className="text-3xl font-bold text-red-600">
                  ~{donations.length * 3}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donations List */}
        <div className="space-y-4">
          {donations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Droplet className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium">No donations yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start your journey by booking your first blood drive appointment
                </p>
              </CardContent>
            </Card>
          ) : (
            donations.map((donation) => (
              <Card key={donation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-red-600" />
                        {donation.medicalCenter.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {donation.medicalCenter.city}
                      </CardDescription>
                    </div>
                    {getStatusBadge(donation.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(donation.donationDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Blood Type</p>
                      <p className="font-medium">{donation.bloodType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-medium">{donation.volume}ml</p>
                    </div>
                    {donation.hemoglobin && (
                      <div>
                        <p className="text-muted-foreground">Hemoglobin</p>
                        <p className="font-medium">{donation.hemoglobin} g/dL</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}

