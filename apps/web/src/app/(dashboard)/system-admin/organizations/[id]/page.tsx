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

        {/* Organization Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization Information
                </CardTitle>
                <CardDescription>Basic information about the organization</CardDescription>
              </div>
              {!editingOrg ? (
                <Button variant="outline" onClick={() => setEditingOrg(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSaveOrganization} disabled={savingOrg}>
                    <Save className="h-4 w-4 mr-2" />
                    {savingOrg ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingOrg(false);
                      setOrgFormData({
                        name: organization.name,
                        description: organization.description || '',
                        email: organization.email || '',
                        phone: organization.phone || '',
                        website: organization.website || '',
                      });
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {editingOrg ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    value={orgFormData.name}
                    onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={orgFormData.description}
                    onChange={(e) => setOrgFormData({ ...orgFormData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={orgFormData.email}
                      onChange={(e) => setOrgFormData({ ...orgFormData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={orgFormData.phone}
                      onChange={(e) => setOrgFormData({ ...orgFormData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={orgFormData.website}
                    onChange={(e) => setOrgFormData({ ...orgFormData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-2xl font-bold">{organization.name}</h3>
                  {organization.description && (
                    <p className="text-muted-foreground mt-1">{organization.description}</p>
                  )}
                </div>

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
              </>
            )}
          </CardContent>
        </Card>

        {/* Staff Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Staff Members ({organization.staff.length})
                </CardTitle>
                <CardDescription>Manage organization staff and their access</CardDescription>
              </div>
              <Dialog open={addStaffOpen} onOpenChange={setAddStaffOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Staff
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>
                      Create a new staff account for this organization
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={newStaffData.firstName}
                          onChange={(e) => setNewStaffData({ ...newStaffData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={newStaffData.lastName}
                          onChange={(e) => setNewStaffData({ ...newStaffData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="staffEmail">Email *</Label>
                      <Input
                        id="staffEmail"
                        type="email"
                        value={newStaffData.email}
                        onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newStaffData.password}
                        onChange={(e) => setNewStaffData({ ...newStaffData, password: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={newStaffData.position}
                        onChange={(e) => setNewStaffData({ ...newStaffData, position: e.target.value })}
                        placeholder="e.g., Nurse, Lab Technician"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roleCode">Role *</Label>
                      <select
                        id="roleCode"
                        value={newStaffData.roleCode}
                        onChange={(e) => setNewStaffData({ ...newStaffData, roleCode: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="admin">Admin (Medical Center)</option>
                        <option value="super_admin">Super Admin (Organization)</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddStaff} disabled={addingStaff} className="flex-1">
                        {addingStaff ? 'Adding...' : 'Add Staff Member'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setAddStaffOpen(false)}
                        disabled={addingStaff}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {organization.staff.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No staff members yet</p>
                <p className="text-sm mt-1">Add your first staff member to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {organization.staff.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {staff.firstName} {staff.lastName}
                        </p>
                        <Badge variant={staff.user.isActive ? 'default' : 'secondary'}>
                          {staff.user.isActive ? 'Active' : 'Archived'}
                        </Badge>
                        <Badge variant="outline">{staff.user.role.name}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{staff.user.email}</p>
                      {staff.position && (
                        <p className="text-sm text-muted-foreground">{staff.position}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {staff.user.isActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleArchiveStaff(staff.id)}
                        >
                          <Archive className="h-4 w-4 mr-1" />
                          Archive
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivateStaff(staff.id)}
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medical Centers */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Centers ({organization.medicalCenters.length})</CardTitle>
            <CardDescription>Medical centers belonging to this organization</CardDescription>
          </CardHeader>
          <CardContent>
            {organization.medicalCenters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No medical centers yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {organization.medicalCenters.map((center) => (
                  <div
                    key={center.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{center.name}</p>
                      <p className="text-sm text-muted-foreground">{center.city}</p>
                    </div>
                    <Badge variant={center.isActive ? 'default' : 'secondary'}>
                      {center.isActive ? 'Active' : 'Inactive'}
                    </Badge>
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

