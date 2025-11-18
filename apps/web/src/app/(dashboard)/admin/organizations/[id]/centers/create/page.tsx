'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { LocationPicker } from '@/components/map/location-picker';

export default function CreateMedicalCenterPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    locationLat: '',
    locationLng: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    // Allow system_admin and super_admin
    if (user && !['system_admin', 'super_admin'].includes(user.role?.code || '')) {
      router.push('/');
      return;
    }

    if (user && params.id) {
      loadOrganization();
    }
  }, [user, authLoading, params.id, router]);

  const loadOrganization = async () => {
    try {
      const res = await apiClient.get<{ data: { name: string } }>(`/organizations/${params.id}`);
      setOrganizationName(res.data.name);
    } catch (err: any) {
      setError(err.message || 'Failed to load organization');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/medical-centers/admin/create', {
        ...formData,
        organizationId: params.id,
        locationLat: formData.locationLat ? parseFloat(formData.locationLat) : undefined,
        locationLng: formData.locationLng ? parseFloat(formData.locationLng) : undefined,
      });

      router.push(`/admin/organizations/${params.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create medical center');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container max-w-2xl px-4 py-8">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-2xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create Medical Center</h1>
          <p className="text-muted-foreground mt-2">
            Add a new medical center to {organizationName}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Center Information</CardTitle>
            <CardDescription>Enter the details for the new medical center</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Center Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Bangkok Blood Center"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder="Street address"
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
                  placeholder="e.g., Bangkok"
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
                    placeholder="+66-XX-XXX-XXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="center@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="locationLat">Latitude (optional)</Label>
                  <Input
                    id="locationLat"
                    type="number"
                    step="any"
                    value={formData.locationLat}
                    onChange={(e) => setFormData({ ...formData, locationLat: e.target.value })}
                    placeholder="13.7563"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locationLng">Longitude (optional)</Label>
                  <Input
                    id="locationLng"
                    type="number"
                    step="any"
                    value={formData.locationLng}
                    onChange={(e) => setFormData({ ...formData, locationLng: e.target.value })}
                    placeholder="100.5018"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location on Map (optional)</Label>
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

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Medical Center'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/admin/organizations/${params.id}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

