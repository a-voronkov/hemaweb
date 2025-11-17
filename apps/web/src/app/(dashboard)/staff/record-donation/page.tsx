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
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';

export default function RecordDonationPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [searchEmail, setSearchEmail] = useState('');
  const [donor, setDonor] = useState<any>(null);
  const [center, setCenter] = useState<any>(null);
  const [bloodTypes, setBloodTypes] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    bloodTypeId: '',
    volumeMl: '450',
    notes: '',
  });

  useEffect(() => {
    loadBloodTypes();
  }, []);

  const loadBloodTypes = async () => {
    try {
      const response = await apiClient.get<{ data: any[] }>('/reference/blood-types');
      setBloodTypes(response.data || []);
    } catch (err) {
      console.error('Failed to load blood types:', err);
    }
  };

  const searchDonor = async () => {
    if (!searchEmail) {
      setError('Please enter donor email');
      return;
    }

    setSearching(true);
    setError('');
    setDonor(null);

    try {
      const response = await apiClient.get<{ data: any[] }>(`/users/search?email=${searchEmail}`);
      const users = response.data || [];

      if (users.length === 0) {
        setError('Donor not found');
        return;
      }

      const foundUser = users[0];
      
      if (foundUser.role?.code !== 'donor') {
        setError('User is not a donor');
        return;
      }

      if (!foundUser.profile?.isDonorVerified) {
        setError('Donor must be verified before donating');
        return;
      }

      setDonor(foundUser);
      
      // Pre-fill blood type if available
      if (foundUser.profile?.bloodTypeId) {
        setFormData(prev => ({ ...prev, bloodTypeId: foundUser.profile.bloodTypeId }));
      }
      
      // Get staff's center
      if (!center) {
        const centerRes = await apiClient.get<{ data: any }>('/medical-centers/staff/my-center');
        setCenter(centerRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search donor');
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async () => {
    if (!donor || !center) {
      setError('Donor or center information missing');
      return;
    }

    if (!formData.bloodTypeId) {
      setError('Please select blood type');
      return;
    }

    if (!formData.volumeMl || parseInt(formData.volumeMl) <= 0) {
      setError('Please enter valid volume');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiClient.post('/medical-centers/record-donation', {
        donorUserId: donor.id,
        medicalCenterId: center.id,
        bloodTypeId: formData.bloodTypeId,
        volumeMl: parseInt(formData.volumeMl),
        notes: formData.notes || undefined,
      });

      setSuccess('Donation recorded successfully!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setDonor(null);
        setSearchEmail('');
        setFormData({
          bloodTypeId: '',
          volumeMl: '450',
          notes: '',
        });
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to record donation');
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
            <CardTitle className="text-2xl font-bold">Record Donation</CardTitle>
            <CardDescription>
              Record a blood donation from a verified donor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {/* Search Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Search Donor</h3>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="email">Donor Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="donor@example.com"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchDonor()}
                    disabled={searching || loading}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={searchDonor}
                    disabled={searching || loading}
                  >
                    {searching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Donor Information */}
            {donor && (
              <>
                <div className="space-y-4 p-4 border rounded-md bg-muted/50">
                  <h3 className="text-lg font-semibold">Donor Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>{' '}
                      {donor.profile?.firstName} {donor.profile?.lastName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {donor.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>{' '}
                      {donor.profile?.phone || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Blood Type:</span>{' '}
                      {donor.profile?.bloodType?.name || 'Not set'}
                    </div>
                  </div>
                </div>

                {/* Donation Form */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Donation Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type *</Label>
                    <Select
                      value={formData.bloodTypeId}
                      onValueChange={(value) => setFormData({ ...formData, bloodTypeId: value })}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume (ml) *</Label>
                    <Input
                      id="volume"
                      type="number"
                      min="1"
                      max="1000"
                      value={formData.volumeMl}
                      onChange={(e) => setFormData({ ...formData, volumeMl: e.target.value })}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Standard donation: 450ml
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any relevant notes..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      disabled={loading}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Recording...' : 'Record Donation'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

