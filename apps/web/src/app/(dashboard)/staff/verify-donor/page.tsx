'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function VerifyDonorPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [searchEmail, setSearchEmail] = useState('');
  const [donor, setDonor] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [center, setCenter] = useState<any>(null);

  const searchDonor = async () => {
    if (!searchEmail) {
      setError('Please enter donor email');
      return;
    }

    setSearching(true);
    setError('');
    setDonor(null);

    try {
      // Search for user by email
      const response = await apiClient.get<{ data: any[] }>(`/users/search?email=${searchEmail}`);
      const users = response.data || [];

      if (users.length === 0) {
        setError('Donor not found');
        return;
      }

      const foundUser = users[0];
      
      // Check if user is a donor
      if (foundUser.role?.code !== 'donor') {
        setError('User is not a donor');
        return;
      }

      setDonor(foundUser);
      
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

  const handleVerify = async () => {
    if (!donor || !center) {
      setError('Donor or center information missing');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiClient.post('/medical-centers/verify-donor', {
        donorUserId: donor.id,
        medicalCenterId: center.id,
        notes: notes || undefined,
      });

      setSuccess('Donor verified successfully!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setDonor(null);
        setSearchEmail('');
        setNotes('');
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to verify donor');
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
            <CardTitle className="text-2xl font-bold">Verify Donor</CardTitle>
            <CardDescription>
              Search for a donor and verify their eligibility to donate blood
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
                  <div className="col-span-2">
                    <span className="font-medium">Verification Status:</span>{' '}
                    <span className={donor.profile?.isDonorVerified ? 'text-green-600' : 'text-orange-600'}>
                      {donor.profile?.isDonorVerified ? 'Already Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>

                {donor.profile?.isDonorVerified && (
                  <div className="p-3 text-sm bg-blue-50 text-blue-800 border border-blue-200 rounded-md">
                    This donor is already verified. You can still proceed to update verification records.
                  </div>
                )}
              </div>
            )}

            {/* Verification Form */}
            {donor && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Verification Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any relevant notes about the verification..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={loading}
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleVerify}
                  className="w-full"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? 'Verifying...' : 'Verify Donor'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

