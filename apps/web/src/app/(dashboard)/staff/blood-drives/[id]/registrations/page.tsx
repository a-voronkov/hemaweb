'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { Calendar, Clock, User, Mail, Droplet } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

interface Registration {
  id: string;
  confirmationNumber?: string | null;
  appointmentDate?: string | null;
  appointmentTime?: string | null;
  status: string;
  createdAt: string;
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    user: {
      email: string;
    };
    bloodType?: {
      name: string;
    };
  };
}

interface BloodDrive {
  id: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
}

export default function RegistrationsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [bloodDrive, setBloodDrive] = useState<BloodDrive | null>(null);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      const [driveRes, registrationsRes] = await Promise.all([
        apiClient.get<{ data: BloodDrive }>(`/blood-drives/${params.id}`),
        apiClient.get<{ data: Registration[] }>(`/blood-drives/${params.id}/registrations`),
      ]);

      setBloodDrive(driveRes.data);
      setRegistrations(registrationsRes.data);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registered':
        return <Badge variant="default">Registered</Badge>;
      case 'attended':
        return <Badge variant="default" className="bg-green-600">Attended</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8">
        <div className="mb-6">
          <Link href="/staff/blood-drives" className="text-sm text-primary hover:underline">
            ← Back to Blood Drives
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Registrations</CardTitle>
            <CardDescription>
              {bloodDrive?.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No registrations yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-semibold">
                            {registration.profile.firstName} {registration.profile.lastName}
                          </h3>
                          {getStatusBadge(registration.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{registration.profile.user.email}</span>
                          </div>

                          {registration.profile.bloodType && (
                            <div className="flex items-center gap-2">
                              <Droplet className="h-4 w-4 text-red-500" />
                              <span>{registration.profile.bloodType.name}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {registration.appointmentDate
                                ? format(parseISO(registration.appointmentDate), 'MMM d, yyyy')
                                : `Registered: ${format(parseISO(registration.createdAt), 'MMM d, yyyy')}`
                              }
                            </span>
                          </div>

                          {registration.appointmentTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{registration.appointmentTime}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                          {registration.confirmationNumber ? (
                            <>Confirmation: {registration.confirmationNumber}</>
                          ) : (
                            <>Registered: {format(parseISO(registration.createdAt), 'MMM d, yyyy h:mm a')}</>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

