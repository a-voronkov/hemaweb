'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: '',
  });
  
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    setPasswordLoading(true);

    try {
      await apiClient.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    if (!emailForm.newEmail || !emailForm.password) {
      setEmailError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.newEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailLoading(true);

    try {
      await apiClient.put('/auth/change-email', {
        newEmail: emailForm.newEmail,
        password: emailForm.password,
      });
      
      setEmailSuccess('Email change request sent! Please check your new email to confirm.');
      setEmailForm({
        newEmail: '',
        password: '',
      });
      
      setTimeout(() => setEmailSuccess(''), 5000);
    } catch (err: any) {
      setEmailError(err.message || 'Failed to change email');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your password and email address
          </p>
        </div>

        {/* Current Email Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Current Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{user.email}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {user.isVerified ? '✓ Verified' : '⚠ Not verified'}
            </p>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md">
                  {passwordSuccess}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password *</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Change Email Address
            </CardTitle>
            <CardDescription>
              Update your email address. You'll need to verify the new email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailChange} className="space-y-4">
              {emailError && (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <span>{emailError}</span>
                </div>
              )}

              {emailSuccess && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md">
                  {emailSuccess}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newEmail">New Email Address *</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                  required
                  autoComplete="email"
                  placeholder="new.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailPassword">Current Password *</Label>
                <Input
                  id="emailPassword"
                  type="password"
                  value={emailForm.password}
                  onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your current password to confirm"
                />
              </div>

              <Button type="submit" disabled={emailLoading}>
                {emailLoading ? 'Sending Request...' : 'Change Email'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Security Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Use a strong, unique password for your account</li>
              <li>Never share your password with anyone</li>
              <li>Change your password regularly</li>
              <li>Use a password manager to keep track of your passwords</li>
              <li>Enable two-factor authentication when available</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

