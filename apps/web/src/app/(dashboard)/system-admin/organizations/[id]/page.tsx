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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Mail, Phone, Globe, Edit, Save, X, UserPlus, Archive, Users } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  isActive: boolean;
  staff: Array<{
    id: string;
    firstName: string;
    lastName: string;
    position?: string;
    user: {
      id: string;
      email: string;
      isActive: boolean;
      role: {
        name: string;
        code: string;
      };
    };
  }>;
  medicalCenters: Array<{
    id: string;
    name: string;
    city: string;
    isActive: boolean;
  }>;
  _count?: {
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
  const [success, setSuccess] = useState('');
  
  // Organization editing
  const [editingOrg, setEditingOrg] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);
  const [orgFormData, setOrgFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    website: '',
  });

  // Staff management
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [addingStaff, setAddingStaff] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    position: '',
    roleCode: 'admin',
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role?.code !== 'system_admin') {
        router.push('/dashboard');
      } else {
        loadOrganization();
      }
    }
  }, [user, authLoading, router, params.id]);

  const loadOrganization = async () => {
    try {
      const res = await apiClient.get<{ data: Organization }>(`/organizations/${params.id}`);
      setOrganization(res.data);
      
      setOrgFormData({
        name: res.data.name,
        description: res.data.description || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        website: res.data.website || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load organization');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrganization = async () => {
    if (!organization) return;
    
    setError('');
    setSuccess('');
    setSavingOrg(true);

    try {
      await apiClient.put(`/organizations/${organization.id}`, orgFormData);
      setSuccess('Organization updated successfully!');
      setEditingOrg(false);
      loadOrganization();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update organization');
    } finally {
      setSavingOrg(false);
    }
  };

  const handleAddStaff = async () => {
    if (!organization) return;

    setError('');
    setAddingStaff(true);

    try {
      await apiClient.post('/staff/admin/create', {
        ...newStaffData,
        organizationId: organization.id,
      });

      setSuccess('Staff member added successfully!');
      setAddStaffOpen(false);
      setNewStaffData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        position: '',
        roleCode: 'admin',
      });
      loadOrganization();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add staff member');
    } finally {
      setAddingStaff(false);
    }
  };

  const handleArchiveStaff = async (staffId: string) => {
    if (!confirm('Archive this staff member? They will no longer have access.')) {
      return;
    }

    try {
      await apiClient.put(`/staff/admin/${staffId}`, { isActive: false });
      setSuccess('Staff member archived successfully!');
      loadOrganization();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to archive staff member');
    }
  };

  const handleActivateStaff = async (staffId: string) => {
    try {
      await apiClient.put(`/staff/admin/${staffId}`, { isActive: true });
      setSuccess('Staff member activated successfully!');
      loadOrganization();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to activate staff member');
    }
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <p>Loading organization...</p>
        </div>
      </MainLayout>
    );
  }

  if (!organization) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Organization not found</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{organization.name}</h1>
            <p className="text-muted-foreground mt-2">
              Manage organization details and staff
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/system-admin/organizations')}>
            Back to Organizations
          </Button>
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

        {/* Organization Information - будет добавлено в следующем шаге */}
        {/* Staff Management - будет добавлено в следующем шаге */}
        {/* Medical Centers - будет добавлено в следующем шаге */}
      </div>
    </MainLayout>
  );
}

