'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

interface EligibilityStatus {
  isEligible: boolean;
  reason: string;
  message: string;
  nextEligibleDate: string | null;
  daysUntilEligible: number | null;
  lastDonationDate?: string | null;
}

export function EligibilityStatus() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<EligibilityStatus | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEligibility();
  }, []);

  const loadEligibility = async () => {
    try {
      const res = await apiClient.get<EligibilityStatus>('/users/me/eligibility');
      setStatus(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load eligibility status');
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

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Loading eligibility status...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !status) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">{error || 'Unable to load eligibility status'}</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    if (status.isEligible) {
      return <CheckCircle2 className="h-8 w-8 text-green-600" />;
    }
    if (status.reason === 'not_verified') {
      return <AlertCircle className="h-8 w-8 text-yellow-600" />;
    }
    if (status.reason === 'cooldown_period') {
      return <Clock className="h-8 w-8 text-blue-600" />;
    }
    return <XCircle className="h-8 w-8 text-red-600" />;
  };

  const getStatusColor = () => {
    if (status.isEligible) return 'bg-green-100 text-green-800';
    if (status.reason === 'not_verified') return 'bg-yellow-100 text-yellow-800';
    if (status.reason === 'cooldown_period') return 'bg-blue-100 text-blue-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = () => {
    if (status.isEligible) return 'Eligible to Donate';
    if (status.reason === 'not_verified') return 'Not Verified';
    if (status.reason === 'cooldown_period') return 'Cooldown Period';
    return 'Not Eligible';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Donation Eligibility</CardTitle>
        <CardDescription>Your current eligibility status for blood donation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">{getStatusIcon()}</div>
          <div className="flex-1">
            <div className="mb-3">
              <Badge className={getStatusColor()}>{getStatusText()}</Badge>
            </div>
            <p className="text-base mb-4">{status.message}</p>

            {status.reason === 'cooldown_period' && status.daysUntilEligible !== null && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Days Until Eligible:</span>
                  <span className="text-2xl font-bold">{status.daysUntilEligible}</span>
                </div>
                {status.nextEligibleDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Next Eligible Date:</span>
                    <span className="text-sm">{formatDate(status.nextEligibleDate)}</span>
                  </div>
                )}
                {status.lastDonationDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Last Donation:</span>
                    <span className="text-sm">{formatDate(status.lastDonationDate)}</span>
                  </div>
                )}
              </div>
            )}

            {status.reason === 'not_verified' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Please visit a medical center to get verified as a blood donor before you can
                  donate.
                </p>
              </div>
            )}

            {status.isEligible && status.reason === 'eligible' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  You are eligible to donate blood! Find a blood drive near you and make a
                  difference.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

