'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/animations/fade-in';
import { motion } from 'framer-motion';
import {
  Heart,
  MapPin,
  Bell,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Activity,
  Users,
  Building2,
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 max-w-2xl text-center lg:text-left">
              <FadeIn delay={0.1}>
                <Badge
                  variant="secondary"
                  className="mb-6 px-4 py-1.5 text-sm font-medium rounded-full bg-primary/5 text-primary border-primary/10"
                >
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Urgent Need: Blood Types O- and A+
                </Badge>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
                  Save lives. <br />
                  <span className="text-muted-foreground">Donate blood.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Connect directly with hospitals in need. Track your impact, receive health
                  insights, and join a community of lifesavers.
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {!user ? (
                    <>
                      <Link href="/register">
                        <Button
                          size="lg"
                          className="w-full sm:w-auto h-14 px-8 rounded-full text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                        >
                          Start Donating
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full sm:w-auto h-14 px-8 rounded-full text-lg font-medium border-2 hover:bg-secondary/50"
                        >
                          Sign In
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href="/dashboard">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto h-14 px-8 rounded-full text-lg font-medium shadow-lg shadow-primary/20"
                      >
                        Go to Dashboard
                        <Activity className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </FadeIn>
            </div>

            <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative">
              <FadeIn delay={0.3}>
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 bg-secondary/10 aspect-[4/3] group">
                  <Image
                    src="/hero-medical.png"
                    alt="Modern Blood Donation Center"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2.5rem]" />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Minimalist */}
      <section className="py-20 border-y bg-secondary/30">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: 'Active Donors', value: '10k+', icon: Users },
              { label: 'Partner Hospitals', value: '50+', icon: Building2 },
              { label: 'Lives Saved', value: '25k+', icon: Heart },
              { label: 'Daily Donations', value: '150+', icon: Activity },
            ].map((stat, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <div className="flex flex-col items-center text-center space-y-2">
                  <stat.icon className="w-6 h-6 text-primary mb-2 opacity-80" />
                  <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* The Process - Alternating Layout */}
      <section className="py-24 lg:py-32 overflow-hidden">
        <div className="container px-4 mx-auto space-y-32">
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 order-2 lg:order-1">
              <FadeIn>
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 aspect-square max-w-md mx-auto lg:mx-0 group">
                  <Image
                    src="/donation-process.png"
                    alt="Safe Donation Process"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2rem]" />
                </div>
              </FadeIn>
            </div>
            <div className="flex-1 order-1 lg:order-2 max-w-xl">
              <FadeIn delay={0.2}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-8">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                  Safety first. <br />
                  <span className="text-muted-foreground">Always.</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  We partner only with certified medical centers that adhere to the strictest safety
                  protocols. Every donation is tracked, tested, and handled with precision care.
                </p>
                <ul className="space-y-4">
                  {[
                    'Verified medical partners',
                    'Real-time health screening',
                    'Sterile, single-use equipment',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-foreground font-medium">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 max-w-xl">
              <FadeIn delay={0.2}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 mb-8">
                  <Bell className="w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                  Smart alerts. <br />
                  <span className="text-muted-foreground">Right when needed.</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Our intelligent system notifies you only when your specific blood type is urgently
                  needed nearby. No spam, just opportunities to save lives.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <Card className="border-none shadow-lg bg-secondary/20">
                    <CardContent className="p-6">
                      <MapPin className="w-8 h-8 text-blue-600 mb-4" />
                      <h3 className="font-semibold mb-2">Location Based</h3>
                      <p className="text-sm text-muted-foreground">
                        Find drives within your preferred radius.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-lg bg-secondary/20">
                    <CardContent className="p-6">
                      <Clock className="w-8 h-8 text-blue-600 mb-4" />
                      <h3 className="font-semibold mb-2">Eligibility Tracking</h3>
                      <p className="text-sm text-muted-foreground">
                        Know exactly when you can donate again.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </FadeIn>
            </div>
            <div className="flex-1">
              <FadeIn>
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 aspect-square max-w-md mx-auto lg:ml-auto group">
                  <Image
                    src="/medical-tech.png"
                    alt="Smart Medical Technology"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2rem]" />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="container px-4 mx-auto relative z-10 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
              Ready to make an impact?
            </h2>
            <p className="text-xl text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
              Join thousands of donors who are making a difference every single day. It only takes a
              few minutes to get started.
            </p>
            {!user && (
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-16 px-10 rounded-full text-xl font-semibold bg-background text-foreground hover:bg-background/90 transition-all shadow-xl shadow-white/5"
                >
                  Become a Donor
                </Button>
              </Link>
            )}
          </FadeIn>
        </div>
      </section>
    </MainLayout>
  );
}
