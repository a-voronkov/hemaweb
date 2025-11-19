'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { UserCog, Plus, Archive, CheckCircle } from 'lucide-react';

interface SystemAdmin {
  id: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  systemAdmin: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

export default function SystemAdminsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<SystemAdmin[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role?.code !== 'system_admin') {
        router.push('/dashboard');
      } else {
        loadAdmins();
      }
    }
  }, [user, authLoading, router]);

  const loadAdmins = async () => {
    try {
      const res = await apiClient.get<{ data: SystemAdmin[] }>('/admin/system-admins');
      setAdmins(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load system admins');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    setError('');
    setAddingAdmin(true);

    try {
      await apiClient.post('/admin/system-admins', newAdminData);
      setSuccess('System admin created successfully!');
      setAddAdminOpen(false);
      setNewAdminData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      });
      loadAdmins();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create system admin');
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleToggleActive = async (adminId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this system admin?`)) {
      return;
    }

    try {
      await apiClient.put(`/admin/system-admins/${adminId}`, { isActive: !currentStatus });
      setSuccess(`System admin ${action}d successfully!`);
      loadAdmins();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || `Failed to ${action} system admin`);
    }
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <p>Loading system admins...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Administrators</h1>
            <p className="text-muted-foreground mt-2">
              Manage platform system administrators
            </p>
          </div>
          <Dialog open={addAdminOpen} onOpenChange={setAddAdminOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add System Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New System Administrator</DialogTitle>
                <DialogDescription>
                  Create a new system admin account with full platform access
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Form fields будут добавлены в следующем шаге */}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </MainLayout>
  );
}

