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
import { Building2, MapPin, Phone, Mail } from 'lucide-react';

interface MedicalCenter {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  organization: {
    id: string;
    name: string;
  };
}

export default function MedicalCentersManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [centers, setCenters] = useState<MedicalCenter[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && !['admin', 'super_admin', 'system_admin'].includes(user.role?.code || '')) {
      router.push('/');
      return;
    }

    if (user) {
      loadCenters();
    }
  }, [user, authLoading, router]);

  const loadCenters = async () => {
    try {
      const res = await apiClient.get<{ data: MedicalCenter[] }>('/medical-centers');
      setCenters(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load medical centers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medical center?')) {
      return;
    }

    try {
      await apiClient.delete(`/medical-centers/admin/${id}`);
      setCenters(centers.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete medical center');
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

  return (
    <MainLayout>
      <div className="container max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Medical Centers</h1>
            <p className="text-muted-foreground">Manage medical centers in the system</p>
          </div>
          <Link href="/admin/medical-centers/create">
            <Button>
              <Building2 className="h-4 w-4 mr-2" />
              Add Medical Center
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {centers.map((center) => (
            <Card key={center.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{center.name}</CardTitle>
                    <CardDescription>{center.organization.name}</CardDescription>
                  </div>
                  <Badge variant={center.isActive ? 'default' : 'secondary'}>
                    {center.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {center.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">
                      {center.address}
                      {center.city && `, ${center.city}`}
                    </span>
                  </div>
                )}
                {center.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{center.phone}</span>
                  </div>
                )}
                {center.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{center.email}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Link href={`/admin/medical-centers/${center.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(center.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {centers.length === 0 && !loading && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No medical centers found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

