'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Mail, Phone, Globe } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  isActive: boolean;
  _count?: {
    medicalCenters: number;
    staff: number;
  };
}

export default function MyOrganizationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [error, setError] = useState('');

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
      loadOrganization();
    }
  }, [user, authLoading, router]);

  const loadOrganization = async () => {
    try {
      // Get staff profile to find organization ID
      const staffRes = await apiClient.get<{ data: any }>('/users/me/staff-profile');
      
      if (!staffRes.data.organizationId) {
        setError('No organization assigned to your account');
        setLoading(false);
        return;
      }

      // Get organization details
      const orgRes = await apiClient.get<{ data: Organization }>(`/organizations/${staffRes.data.organizationId}`);
      setOrganization(orgRes.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load organization');
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-8">
          <p>Loading organization...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !organization) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Organization not found'}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Organization</h1>
          <p className="text-muted-foreground mt-2">
            Organization information and overview
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {organization.name}
            </CardTitle>
            {organization.description && (
              <CardDescription>{organization.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {organization._count && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Medical Centers</p>
                  <p className="text-2xl font-bold">{organization._count.medicalCenters}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Staff Members</p>
                  <p className="text-2xl font-bold">{organization._count.staff}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold">Contact Information</h3>
              
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
      </div>
    </MainLayout>
  );
}

