'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LocationPicker } from '@/components/map/location-picker';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Plus, Edit, Trash2, Info } from 'lucide-react';
import { formatRadiusLabel } from '@/lib/utils/walking-time';

interface FavoriteLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  isActive: boolean;
  createdAt: string;
}

export default function FavoriteLocationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<FavoriteLocation[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const [addingLocation, setAddingLocation] = useState(false);
  const [newLocationData, setNewLocationData] = useState({
    name: '',
    latitude: null as number | null,
    longitude: null as number | null,
    radiusKm: 5,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role?.code !== 'donor') {
        router.push('/dashboard');
      } else {
        loadLocations();
      }
    }
  }, [user, authLoading, router]);

  const loadLocations = async () => {
    try {
      const res = await apiClient.get<{ data: FavoriteLocation[] }>('/donors/favorite-locations');
      setLocations(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async () => {
    setError('');

    // Validation
    if (!newLocationData.name.trim()) {
      setError('Please enter a location name');
      return;
    }

    if (newLocationData.latitude === null || newLocationData.longitude === null) {
      setError('Please select a location on the map');
      return;
    }

    setAddingLocation(true);

    try {
      await apiClient.post('/donors/favorite-locations', {
        name: newLocationData.name,
        latitude: newLocationData.latitude,
        longitude: newLocationData.longitude,
        radiusKm: newLocationData.radiusKm,
      });
      setSuccess('Location added successfully!');
      setAddLocationOpen(false);
      setNewLocationData({
        name: '',
        latitude: null,
        longitude: null,
        radiusKm: 5,
      });
      loadLocations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add location');
    } finally {
      setAddingLocation(false);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) {
      return;
    }

    try {
      await apiClient.delete(`/donors/favorite-locations/${id}`);
      setSuccess('Location deleted successfully!');
      loadLocations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete location');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.put(`/donors/favorite-locations/${id}`, { isActive: !currentStatus });
      setSuccess('Location updated successfully!');
      loadLocations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update location');
    }
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <p>Loading locations...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Favorite Locations</h1>
            <p className="text-muted-foreground mt-2">
              Manage your favorite locations to find nearby blood drives
            </p>
          </div>
          <Dialog open={addLocationOpen} onOpenChange={setAddLocationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Favorite Location</DialogTitle>
                <DialogDescription>
                  Click on the map to select your location, then set a search radius for finding
                  nearby blood drives.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {error && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="locationName">Location Name *</Label>
                  <Input
                    id="locationName"
                    placeholder="e.g., Home, Work, University"
                    value={newLocationData.name}
                    onChange={(e) =>
                      setNewLocationData({ ...newLocationData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select Location on Map *</Label>
                  <LocationPicker
                    lat={newLocationData.latitude ?? undefined}
                    lng={newLocationData.longitude ?? undefined}
                    onLocationChange={(lat, lng) => {
                      setNewLocationData({ ...newLocationData, latitude: lat, longitude: lng });
                      setError('');
                    }}
                    height="300px"
                  />
                  <p className="text-xs text-muted-foreground">
                    Click on the map to select your location.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="radiusKm">Search Radius</Label>
                    <span className="text-sm font-medium text-primary">
                      {formatRadiusLabel(newLocationData.radiusKm)}
                    </span>
                  </div>
                  <Slider
                    id="radiusKm"
                    min={1}
                    max={50}
                    step={1}
                    value={[newLocationData.radiusKm]}
                    onValueChange={(value) =>
                      setNewLocationData({ ...newLocationData, radiusKm: value[0] })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 km</span>
                    <span>50 km</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddLocation} disabled={addingLocation} className="flex-1">
                    {addingLocation ? 'Adding...' : 'Add Location'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAddLocationOpen(false);
                      setError('');
                    }}
                    disabled={addingLocation}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Privacy Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Privacy Notice</p>
                <p className="text-blue-800 mt-1">
                  We do not store your exact address. Only approximate coordinates are saved to help
                  you find nearby blood drives and receive notifications when there&#039;s an urgent
                  need for your blood type in your area.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Locations List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Your Locations ({locations.length})
            </CardTitle>
            <CardDescription>
              Locations you&#039;ve added to find nearby blood drives
            </CardDescription>
          </CardHeader>
          <CardContent>
            {locations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No locations added yet</p>
                <p className="text-sm mt-1">Add your first location to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{location.name}</p>
                        <Badge variant={location.isActive ? 'default' : 'secondary'}>
                          {location.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Radius: {location.radiusKm} km (~{location.radiusKm * 12} min walk)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(location.id, location.isActive)}
                      >
                        {location.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteLocation(location.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
