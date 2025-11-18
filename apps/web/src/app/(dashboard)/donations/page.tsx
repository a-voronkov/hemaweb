'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';

interface DonationRecord {
  id: string;
  donationDate: string;
  volumeMl: number;
  bloodType: {
    code: string;
    name: string;
  };
  medicalCenter: {
    id: string;
    name: string;
    city?: string | null;
    organization: {
      name: string;
    };
  };
  recordedBy?: {
    id: string;
    email: string;
    medicalCenterStaff?: {
      firstName: string;
      lastName: string;
    };
  };
}

interface DonationHistoryResponse {
  data: DonationRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function DonationsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await apiClient.get<DonationHistoryResponse>(
        `/users/me/donations?page=${page}&limit=20`
      );
      setDonations(res.data || []);
      setMeta(res.meta || { total: 0, page: 1, limit: 20, totalPages: 0 });
    } catch (err: any) {
      setError(err.message || 'Failed to load donation history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePageChange = (newPage: number) => {
    loadDonations(newPage);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <p>Loading donation history...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">My Donation History</CardTitle>
            <CardDescription>
              View your complete donation history and track your contributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Statistics */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-3xl font-bold">{meta.total}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-3xl font-bold">
                  {donations.reduce((sum, d) => sum + d.volumeMl, 0)} ml
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Lives Impacted</p>
                <p className="text-3xl font-bold">{meta.total * 3}</p>
                <p className="text-xs text-muted-foreground">Each donation can save up to 3 lives</p>
              </div>
            </div>

            {/* Donation List */}
            {donations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  You haven't made any donations yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Find a blood drive near you and make your first donation!
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {formatDate(donation.donationDate)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {donation.medicalCenter.name}
                            {donation.medicalCenter.city && `, ${donation.medicalCenter.city}`}
                          </p>
                        </div>
                        <Badge variant="destructive" className="text-base">
                          {donation.bloodType.name}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Volume:</span> {donation.volumeMl} ml
                        </div>
                        <div>
                          <span className="font-medium">Organization:</span>{' '}
                          {donation.medicalCenter.organization.name}
                        </div>
                        {donation.recordedBy?.medicalCenterStaff && (
                          <div>
                            <span className="font-medium">Recorded by:</span>{' '}
                            {donation.recordedBy.medicalCenterStaff.firstName}{' '}
                            {donation.recordedBy.medicalCenterStaff.lastName}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {(meta.page - 1) * meta.limit + 1} to{' '}
                      {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} donations
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(meta.page - 1)}
                        disabled={meta.page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(meta.page + 1)}
                        disabled={meta.page === meta.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

