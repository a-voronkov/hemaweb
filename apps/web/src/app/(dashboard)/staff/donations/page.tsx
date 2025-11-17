'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';

export default function DonationsListPage() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<any[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDonations();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = donations.filter(donation => {
        const donor = donation.user;
        const profile = donor?.profile;
        const searchLower = searchQuery.toLowerCase();
        
        return (
          donor?.email?.toLowerCase().includes(searchLower) ||
          profile?.firstName?.toLowerCase().includes(searchLower) ||
          profile?.lastName?.toLowerCase().includes(searchLower) ||
          donation.bloodType?.name?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredDonations(filtered);
    } else {
      setFilteredDonations(donations);
    }
  }, [searchQuery, donations]);

  const loadDonations = async () => {
    try {
      const response = await apiClient.get('/medical-centers/staff/donations');
      setDonations(response.data || []);
      setFilteredDonations(response.data || []);
    } catch (err) {
      console.error('Failed to load donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalVolume = () => {
    return filteredDonations.reduce((sum, d) => sum + (d.volumeMl || 0), 0);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8">
        <div className="mb-6">
          <Link href="/staff" className="text-sm text-primary hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Donation Records</CardTitle>
            <CardDescription>
              History of all blood donations at your medical center
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <Input
                placeholder="Search by donor name, email, or blood type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Donations List */}
            {filteredDonations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No donations found matching your search' : 'No donation records yet'}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDonations.map((donation) => {
                  const donor = donation.user;
                  const profile = donor?.profile;
                  
                  return (
                    <div
                      key={donation.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="font-semibold">
                            {profile?.firstName} {profile?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {donor?.email}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm">
                            <span className="font-medium">Blood Type:</span>{' '}
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                              {donation.bloodType?.name}
                            </span>
                          </div>
                          <div className="text-sm mt-1">
                            <span className="font-medium">Volume:</span> {donation.volumeMl} ml
                          </div>
                        </div>

                        <div>
                          <div className="text-sm">
                            <span className="font-medium">Date:</span>{' '}
                            {formatDate(donation.donatedAt)}
                          </div>
                        </div>

                        <div className="flex items-center justify-end">
                          <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            Recorded
                          </div>
                        </div>
                      </div>

                      {donation.notes && (
                        <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                          <span className="font-medium">Notes:</span> {donation.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary */}
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Donations:</span>{' '}
                  {filteredDonations.length}
                </div>
                <div>
                  <span className="font-medium">Total Volume:</span>{' '}
                  {getTotalVolume().toLocaleString()} ml
                </div>
                <div className="text-muted-foreground">
                  Showing {filteredDonations.length} of {donations.length} records
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

