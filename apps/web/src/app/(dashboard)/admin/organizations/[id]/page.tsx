'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Building2, Mail, Phone, Globe, Plus, MapPin, Edit, Archive } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  isActive: boolean;
  medicalCenters: Array<{
    id: string;
    name: string;
    city: string;
    isActive: boolean;
  }>;
  staff: Array<{
    id: string;
    firstName: string;
    lastName: string;
    position?: string;
    user: {
      email: string;
      role: {
        name: string;
        code: string;
      };
    };
  }>;
  _count: {
    medicalCenters: number;
    staff: number;
  };
}

export default function OrganizationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role?.code !== 'system_admin') {
      router.push('/');
      return;
    }

    if (user && params.id) {
      loadOrganization();
    }
  }, [user, authLoading, params.id, router]);

  const loadOrganization = async () => {
    try {
      const res = await apiClient.get<{ data: Organization }>(`/organizations/${params.id}`);
      setOrganization(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load organization');
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveCenter = async (centerId: string) => {
    if (!confirm('Archive this medical center? It will be hidden but not deleted.')) {
      return;
    }

    try {
      await apiClient.put(`/medical-centers/admin/${centerId}`, { isActive: false });
      loadOrganization();
    } catch (err: any) {
      alert(err.message || 'Failed to archive center');
    }
  };

  if (loading || authLoading) {
    return (
      <MainLayout>
        <div className="container max-w-7xl px-4 py-8">
          <p>Loading organization...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !organization) {
    return (
      <MainLayout>
        <div className="container max-w-7xl px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Organization not found'}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{organization.name}</h1>
              <Badge variant={organization.isActive ? 'default' : 'secondary'}>
                {organization.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {organization.description && (
              <p className="text-muted-foreground">{organization.description}</p>
            )}
          </div>
          <Button variant="outline" onClick={() => router.push('/admin/organizations')}>
            Back to Organizations
          </Button>
        </div>

        {/* Organization Info */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organization.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{organization.email}</span>
                </div>
              )}
              {organization.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{organization.phone}</span>
                </div>
              )}
              {organization.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {organization.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medical Centers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Medical Centers ({organization._count.medicalCenters})</CardTitle>
                <CardDescription>Centers under this organization</CardDescription>
              </div>
              <Link href={`/admin/organizations/${organization.id}/centers/create`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Center
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {organization.medicalCenters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No medical centers yet</p>
                <p className="text-sm mt-1">Create the first center for this organization</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organization.medicalCenters.map((center) => (
                  <Card key={center.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{center.name}</CardTitle>
                        <Badge variant={center.isActive ? 'default' : 'secondary'} className="text-xs">
                          {center.isActive ? 'Active' : 'Archived'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{center.city}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/medical-centers/${center.id}/edit`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        {center.isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleArchiveCenter(center.id)}
                          >
                            <Archive className="h-3 w-3 mr-1" />
                            Archive
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Super Admins */}
        <Card>
          <CardHeader>
            <CardTitle>Super Admins ({organization.staff.length})</CardTitle>
            <CardDescription>Users with organization-wide access</CardDescription>
          </CardHeader>
          <CardContent>
            {organization.staff.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No super admins assigned</p>
              </div>
            ) : (
              <div className="space-y-2">
                {organization.staff.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{staff.firstName} {staff.lastName}</p>
                      <p className="text-sm text-muted-foreground">{staff.user.email}</p>
                      {staff.position && (
                        <p className="text-sm text-muted-foreground">{staff.position}</p>
                      )}
                    </div>
                    <Badge>{staff.user.role.name}</Badge>
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

