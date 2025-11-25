'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Building2, Mail, Phone, Globe, Plus } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  isActive: boolean;
  _count?: {
    medicalCenters: number;
    staff: number;
  };
}

export default function OrganizationsManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    // Only system_admin can access this page
    if (user && user.role?.code !== 'system_admin') {
      router.push('/');
      return;
    }

    if (user) {
      loadOrganizations();
    }
  }, [user, authLoading, router]);

  const loadOrganizations = async () => {
    try {
      const res = await apiClient.get<{ data: Organization[] }>('/organizations');
      setOrganizations(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this organization? This will also delete all associated medical centers and staff.')) {
      return;
    }

    try {
      await apiClient.delete(`/organizations/${id}`);
      setOrganizations(organizations.filter(o => o.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete organization');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.put(`/organizations/${id}`, { isActive: !currentStatus });
      setOrganizations(organizations.map(o => 
        o.id === id ? { ...o, isActive: !currentStatus } : o
      ));
    } catch (err: any) {
      alert(err.message || 'Failed to update organization status');
    }
  };

  if (loading || authLoading) {
    return (
      <MainLayout>
        <div className="container max-w-7xl px-4 py-8">
          <p>Loading organizations...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Medical Organizations</h1>
            <p className="text-muted-foreground">Manage medical organizations in the system</p>
          </div>
          <Link href="/admin/organizations/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {organizations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No organizations yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first medical organization
              </p>
              <Link href="/admin/organizations/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Organization
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map((org) => (
              <Card key={org.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                      {org.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {org.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant={org.isActive ? 'default' : 'secondary'}>
                      {org.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Stats */}
                  {org._count && (
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">{org._count.medicalCenters}</span> centers
                      </div>
                      <div>
                        <span className="font-medium">{org._count.staff}</span> staff
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2">
                    {org.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{org.email}</span>
                      </div>
                    )}
                    {org.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{org.phone}</span>
                      </div>
                    )}
                    {org.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {org.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/admin/organizations/${org.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">
                        Manage
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

