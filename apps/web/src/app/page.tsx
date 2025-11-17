'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { user } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background py-20 md:py-32">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              🩸 Connecting Donors with Hospitals
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Save Lives Through Blood Donation
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              HemaWeb connects hospitals and medical centers with verified blood donors across Thailand.
              Find blood drives, track your donations, and make a real difference.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Challenge</h2>
              <p className="text-xl text-muted-foreground">
                Blood donation is critical to healthcare, yet blood banks frequently face shortages
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📉</span>
                    Low Donation Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    In Thailand, less than 3% of the population donates blood, far below WHO recommendations.
                    Only a small fraction of daily blood demand is met.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    Limited Awareness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Donors struggle to find donation opportunities due to low awareness,
                    lack of convenient donation points, and limited understanding of the process.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">😰</span>
                    Fear & Misinformation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Misinformation and stigma about blood donation and its risks discourage participation.
                    New donors lack guidance on how to start.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📅</span>
                    No Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Existing donors often forget when they're eligible to donate again,
                    missing opportunities to help save lives.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Solution</h2>
            <p className="text-xl text-muted-foreground">
              HemaWeb addresses these barriers with a comprehensive platform that makes blood donation easy,
              accessible, and rewarding
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <CardTitle className="text-center">1. Register</CardTitle>
                <CardDescription className="text-center">
                  Create your account and complete your donor profile with blood type and location
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-center">2. Get Verified</CardTitle>
                <CardDescription className="text-center">
                  Visit a partner hospital to verify your eligibility and become a certified donor
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <CardTitle className="text-center">3. Donate & Save Lives</CardTitle>
                <CardDescription className="text-center">
                  Find nearby blood drives, receive notifications, and track your donation history
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features for Donors */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">For Donors</h2>
            <p className="text-xl text-muted-foreground text-center mb-12">
              Everything you need to become an active, engaged blood donor
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🗺️</span>
                    Find Nearby Blood Drives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Search for blood drives and emergency requests near you using location-aware features.
                    See which drives match your blood type.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🔔</span>
                    Smart Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Receive targeted alerts about nearby donation opportunities and emergency requests
                    that match your blood type and availability.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">⏰</span>
                    Eligibility Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track your cooldown period and see a countdown until your next eligible donation date.
                    Never miss an opportunity to donate.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Donation History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View your complete donation history including dates, locations, and amounts.
                    Generate certificates for your donations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    Educational Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access trusted information about blood donation, eligibility requirements,
                    and the donation process to build confidence.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🎖️</span>
                    Achievements & Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Earn badges and achievements as you donate. Track your impact and
                    see how many lives you've helped save.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* For Hospitals */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">For Hospitals & Medical Centers</h2>
            <p className="text-xl text-muted-foreground text-center mb-12">
              Powerful tools to manage blood drives and connect with verified donors
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    Donor Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Verify donor eligibility and maintain accurate records of verified donors
                    in your network.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📅</span>
                    Blood Drive Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create and manage blood drives with specific blood type requirements
                    and target radius for donor notifications.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🚨</span>
                    Emergency Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Send targeted emergency alerts to donors with specific blood types
                    when urgent needs arise.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    Donation Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Log donations, set cooldown periods, and maintain comprehensive
                    donation records for your medical center.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Making an Impact</h2>
            <p className="text-xl opacity-90">
              Join our growing community of donors and hospitals
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">1000+</div>
              <div className="text-lg opacity-90">Registered Donors</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Partner Hospitals</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2">5000+</div>
              <div className="text-lg opacity-90">Lives Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Who We Serve</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">🩸 Repeat Donors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    People who have donated before and want to stay engaged with convenient tools:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Reminders for next eligible donation date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Easy access to nearby blood drives</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Complete donation history tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">🆕 Prospective Donors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    People who have never donated or are unsure, needing guidance:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Educational content about blood donation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Clear eligibility requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Step-by-step guidance for first-time donors</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">🏥 Hospitals & Medical Centers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    Organizations that run blood drives and need to connect with donors:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Donor verification and management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Blood drive creation and management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Emergency alert system for urgent needs</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">⚙️ System Administrators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    Platform maintainers who manage the HemaWeb ecosystem:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Medical organization management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Educational content management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>User account moderation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 bg-gradient-to-b from-background to-primary/10">
          <div className="container px-4">
            <Card className="max-w-3xl mx-auto text-center border-2 border-primary/20">
              <CardHeader className="space-y-4">
                <CardTitle className="text-3xl md:text-4xl">Ready to Make a Difference?</CardTitle>
                <CardDescription className="text-lg">
                  Join thousands of donors saving lives across Thailand.
                  Register now and start your journey as a blood donor.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                      Sign Up Now
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                      Already have an account?
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">
                  Free to join • No credit card required • Start saving lives today
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
