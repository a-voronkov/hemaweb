'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { Calendar, Clock, MapPin, Users, Droplet, Building2 } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

interface BloodDrive {
  id: string;
  title: string;
  description?: string;
  address?: string;
  city?: string;
  startDateTime: string;
  endDateTime?: string;
  targetDonors?: number;
  medicalCenter: {
    id: string;
    name: string;
    city: string;
  };
  type?: {
    name: string;
  };
  status?: {
    code: string;
    name: string;
  };
  bloodTypesNeeded?: {
    id: string;
    bloodType: {
      name: string;
    };
  }[];
  _count?: {
    registrations: number;
  };
}

export default function BloodDriveDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bloodDrive, setBloodDrive] = useState<BloodDrive | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBloodDrive();
  }, [params.id]);

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

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-8">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !bloodDrive) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-8">
          <div className="mb-6">
            <Link href="/staff/blood-drives" className="text-sm text-primary hover:underline">
              ← Back to Blood Drives
            </Link>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive">{error || 'Blood drive not found'}</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Link href="/staff/blood-drives" className="text-sm text-primary hover:underline">
            ← Back to Blood Drives
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">{bloodDrive.title}</CardTitle>
                <CardDescription className="mt-2">
                  {bloodDrive.description}
                </CardDescription>
              </div>
              {bloodDrive.status && (
                <Badge variant="secondary">{bloodDrive.status.name}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Medical Center */}
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{bloodDrive.medicalCenter.name}</p>
                <p className="text-sm text-muted-foreground">{bloodDrive.medicalCenter.city}</p>
              </div>
            </div>

            {/* Location */}
            {bloodDrive.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">{bloodDrive.address}</p>
                  <p className="text-sm text-muted-foreground">{bloodDrive.city}</p>
                </div>
              </div>
            )}

            {/* Date & Time */}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm">
                  {format(parseISO(bloodDrive.startDateTime), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(bloodDrive.startDateTime), 'h:mm a')}
                  {bloodDrive.endDateTime && ` - ${format(parseISO(bloodDrive.endDateTime), 'h:mm a')}`}
                </p>
              </div>
            </div>

            {/* Registrations */}
            {bloodDrive._count && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm">
                    {bloodDrive._count.registrations} registration{bloodDrive._count.registrations !== 1 ? 's' : ''}
                    {bloodDrive.targetDonors && ` / ${bloodDrive.targetDonors} target`}
                  </p>
                </div>
              </div>
            )}

            {/* Blood Types Needed */}
            {bloodDrive.bloodTypesNeeded && bloodDrive.bloodTypesNeeded.length > 0 && (
              <div className="flex items-start gap-3">
                <Droplet className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-2">Blood Types Needed:</p>
                  <div className="flex gap-2 flex-wrap">
                    {bloodDrive.bloodTypesNeeded.map((bt) => (
                      <Badge key={bt.id} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {bt.bloodType.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t flex gap-3">
              <Link href={`/staff/blood-drives/${bloodDrive.id}/registrations`}>
                <Button>
                  View Registrations
                  {bloodDrive._count && bloodDrive._count.registrations > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {bloodDrive._count.registrations}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

