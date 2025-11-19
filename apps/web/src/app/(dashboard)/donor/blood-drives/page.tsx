'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, MapPin, Clock, Users, Search } from 'lucide-react';

interface BloodDrive {
  id: string;
  name: string;
  description?: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  maxDonors?: number;
  medicalCenter: {
    id: string;
    name: string;
    city: string;
  };
  _count?: {
    appointments: number;
  };
}

export default function BloodDrivesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bloodDrives, setBloodDrives] = useState<BloodDrive[]>([]);
  const [filteredDrives, setFilteredDrives] = useState<BloodDrive[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role?.code !== 'donor') {
        router.push('/dashboard');
      } else {
        loadBloodDrives();
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = bloodDrives.filter(drive =>
        drive.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.medicalCenter.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDrives(filtered);
    } else {
      setFilteredDrives(bloodDrives);
    }
  }, [searchQuery, bloodDrives]);

  const loadBloodDrives = async () => {
    try {
      const res = await apiClient.get<{ data: BloodDrive[] }>('/blood-drives/upcoming');
      setBloodDrives(res.data);
      setFilteredDrives(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load blood drives');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (bloodDriveId: string) => {
    try {
      await apiClient.post('/blood-drives/appointments', {
        bloodDriveId,
        appointmentDate: new Date().toISOString(), // Will be updated with actual date picker
      });
      setSuccess('Appointment booked successfully!');
      loadBloodDrives();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment');
      setTimeout(() => setError(''), 3000);
    }
  };

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  const isFull = (drive: BloodDrive) => {
    if (!drive.maxDonors || !drive._count) return false;
    return drive._count.appointments >= drive.maxDonors;
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <p>Loading blood drives...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Blood Drives</h1>
          <p className="text-muted-foreground mt-2">
            Find and book appointments for upcoming blood donation drives
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, location, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Blood Drives List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDrives.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium">No blood drives found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? 'Try adjusting your search' : 'Check back later for upcoming drives'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDrives.map((drive) => (
              <Card key={drive.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{drive.name}</CardTitle>
                        {!isUpcoming(drive.startDate) && (
                          <Badge variant="secondary">Ongoing</Badge>
                        )}
                        {isFull(drive) && (
                          <Badge variant="destructive">Full</Badge>
                        )}
                      </div>
                      {drive.description && (
                        <CardDescription className="mt-2">{drive.description}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{drive.location}</span>
                      <span className="text-muted-foreground">• {drive.medicalCenter.city}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(drive.startDate).toLocaleDateString()} - {new Date(drive.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    {drive.startTime && drive.endTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{drive.startTime} - {drive.endTime}</span>
                      </div>
                    )}

                    {drive.maxDonors && drive._count && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {drive._count.appointments} / {drive.maxDonors} donors registered
                        </span>
                      </div>
                    )}

                    <div className="pt-3">
                      <Button
                        onClick={() => handleBookAppointment(drive.id)}
                        disabled={isFull(drive)}
                        className="w-full"
                      >
                        {isFull(drive) ? 'Fully Booked' : 'Book Appointment'}
                      </Button>
                    </div>
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

