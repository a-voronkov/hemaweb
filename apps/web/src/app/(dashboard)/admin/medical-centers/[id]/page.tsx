'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { MedicalCenterMap } from '@/components/map/medical-center-map';
import { LocationPicker } from '@/components/map/location-picker';
import { WorkingHoursEditor } from '@/components/medical-centers/working-hours-editor';
import { Building2, MapPin, Mail, Phone, Edit, Save, X } from 'lucide-react';

interface DaySchedule {
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface MedicalCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  locationLat?: number;
  locationLng?: number;
  workingHours?: WorkingHours | null;
  isActive: boolean;
  organization: {
    id: string;
    name: string;
  };
}

export default function MedicalCenterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [center, setCenter] = useState<MedicalCenter | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    locationLat: '',
    locationLng: '',
  });

  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && params.id) {
      loadCenter();
    }
  }, [user, authLoading, params.id, router]);

  const loadCenter = async () => {
    try {
      const res = await apiClient.get<{ data: MedicalCenter }>(`/medical-centers/${params.id}`);
      setCenter(res.data);
      setFormData({
        name: res.data.name,
        address: res.data.address,
        city: res.data.city,
        phone: res.data.phone || '',
        email: res.data.email || '',
        locationLat: res.data.locationLat?.toString() || '',
        locationLng: res.data.locationLng?.toString() || '',
      });
      setWorkingHours(res.data.workingHours || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load medical center');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await apiClient.put(`/medical-centers/admin/${params.id}`, {
        ...formData,
        locationLat: formData.locationLat ? parseFloat(formData.locationLat) : undefined,
        locationLng: formData.locationLng ? parseFloat(formData.locationLng) : undefined,
        workingHours,
      });

      setSuccess('Medical center updated successfully!');
      setEditing(false);
      loadCenter();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update medical center');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!center) return;

    try {
      await apiClient.put(`/medical-centers/admin/${params.id}`, {
        isActive: !center.isActive,
      });
      loadCenter();
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  if (loading || authLoading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-8">
          <p>Loading medical center...</p>
        </div>
      </MainLayout>
    );
  }

  if (error && !center) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!center) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-8">
          <p>Medical center not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{center.name}</h1>
              <Badge variant={center.isActive ? 'default' : 'secondary'}>
                {center.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-muted-foreground">{center.organization.name}</p>
          </div>
          <div className="flex gap-2">
            {!editing ? (
              <>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant={center.isActive ? 'outline' : 'default'}
                  onClick={handleToggleActive}
                >
                  {center.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" onClick={() => {
                  setEditing(false);
                  setFormData({
                    name: center.name,
                    address: center.address,
                    city: center.city,
                    phone: center.phone || '',
                    email: center.email || '',
                    locationLat: center.locationLat?.toString() || '',
                    locationLng: center.locationLng?.toString() || '',
                  });
                }}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
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

        {/* Center Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Center Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Center Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="locationLat">Latitude</Label>
                    <Input
                      id="locationLat"
                      type="number"
                      step="any"
                      value={formData.locationLat}
                      onChange={(e) => setFormData({ ...formData, locationLat: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locationLng">Longitude</Label>
                    <Input
                      id="locationLng"
                      type="number"
                      step="any"
                      value={formData.locationLng}
                      onChange={(e) => setFormData({ ...formData, locationLng: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location on Map</Label>
                  <LocationPicker
                    lat={formData.locationLat ? parseFloat(formData.locationLat) : undefined}
                    lng={formData.locationLng ? parseFloat(formData.locationLng) : undefined}
                    address={formData.address}
                    city={formData.city}
                    onLocationChange={(lat, lng) => {
                      setFormData({
                        ...formData,
                        locationLat: lat.toString(),
                        locationLng: lng.toString(),
                      });
                    }}
                  />
                </div>

                <WorkingHoursEditor
                  workingHours={workingHours}
                  onChange={setWorkingHours}
                  disabled={false}
                />
              </>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{center.address}</p>
                    <p className="text-muted-foreground">{center.city}</p>
                  </div>
                </div>

                {center.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{center.phone}</span>
                  </div>
                )}

                {center.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{center.email}</span>
                  </div>
                )}

                {(center.locationLat && center.locationLng) && (
                  <div className="text-sm text-muted-foreground">
                    <p>Coordinates: {center.locationLat}, {center.locationLng}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Map */}
        {!editing && center.locationLat && center.locationLng && (
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <MedicalCenterMap
                centers={[center]}
                height="400px"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

