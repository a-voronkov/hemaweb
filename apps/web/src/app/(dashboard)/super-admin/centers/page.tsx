'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { MedicalCenterMap } from '@/components/map/medical-center-map';
import Link from 'next/link';
import { Building2, MapPin, Plus } from 'lucide-react';

interface MedicalCenter {
  id: string;
  name: string;
  city: string;
  address: string;
  phone?: string;
  email?: string;
  locationLat?: number;
  locationLng?: number;
  isActive: boolean;
}

export default function SuperAdminCentersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [centers, setCenters] = useState<MedicalCenter[]>([]);
  const [organizationId, setOrganizationId] = useState<string>('');
  const [error, setError] = useState('');
  const [selectedCenterId, setSelectedCenterId] = useState<string | undefined>();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role?.code !== 'super_admin') {
      router.push('/');
      return;
    }

    if (user) {
      loadCenters();
    }
  }, [user, authLoading, router]);

  const loadCenters = async () => {
    try {
      // Get staff profile to find organization ID
      const staffRes = await apiClient.get<{ data: any }>('/users/me/staff-profile');
      
      if (!staffRes.data.organizationId) {
        setError('No organization assigned to your account');
        setLoading(false);
        return;
      }

      setOrganizationId(staffRes.data.organizationId);

      // Get organization with centers
      const orgRes = await apiClient.get<{ data: any }>(`/organizations/${staffRes.data.organizationId}`);
      setCenters(orgRes.data.medicalCenters || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load medical centers');
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <MainLayout>
        <div className="container max-w-7xl px-4 py-8">
          <p>Loading medical centers...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container max-w-7xl px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Medical Centers</h1>
            <p className="text-muted-foreground">Manage medical centers in your organization</p>
          </div>
          {organizationId && (
            <Link href={`/admin/organizations/${organizationId}/centers/create`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Center
              </Button>
            </Link>
          )}
        </div>

        {centers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No medical centers yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first medical center
              </p>
              {organizationId && (
                <Link href={`/admin/organizations/${organizationId}/centers/create`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Center
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Centers list with scroll */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {centers.map((center) => (
                <Card
                  key={center.id}
                  className={`cursor-pointer transition-colors ${
                    selectedCenterId === center.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedCenterId(center.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{center.name}</CardTitle>
                      <Badge variant={center.isActive ? 'default' : 'secondary'}>
                        {center.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{center.address}</p>
                        <p className="text-muted-foreground">{center.city}</p>
                        {(center.locationLat && center.locationLng) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            📍 {center.locationLat.toFixed(4)}, {center.locationLng.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>

                    {center.phone && (
                      <p className="text-sm text-muted-foreground">📞 {center.phone}</p>
                    )}

                    {center.email && (
                      <p className="text-sm text-muted-foreground break-all">✉️ {center.email}</p>
                    )}

                    <Link href={`/admin/medical-centers/${center.id}`} className="block mt-3" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right side - Map */}
            <div className="sticky top-8">
              <MedicalCenterMap
                centers={centers}
                selectedCenterId={selectedCenterId}
                onCenterSelect={setSelectedCenterId}
                height="600px"
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

