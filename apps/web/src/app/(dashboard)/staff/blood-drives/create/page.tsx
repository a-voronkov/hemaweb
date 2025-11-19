'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface BloodTypeRef {
  id: string;
  code: string;
  name: string;
}

interface BloodDriveTypeRef {
  id: string;
  code: string;
  name: string;
}

interface MedicalCenter {
  id: string;
  name: string;
  city: string;
  address: string;
}

export default function CreateBloodDrivePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [bloodTypes, setBloodTypes] = useState<BloodTypeRef[]>([]);
  const [driveTypes, setDriveTypes] = useState<BloodDriveTypeRef[]>([]);
  const [medicalCenters, setMedicalCenters] = useState<MedicalCenter[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medicalCenterId: '',
    address: '',
    city: '',
    typeCode: 'scheduled',
    startDateTime: '',
    endDateTime: '',
    targetDonors: '50',
    radiusKm: '10',
    bloodTypesNeeded: [] as string[],
  });

  useEffect(() => {
    loadReferenceData();
  }, [user]);

  const loadReferenceData = async () => {
    try {
      // Check if user is admin
      const userIsAdmin = user?.role?.code === 'admin' || user?.role?.code === 'super_admin';
      setIsAdmin(userIsAdmin);

      const requests = [
        apiClient.get<{ data: BloodTypeRef[] }>('/reference/blood-types'),
        apiClient.get<{ data: BloodDriveTypeRef[] }>('/reference/blood-drive-types'),
      ];

      // If admin, load all medical centers; if staff, load only their center
      if (userIsAdmin) {
        requests.push(apiClient.get<{ data: MedicalCenter[] }>('/medical-centers'));
      } else {
        requests.push(apiClient.get<{ data: MedicalCenter }>('/medical-centers/staff/my-center'));
      }

      const [bloodTypesRes, driveTypesRes, centersRes] = await Promise.all(requests);

      setBloodTypes(bloodTypesRes.data || []);
      setDriveTypes(driveTypesRes.data || []);

      if (userIsAdmin) {
        setMedicalCenters(centersRes.data as MedicalCenter[]);
      } else {
        const myCenter = centersRes.data as MedicalCenter;
        setMedicalCenters([myCenter]);
        setFormData(prev => ({
          ...prev,
          medicalCenterId: myCenter.id,
          address: myCenter.address,
          city: myCenter.city,
        }));
      }
    } catch (err) {
      console.error('Failed to load reference data:', err);
    }
  };

  const handleBloodTypeToggle = (code: string) => {
    setFormData(prev => ({
      ...prev,
      bloodTypesNeeded: prev.bloodTypesNeeded.includes(code)
        ? prev.bloodTypesNeeded.filter(c => c !== code)
        : [...prev.bloodTypesNeeded, code],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiClient.post('/blood-drives', {
        ...formData,
        targetDonors: parseInt(formData.targetDonors),
        radiusKm: parseFloat(formData.radiusKm),
      });

      setSuccess('Blood drive created successfully!');
      
      setTimeout(() => {
        router.push('/staff/blood-drives');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create blood drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl px-4 py-8">
        <div className="mb-6">
          <Link href="/staff" className="text-sm text-primary hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create Blood Drive</CardTitle>
            <CardDescription>
              Schedule a new blood drive at your medical center
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded-md">
                  {success}
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                {isAdmin && (
                  <div className="space-y-2">
                    <Label htmlFor="medicalCenter">Medical Center *</Label>
                    <Select
                      value={formData.medicalCenterId}
                      onValueChange={(value) => {
                        const center = medicalCenters.find(c => c.id === value);
                        setFormData({
                          ...formData,
                          medicalCenterId: value,
                          address: center?.address || '',
                          city: center?.city || '',
                        });
                      }}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select medical center" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicalCenters.map((center) => (
                          <SelectItem key={center.id} value={center.id}>
                            {center.name} - {center.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Emergency Blood Drive - O Negative Needed"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about the blood drive..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={loading}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      disabled={loading || !isAdmin}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      disabled={loading || !isAdmin}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.typeCode}
                    onValueChange={(value) => setFormData({ ...formData, typeCode: value })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {driveTypes.map((type) => (
                        <SelectItem key={type.id} value={type.code}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Schedule</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDateTime">Start Date & Time *</Label>
                    <Input
                      id="startDateTime"
                      type="datetime-local"
                      value={formData.startDateTime}
                      onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDateTime">End Date & Time *</Label>
                    <Input
                      id="endDateTime"
                      type="datetime-local"
                      value={formData.endDateTime}
                      onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Blood Types Needed */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Blood Types Needed</h3>
                <p className="text-sm text-muted-foreground">
                  Select the blood types you need (leave empty for all types)
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bloodTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`blood-type-${type.code}`}
                        checked={formData.bloodTypesNeeded.includes(type.code)}
                        onCheckedChange={() => handleBloodTypeToggle(type.code)}
                        disabled={loading}
                      />
                      <Label
                        htmlFor={`blood-type-${type.code}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetDonors">Target Donors</Label>
                    <Input
                      id="targetDonors"
                      type="number"
                      min="1"
                      value={formData.targetDonors}
                      onChange={(e) => setFormData({ ...formData, targetDonors: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="radiusKm">Notification Radius (km)</Label>
                    <Input
                      id="radiusKm"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.radiusKm}
                      onChange={(e) => setFormData({ ...formData, radiusKm: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Blood Drive'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/staff')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

