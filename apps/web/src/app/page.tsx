'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Save Lives Through
              <span className="text-primary"> Blood Donation</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with hospitals and medical centers across Thailand.
              Find blood drives, track your donations, and make a difference.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">Sign In</Button>
                </Link>
              </div>
            ) : (
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create your account and complete your donor profile</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle>Get Verified</CardTitle>
                <CardDescription>Visit a partner hospital to verify your donor eligibility</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <CardTitle>Donate</CardTitle>
                <CardDescription>Find nearby blood drives and start saving lives</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Registered Donors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Partner Hospitals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-muted-foreground">Lives Saved</div>
            </div>
          </div>
        </div>
      </section>

      {!user && (
        <section className="py-20">
          <div className="container px-4">
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <CardTitle className="text-3xl">Ready to Make a Difference?</CardTitle>
                <CardDescription className="text-lg">Join thousands of donors saving lives across Thailand</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/register">
                  <Button size="lg">Sign Up Now</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
