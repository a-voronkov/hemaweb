'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';

export default function DonorsListPage() {
  const [loading, setLoading] = useState(true);
  const [donors, setDonors] = useState<any[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDonors();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = donors.filter(verification => {
        const donor = verification.user;
        const profile = donor?.profile;
        const searchLower = searchQuery.toLowerCase();
        
        return (
          donor?.email?.toLowerCase().includes(searchLower) ||
          profile?.firstName?.toLowerCase().includes(searchLower) ||
          profile?.lastName?.toLowerCase().includes(searchLower) ||
          profile?.phone?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredDonors(filtered);
    } else {
      setFilteredDonors(donors);
    }
  }, [searchQuery, donors]);

  const loadDonors = async () => {
    try {
      const response = await apiClient.get<{ data: any[] }>('/medical-centers/staff/donors');
      setDonors(response.data || []);
      setFilteredDonors(response.data || []);
    } catch (err) {
      console.error('Failed to load donors:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            <CardTitle className="text-2xl font-bold">Verified Donors</CardTitle>
            <CardDescription>
              List of all donors verified at your medical center
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Donors List */}
            {filteredDonors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No donors found matching your search' : 'No verified donors yet'}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDonors.map((verification) => {
                  const donor = verification.user;
                  const profile = donor?.profile;
                  
                  return (
                    <div
                      key={verification.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="font-semibold">
                            {profile?.firstName} {profile?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {donor?.email}
                          </div>
                          {profile?.phone && (
                            <div className="text-sm text-muted-foreground">
                              {profile.phone}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-sm">
                            <span className="font-medium">Blood Type:</span>{' '}
                            {profile?.bloodType?.name || 'Not set'}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Verified:</span>{' '}
                            {formatDate(verification.verifiedAt)}
                          </div>
                        </div>

                        <div className="flex items-center justify-end">
                          <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Verified
                          </div>
                        </div>
                      </div>

                      {verification.notes && (
                        <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                          <span className="font-medium">Notes:</span> {verification.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary */}
            <div className="mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {filteredDonors.length} of {donors.length} verified donors
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

