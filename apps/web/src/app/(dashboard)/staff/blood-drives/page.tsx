'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';

export default function BloodDrivesListPage() {
  const [loading, setLoading] = useState(true);
  const [bloodDrives, setBloodDrives] = useState<any[]>([]);
  const [center, setCenter] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [centerRes, drivesRes] = await Promise.all([
        apiClient.get('/medical-centers/staff/my-center'),
        apiClient.get('/blood-drives'),
      ]);

      setCenter(centerRes.data);
      
      // Filter drives for this center
      const centerDrives = (drivesRes.data || []).filter(
        (drive: any) => drive.medicalCenterId === centerRes.data.id
      );
      setBloodDrives(centerDrives);
    } catch (err) {
      console.error('Failed to load blood drives:', err);
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

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <div className="mb-6 flex items-center justify-between">
          <Link href="/staff" className="text-sm text-primary hover:underline">
            ← Back to Dashboard
          </Link>
          <Link href="/staff/blood-drives/create">
            <Button>Create Blood Drive</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Blood Drives</CardTitle>
            <CardDescription>
              Manage blood drives at {center?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bloodDrives.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No blood drives yet</p>
                <Link href="/staff/blood-drives/create">
                  <Button>Create Your First Blood Drive</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bloodDrives.map((drive) => (
                  <div
                    key={drive.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{drive.title}</h3>
                        {drive.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {drive.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(drive.status?.code)}`}>
                          {drive.status?.name}
                        </span>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          {drive.type?.name}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Start:</span>{' '}
                        {formatDate(drive.startDateTime)}
                      </div>
                      <div>
                        <span className="font-medium">End:</span>{' '}
                        {drive.endDateTime ? formatDate(drive.endDateTime) : 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Target:</span>{' '}
                        {drive.targetDonors || 'N/A'} donors
                      </div>
                    </div>

                    {drive.bloodTypesNeeded && drive.bloodTypesNeeded.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-sm font-medium">Blood Types Needed: </span>
                        <div className="flex gap-2 mt-2">
                          {drive.bloodTypesNeeded.map((bt: any) => (
                            <span
                              key={bt.id}
                              className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded"
                            >
                              {bt.bloodType.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <Link href={`/staff/blood-drives/${drive.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/staff/blood-drives/${drive.id}/registrations`}>
                        <Button variant="outline" size="sm">
                          View Registrations
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            {bloodDrives.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  Total: {bloodDrives.length} blood drive{bloodDrives.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

