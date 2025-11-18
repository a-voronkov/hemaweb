'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface NotificationSettings {
  emailNotifications: boolean;
  notifyBloodDrives: boolean;
  notifyEligibility: boolean;
  notificationRadius: number;
  notifyEmergencyOnly: boolean;
  notifyMyBloodTypeOnly: boolean;
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    notifyBloodDrives: true,
    notifyEligibility: true,
    notificationRadius: 10,
    notifyEmergencyOnly: false,
    notifyMyBloodTypeOnly: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadSettings();
    }
  }, [user, authLoading, router]);

  const loadSettings = async () => {
    try {
      const res = await apiClient.get<{ profile: NotificationSettings }>('/users/me/profile');
      if (res.profile) {
        setSettings({
          emailNotifications: res.profile.emailNotifications ?? true,
          notifyBloodDrives: res.profile.notifyBloodDrives ?? true,
          notifyEligibility: res.profile.notifyEligibility ?? true,
          notificationRadius: res.profile.notificationRadius ?? 10,
          notifyEmergencyOnly: res.profile.notifyEmergencyOnly ?? false,
          notifyMyBloodTypeOnly: res.profile.notifyMyBloodTypeOnly ?? false,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await apiClient.put('/users/me/profile', settings);
      setSuccess('Notification settings saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <MainLayout>
        <div className="container max-w-2xl px-4 py-8">
          <p>Loading settings...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-2xl px-4 py-8">
        <div className="mb-6">
          <Link href="/profile" className="text-sm text-primary hover:underline">
            ← Back to Profile
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Notification Settings</CardTitle>
            <CardDescription>
              Manage how and when you receive notifications about blood drives
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

            {/* Email Notifications */}
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>

            {/* Blood Drive Notifications */}
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="notifyBloodDrives">Blood Drive Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about nearby blood drives
                </p>
              </div>
              <Switch
                id="notifyBloodDrives"
                checked={settings.notifyBloodDrives}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notifyBloodDrives: checked })
                }
                disabled={!settings.emailNotifications}
              />
            </div>

            {/* Notification Radius */}
            {settings.notifyBloodDrives && (
              <div className="space-y-2">
                <Label htmlFor="notificationRadius">Notification Radius</Label>
                <Select
                  value={settings.notificationRadius.toString()}
                  onValueChange={(value) =>
                    setSettings({ ...settings, notificationRadius: parseInt(value) })
                  }
                  disabled={!settings.emailNotifications}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 km</SelectItem>
                    <SelectItem value="10">10 km</SelectItem>
                    <SelectItem value="20">20 km</SelectItem>
                    <SelectItem value="50">50 km</SelectItem>
                    <SelectItem value="100">100 km</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Get notified about blood drives within this radius from your location
                </p>
              </div>
            )}

            {/* Emergency Only */}
            {settings.notifyBloodDrives && (
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyEmergencyOnly">Emergency Drives Only</Label>
                  <p className="text-sm text-muted-foreground">
                    Only notify about urgent/emergency blood drives
                  </p>
                </div>
                <Switch
                  id="notifyEmergencyOnly"
                  checked={settings.notifyEmergencyOnly}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifyEmergencyOnly: checked })
                  }
                  disabled={!settings.emailNotifications}
                />
              </div>
            )}

            {/* My Blood Type Only */}
            {settings.notifyBloodDrives && (
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyMyBloodTypeOnly">My Blood Type Only</Label>
                  <p className="text-sm text-muted-foreground">
                    Only notify when my blood type is needed
                  </p>
                </div>
                <Switch
                  id="notifyMyBloodTypeOnly"
                  checked={settings.notifyMyBloodTypeOnly}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifyMyBloodTypeOnly: checked })
                  }
                  disabled={!settings.emailNotifications}
                />
              </div>
            )}

            {/* Eligibility Notifications */}
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="notifyEligibility">Eligibility Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you're eligible to donate again
                </p>
              </div>
              <Switch
                id="notifyEligibility"
                checked={settings.notifyEligibility}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notifyEligibility: checked })
                }
                disabled={!settings.emailNotifications}
              />
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

