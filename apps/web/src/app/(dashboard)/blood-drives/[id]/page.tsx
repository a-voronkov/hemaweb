'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface EligibilityStatus {
  isEligible: boolean;
  reason: string;
  message: string;
  nextEligibleDate: string | null;
  daysUntilEligible: number | null;
}

interface BloodDrive {
  id: string;
  title: string;
  description?: string | null;
  startDateTime: string;
  endDateTime?: string | null;
  targetDonors?: number | null;
  actualDonors: number;
  radiusKm?: number | null;
  medicalCenter: {
    id: string;
    name: string;
    address?: string | null;
    city?: string | null;
    phone?: string | null;
    organization: {
      name: string;
    };
  };
  type: {
    code: string;
    name: string;
  };
  status: {
    code: string;
    name: string;
  };
  bloodTypesNeeded: Array<{
    id: string;
    bloodType: {
      code: string;
      name: string;
    };
  }>;
}

export default function BloodDriveDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [bloodDrive, setBloodDrive] = useState<BloodDrive | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityStatus | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBloodDrive();
    if (user) {
      loadEligibility();
    }
  }, [params.id, user]);

  const loadBloodDrive = async () => {
    try {
      const res = await apiClient.get<{ data: BloodDrive }>(`/blood-drives/${params.id}`);
      setBloodDrive(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load blood drive');
    } finally {
      setLoading(false);
    }
  };

  const loadEligibility = async () => {
    try {
      const res = await apiClient.get<EligibilityStatus>('/users/me/eligibility');
      setEligibility(res);
    } catch (err: any) {
      console.error('Failed to load eligibility:', err);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setRegistering(true);
    setError('');
    setSuccess('');

    try {
      await apiClient.post(`/blood-drives/${params.id}/register`, {});
      setSuccess('Successfully registered for this blood drive!');
      setTimeout(() => {
        router.push('/blood-drives');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to register for blood drive');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-8">
          <p>Loading blood drive details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error && !bloodDrive) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive mb-4">{error}</p>
              <Link href="/blood-drives">
                <Button variant="outline">Back to Blood Drives</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!bloodDrive) {
    return null;
  }

  const canRegister = bloodDrive.status.code === 'upcoming' || bloodDrive.status.code === 'active';

  return (
    <MainLayout>
      <div className="container max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Link href="/blood-drives" className="text-sm text-primary hover:underline">
            ← Back to Blood Drives
          </Link>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-2">{bloodDrive.title}</CardTitle>
                <CardDescription className="text-base">
                  {bloodDrive.description || 'No description provided'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getStatusColor(bloodDrive.status.code)}>
                  {bloodDrive.status.name}
                </Badge>
                <Badge variant="outline">{bloodDrive.type.name}</Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Date and Time */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Date & Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start</p>
                  <p className="font-medium">{formatDate(bloodDrive.startDateTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End</p>
                  <p className="font-medium">
                    {bloodDrive.endDateTime ? formatDate(bloodDrive.endDateTime) : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Location</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Medical Center</p>
                  <p className="font-medium">{bloodDrive.medicalCenter.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Organization</p>
                  <p className="font-medium">{bloodDrive.medicalCenter.organization.name}</p>
                </div>
                {bloodDrive.medicalCenter.address && (
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {bloodDrive.medicalCenter.address}
                      {bloodDrive.medicalCenter.city && `, ${bloodDrive.medicalCenter.city}`}
                    </p>
                  </div>
                )}
                {bloodDrive.medicalCenter.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{bloodDrive.medicalCenter.phone}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Blood Types Needed */}
            {bloodDrive.bloodTypesNeeded && bloodDrive.bloodTypesNeeded.length > 0 && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Blood Types Needed</h3>
                  <div className="flex flex-wrap gap-2">
                    {bloodDrive.bloodTypesNeeded.map((bt) => (
                      <Badge key={bt.id} variant="destructive" className="text-base px-4 py-2">
                        {bt.bloodType.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Donor Statistics */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Donor Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Registered Donors</p>
                  <p className="font-medium text-2xl">{bloodDrive.actualDonors}</p>
                </div>
                {bloodDrive.targetDonors && (
                  <div>
                    <p className="text-sm text-muted-foreground">Target Donors</p>
                    <p className="font-medium text-2xl">{bloodDrive.targetDonors}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Button */}
            {canRegister && (
              <>
                <Separator />

                {/* Eligibility Warning */}
                {eligibility && !eligibility.isEligible && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-yellow-800 mb-1">
                      {eligibility.reason === 'not_verified'
                        ? 'Verification Required'
                        : 'Not Currently Eligible'}
                    </p>
                    <p className="text-sm text-yellow-700">{eligibility.message}</p>
                    {eligibility.daysUntilEligible !== null && eligibility.daysUntilEligible > 0 && (
                      <p className="text-sm text-yellow-700 mt-2">
                        You can donate again in {eligibility.daysUntilEligible} days.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={handleRegister}
                    disabled={registering || (eligibility ? !eligibility.isEligible : false)}
                    size="lg"
                    className="flex-1"
                  >
                    {registering ? 'Registering...' : 'Register for This Blood Drive'}
                  </Button>
                </div>
              </>
            )}

            {!canRegister && bloodDrive.status.code === 'completed' && (
              <>
                <Separator />
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-center text-muted-foreground">
                    This blood drive has been completed. Thank you to all who participated!
                  </p>
                </div>
              </>
            )}

            {!canRegister && bloodDrive.status.code === 'cancelled' && (
              <>
                <Separator />
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-center text-red-800">
                    This blood drive has been cancelled.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

