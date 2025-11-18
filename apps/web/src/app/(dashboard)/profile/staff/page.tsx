'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Mail, Phone, User, Briefcase } from 'lucide-react';

interface StaffProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  position?: string;
  licenseNumber?: string;
  medicalCenter?: {
    id: string;
    name: string;
    address: string;
    city: string;
    phone?: string;
    email?: string;
    organization: {
      id: string;
      name: string;
    };
  };
  organization?: {
    id: string;
    name: string;
    description?: string;
    website?: string;
    email?: string;
    phone?: string;
  };
}

export default function StaffProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    position: '',
    licenseNumber: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      // Check if user is staff/admin/super_admin
      const allowedRoles = ['staff', 'admin', 'super_admin', 'system_admin'];
      if (!user.role || !allowedRoles.includes(user.role.code)) {
        router.push('/profile');
        return;
      }

      loadProfile();
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    try {
      const response = await apiClient.get<{ data: StaffProfile }>('/users/me/staff-profile');
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        phone: response.data.phone || '',
        position: response.data.position || '',
        licenseNumber: response.data.licenseNumber || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await apiClient.put('/users/me/staff-profile', formData);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        loadProfile();
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  const isSuperAdmin = user?.role?.code === 'super_admin';
  const isSystemAdmin = user?.role?.code === 'system_admin';

  return (
    <MainLayout>
      <div className="container max-w-4xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Staff Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your professional information
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {/* Organization/Center Info */}
        {(isSuperAdmin || isSystemAdmin) && profile?.organization && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{profile.organization.name}</p>
              </div>
              {profile.organization.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p>{profile.organization.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {profile.organization.email && (
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {profile.organization.email}
                    </p>
                  </div>
                )}
                {profile.organization.phone && (
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {profile.organization.phone}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!isSuperAdmin && !isSystemAdmin && profile?.medicalCenter && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Medical Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{profile.medicalCenter.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Organization</Label>
                <p>{profile.medicalCenter.organization.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Address</Label>
                <p>{profile.medicalCenter.address}, {profile.medicalCenter.city}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {profile.medicalCenter.email && (
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {profile.medicalCenter.email}
                    </p>
                  </div>
                )}
                {profile.medicalCenter.phone && (
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {profile.medicalCenter.phone}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personal Info Form */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your professional details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+66-XX-XXX-XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position/Title</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., Blood Bank Manager"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Medical License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="Optional"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/settings/security')}
                >
                  Security Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

