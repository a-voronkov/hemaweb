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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={newAdminData.firstName}
                      onChange={(e) => setNewAdminData({ ...newAdminData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={newAdminData.lastName}
                      onChange={(e) => setNewAdminData({ ...newAdminData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={newAdminData.email}
                    onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Password *</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={newAdminData.password}
                    onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddAdmin} disabled={addingAdmin} className="flex-1">
                    {addingAdmin ? 'Creating...' : 'Create System Admin'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAddAdminOpen(false)}
                    disabled={addingAdmin}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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

        {/* System Admins List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              System Administrators ({admins.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {admins.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No system administrators yet</p>
                <p className="text-sm mt-1">Add your first system admin to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {admin.systemAdmin ? `${admin.systemAdmin.firstName} ${admin.systemAdmin.lastName}` : 'Unknown'}
                        </p>
                        <Badge variant={admin.isActive ? 'default' : 'secondary'}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {admin.isVerified && (
                          <Badge variant="outline">Verified</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created: {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(admin.id, admin.isActive)}
                      >
                        {admin.isActive ? (
                          <>
                            <Archive className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
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

