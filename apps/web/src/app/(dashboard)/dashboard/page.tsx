'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/main-layout';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Redirect based on user role
    const roleCode = user.role?.code;

    switch (roleCode) {
      case 'admin':
      case 'super_admin':
      case 'system_admin':
        router.push('/admin');
        break;
      case 'staff':
        router.push('/staff');
        break;
      case 'donor':
      default:
        router.push('/profile');
        break;
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-7xl px-4 py-8">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl px-4 py-8">
        <p>Redirecting...</p>
      </div>
    </MainLayout>
  );
}

