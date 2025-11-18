'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Map, List, Calendar, MapPin, Users } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Leaflet
const BloodDrivesMap = dynamic(
  () => import('@/components/blood-drives-map').then(mod => ({ default: mod.BloodDrivesMap })),
  { ssr: false, loading: () => <div className="h-[500px] flex items-center justify-center border rounded-lg">Loading map...</div> }
);

interface BloodType {
  id: string;
  code: string;
  name: string;
}

interface BloodDrive {
  id: string;
  title: string;
  description?: string | null;
  startDateTime: string;
  endDateTime?: string | null;
  targetDonors?: number | null;
  actualDonors: number;
  distance?: number;
  medicalCenter: {
    id: string;
    name: string;
    address?: string | null;
    city?: string | null;
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

export default function BloodDrivesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bloodDrives, setBloodDrives] = useState<BloodDrive[]>([]);
  const [bloodTypes, setBloodTypes] = useState<BloodType[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    bloodType: 'all',
    search: '',
  });

  useEffect(() => {
    loadData();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  const loadData = async () => {
    try {
      const [drivesRes, bloodTypesRes] = await Promise.all([
        apiClient.get<{ data: BloodDrive[] }>('/blood-drives'),
        apiClient.get<{ data: BloodType[] }>('/reference/blood-types'),
      ]);

      setBloodDrives(drivesRes.data || []);
      setBloodTypes(bloodTypesRes.data || []);
    } catch (err) {
      console.error('Failed to load blood drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const filteredDrives = bloodDrives
    .filter((drive) => {
      // Filter by status
      if (filters.status !== 'all' && drive.status.code !== filters.status) {
        return false;
      }

      // Filter by blood type
      if (filters.bloodType !== 'all') {
        const hasBloodType = drive.bloodTypesNeeded.some(
          (bt) => bt.bloodType.code === filters.bloodType
        );
        if (!hasBloodType) return false;
      }

      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          drive.title.toLowerCase().includes(searchLower) ||
          drive.medicalCenter.name.toLowerCase().includes(searchLower) ||
          drive.medicalCenter.city?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Emergency drives first
      if (a.type.code === 'emergency' && b.type.code !== 'emergency') return -1;
      if (a.type.code !== 'emergency' && b.type.code === 'emergency') return 1;

      // Then by start date
      return new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
    });

  if (loading) {
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
      <div className="container max-w-6xl px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Blood Drives</CardTitle>
                <CardDescription>
                  Find and register for blood drives near you
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by title or location..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select
                  value={filters.bloodType}
                  onValueChange={(value) => setFilters({ ...filters, bloodType: value })}
                >
                  <SelectTrigger id="bloodType">
                    <SelectValue placeholder="All blood types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blood Types</SelectItem>
                    {bloodTypes.map((bt) => (
                      <SelectItem key={bt.id} value={bt.code}>
                        {bt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Map View */}
            {viewMode === 'map' && (
              <div className="mb-6">
                <BloodDrivesMap
                  bloodDrives={filteredDrives}
                  userLocation={userLocation}
                />
              </div>
            )}

            {/* Blood Drives List */}
            {viewMode === 'list' && (
              <>
                {filteredDrives.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      {filters.search || filters.status !== 'all' || filters.bloodType !== 'all'
                        ? 'No blood drives match your filters'
                        : 'No blood drives available at the moment'}
                    </p>
                    {(filters.search || filters.status !== 'all' || filters.bloodType !== 'all') && (
                      <Button
                        variant="outline"
                        onClick={() => setFilters({ status: 'all', bloodType: 'all', search: '' })}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDrives.map((drive) => (
                  <div
                    key={drive.id}
                    className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                      drive.type.code === 'emergency' ? 'border-red-500 border-2 bg-red-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{drive.title}</h3>
                          {drive.type.code === 'emergency' && (
                            <Badge variant="destructive" className="animate-pulse">
                              URGENT
                            </Badge>
                          )}
                        </div>
                        {drive.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {drive.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(drive.status.code)}>
                          {drive.status.name}
                        </Badge>
                        <Badge variant={drive.type.code === 'emergency' ? 'destructive' : 'outline'}>
                          {drive.type.name}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium">Location:</span>{' '}
                        {drive.medicalCenter.name}
                        {drive.medicalCenter.city && `, ${drive.medicalCenter.city}`}
                      </div>
                      <div>
                        <span className="font-medium">Start:</span>{' '}
                        {formatDate(drive.startDateTime)}
                      </div>
                      <div>
                        <span className="font-medium">End:</span>{' '}
                        {drive.endDateTime ? formatDate(drive.endDateTime) : 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Donors:</span>{' '}
                        {drive.actualDonors}
                        {drive.targetDonors && ` / ${drive.targetDonors}`}
                      </div>
                    </div>

                    {drive.bloodTypesNeeded && drive.bloodTypesNeeded.length > 0 && (
                      <div className="mb-3 pt-3 border-t">
                        <span className="text-sm font-medium">Blood Types Needed: </span>
                        <div className="flex gap-2 mt-2">
                          {drive.bloodTypesNeeded.map((bt) => (
                            <Badge key={bt.id} variant="destructive">
                              {bt.bloodType.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link href={`/blood-drives/${drive.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      {drive.status.code === 'upcoming' || drive.status.code === 'active' ? (
                        <Link href={`/blood-drives/${drive.id}/register`}>
                          <Button size="sm">Register</Button>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

