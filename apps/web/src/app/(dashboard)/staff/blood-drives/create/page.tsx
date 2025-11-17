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
import Link from 'next/link';

export default function CreateBloodDrivePage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [bloodTypes, setBloodTypes] = useState<any[]>([]);
  const [driveTypes, setDriveTypes] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    typeCode: 'scheduled',
    startDateTime: '',
    endDateTime: '',
    targetDonors: '50',
    radiusKm: '10',
    bloodTypesNeeded: [] as string[],
  });

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      const [bloodTypesRes, driveTypesRes] = await Promise.all([
        apiClient.get('/reference/blood-types'),
        apiClient.get('/reference/blood-drive-types'),
      ]);
      
      setBloodTypes(bloodTypesRes.data || []);
      setDriveTypes(driveTypesRes.data || []);
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

