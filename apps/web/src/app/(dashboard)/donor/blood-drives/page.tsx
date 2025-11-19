'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, MapPin, Clock, Users, Search, Navigation } from 'lucide-react';

const BloodDrivesMap = dynamic(
  () => import('@/components/map/blood-drives-map').then((mod) => mod.BloodDrivesMap),
  { ssr: false }
);

interface FavoriteLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  isActive: boolean;
}

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
    locationLat?: number;
    locationLng?: number;
  };
  _count?: {
    appointments: number;
  };
  distance?: number;
  isWithinFavoriteRadius?: boolean;
}

export default function BloodDrivesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bloodDrives, setBloodDrives] = useState<BloodDrive[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([]);
  const [filteredDrives, setFilteredDrives] = useState<BloodDrive[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const ITEMS_PER_PAGE = 10;

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Check if blood drive is within any favorite location radius
  const isWithinFavoriteRadius = (drive: BloodDrive): boolean => {
    if (!drive.medicalCenter.locationLat || !drive.medicalCenter.locationLng) return false;

    return favoriteLocations.some(loc => {
      if (!loc.isActive) return false;
      const distance = calculateDistance(
        loc.latitude,
        loc.longitude,
        drive.medicalCenter.locationLat!,
        drive.medicalCenter.locationLng!
      );
      return distance <= loc.radiusKm;
    });
  };

  // Calculate minimum distance to any favorite location
  const getMinDistanceToFavorites = (drive: BloodDrive): number => {
    if (!drive.medicalCenter.locationLat || !drive.medicalCenter.locationLng) return Infinity;
    if (favoriteLocations.length === 0) return Infinity;

    const distances = favoriteLocations
      .filter(loc => loc.isActive)
      .map(loc => calculateDistance(
        loc.latitude,
        loc.longitude,
        drive.medicalCenter.locationLat!,
        drive.medicalCenter.locationLng!
      ));

    return distances.length > 0 ? Math.min(...distances) : Infinity;
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role?.code !== 'donor') {
        router.push('/dashboard');
      } else {
        loadData();
      }
    }
  }, [user, authLoading, router]);

  // Process and sort blood drives
  const processedDrives = useMemo(() => {
    return bloodDrives.map(drive => ({
      ...drive,
      distance: getMinDistanceToFavorites(drive),
      isWithinFavoriteRadius: isWithinFavoriteRadius(drive),
    })).sort((a, b) => a.distance - b.distance);
  }, [bloodDrives, favoriteLocations]);

  // Filter drives based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = processedDrives.filter(drive =>
        drive.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.medicalCenter.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDrives(filtered);
    } else {
      setFilteredDrives(processedDrives);
    }
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, processedDrives]);

  // Paginated drives
  const paginatedDrives = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredDrives.slice(startIndex, endIndex);
  }, [filteredDrives, currentPage]);

  const totalPages = Math.ceil(filteredDrives.length / ITEMS_PER_PAGE);

  const loadData = async () => {
    try {
      const [drivesRes, locationsRes] = await Promise.all([
        apiClient.get<{ data: BloodDrive[] }>('/blood-drives/upcoming'),
        apiClient.get<{ data: FavoriteLocation[] }>('/donors/favorite-locations'),
      ]);

      setBloodDrives(drivesRes.data);
      setFavoriteLocations(locationsRes.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (bloodDriveId: string) => {
    try {
      await apiClient.post('/blood-drives/appointments', {
        bloodDriveId,
        appointmentDate: new Date().toISOString(),
      });
      setSuccess('Appointment booked successfully!');
      loadData();
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
      <div className="container max-w-7xl px-4 py-8 space-y-6">
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

        {/* Two-column layout: List on left, Map on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Blood Drives List */}
          <div className="space-y-4">
            {paginatedDrives.length === 0 ? (
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
              <>
                {paginatedDrives.map((drive) => (
                  <Card
                    key={drive.id}
                    className={`hover:shadow-md transition-shadow ${
                      drive.isWithinFavoriteRadius ? 'border-red-500 border-2' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-lg">{drive.name}</CardTitle>
                            {drive.isWithinFavoriteRadius && (
                              <Badge variant="default" className="bg-red-500">
                                Near Favorite
                              </Badge>
                            )}
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

                        {drive.distance !== Infinity && (
                          <div className="flex items-center gap-2 text-sm">
                            <Navigation className="h-4 w-4 text-muted-foreground" />
                            <span>{drive.distance.toFixed(1)} km from nearest favorite location</span>
                          </div>
                        )}

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
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right column: Map */}
          <div className="lg:sticky lg:top-4 h-[600px]">
            <BloodDrivesMap
              bloodDrives={filteredDrives}
              favoriteLocations={favoriteLocations}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

