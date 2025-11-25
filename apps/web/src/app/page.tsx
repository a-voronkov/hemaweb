'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/animations/fade-in';
import { StaggerContainer, staggerItem } from '@/components/animations/stagger-container';
import { AnimatedCard } from '@/components/ui/animated-card';
import { motion } from 'framer-motion';
import {
  Heart,
  MapPin,
  Bell,
  Clock,
  BarChart3,
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  Users,
  Building2,
  Settings,
  Droplet,
  Activity,
  Shield,
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background py-20 md:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="container px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn delay={0.1}>
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
                <Droplet className="w-4 h-4 mr-1 text-primary" />
                Connecting Donors with Hospitals
              </Badge>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-red-600 to-primary/60 bg-clip-text text-transparent">
                Save Lives Through Blood Donation
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                HemaWeb connects hospitals and medical centers with verified blood donors across Thailand.
                Find blood drives, track your donations, and make a real difference.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" className="w-full sm:w-auto text-lg px-8 shadow-lg shadow-primary/25">
                        <Heart className="w-5 h-5 mr-2" />
                        Get Started Free
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/login">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                        Sign In
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              ) : (
                <Link href="/dashboard">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="text-lg px-8 shadow-lg shadow-primary/25">
                      <Activity className="w-5 h-5 mr-2" />
                      Go to Dashboard
                    </Button>
                  </motion.div>
                </Link>
              )}
            </FadeIn>

            {/* Trust indicators */}
            <FadeIn delay={0.5}>
              <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Verified & Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>1000+ Active Donors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>50+ Partner Hospitals</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  The Challenge
                </h2>
                <p className="text-xl text-muted-foreground">
                  Blood donation is critical to healthcare, yet blood banks frequently face shortages
                </p>
              </div>
            </FadeIn>

            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Low Donation Rates"
                  icon={
                    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-red-600" />
                    </div>
                  }
                  className="h-full border-l-4 border-l-red-500/50 hover:border-l-red-500 transition-colors"
                >
                  <p className="text-muted-foreground">
                    In Thailand, less than 3% of the population donates blood, far below WHO recommendations.
                    Only a small fraction of daily blood demand is met.
                  </p>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Limited Awareness"
                  icon={
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                  }
                  className="h-full border-l-4 border-l-blue-500/50 hover:border-l-blue-500 transition-colors"
                >
                  <p className="text-muted-foreground">
                    Donors struggle to find donation opportunities due to low awareness,
                    lack of convenient donation points, and limited understanding of the process.
                  </p>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Fear & Misinformation"
                  icon={
                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                    </div>
                  }
                  className="h-full border-l-4 border-l-orange-500/50 hover:border-l-orange-500 transition-colors"
                >
                  <p className="text-muted-foreground">
                    Misinformation and stigma about blood donation and its risks discourage participation.
                    New donors lack guidance on how to start.
                  </p>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="No Reminders"
                  icon={
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  }
                  className="h-full border-l-4 border-l-purple-500/50 hover:border-l-purple-500 transition-colors"
                >
                  <p className="text-muted-foreground">
                    Existing donors often forget when they're eligible to donate again,
                    missing opportunities to help save lives.
                  </p>
                </AnimatedCard>
              </motion.div>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

        <div className="container px-4 relative z-10">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                Our Solution
              </h2>
              <p className="text-xl text-muted-foreground">
                HemaWeb addresses these barriers with a comprehensive platform that makes blood donation easy,
                accessible, and rewarding
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <motion.div variants={staggerItem}>
              <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 h-full hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <CardHeader>
                  <motion.div
                    className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Users className="w-8 h-8 text-primary" />
                  </motion.div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-2">
                      1
                    </div>
                    <CardTitle className="text-center">Register</CardTitle>
                    <CardDescription className="text-center">
                      Create your account and complete your donor profile with blood type and location
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card className="border-primary/20 bg-gradient-to-br from-card to-blue-500/5 h-full hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <CardHeader>
                  <motion.div
                    className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 mx-auto"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-blue-600" />
                  </motion.div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold mb-2">
                      2
                    </div>
                    <CardTitle className="text-center">Get Verified</CardTitle>
                    <CardDescription className="text-center">
                      Visit a partner hospital to verify your eligibility and become a certified donor
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card className="border-primary/20 bg-gradient-to-br from-card to-green-500/5 h-full hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
                <CardHeader>
                  <motion.div
                    className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-4 mx-auto"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Heart className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold mb-2">
                      3
                    </div>
                    <CardTitle className="text-center">Donate & Save Lives</CardTitle>
                    <CardDescription className="text-center">
                      Find nearby blood drives, receive notifications, and track your donation history
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </StaggerContainer>
        </div>
      </section>

      {/* Features for Donors */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <Heart className="w-3 h-3 mr-1" />
                  For Donors
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
                <p className="text-xl text-muted-foreground">
                  Powerful tools to become an active, engaged blood donor
                </p>
              </div>
            </FadeIn>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Find Nearby Drives"
                  icon={
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  }
                  className="h-full hover:shadow-lg transition-shadow"
                >
                  <p className="text-muted-foreground text-sm">
                    Search for blood drives and emergency requests near you using location-aware features.
                    See which drives match your blood type.
                  </p>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Smart Notifications"
                  icon={
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Bell className="w-6 h-6 text-blue-600" />
                    </div>
                  }
                  className="h-full hover:shadow-lg transition-shadow"
                >
                  <p className="text-muted-foreground text-sm">
                    Receive targeted alerts about nearby donation opportunities and emergency requests
                    that match your blood type and availability.
                  </p>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Eligibility Tracking"
                  icon={
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                  }
                  className="h-full hover:shadow-lg transition-shadow"
                >
                  <p className="text-muted-foreground text-sm">
                    Track your cooldown period and see a countdown until your next eligible donation date.
                    Never miss an opportunity to donate.
                  </p>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Donation History"
                  icon={
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                  }
                  className="h-full hover:shadow-lg transition-shadow"
                >
                  <p className="text-muted-foreground text-sm">
                    View your complete donation history including dates, locations, and amounts.
                    Generate certificates for your donations.
                  </p>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Educational Content"
                  icon={
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-orange-600" />
                    </div>
                  }
                  className="h-full hover:shadow-lg transition-shadow"
                >
                  <p className="text-muted-foreground text-sm">
                    Access trusted information about blood donation, eligibility requirements,
                    and the donation process to build confidence.
                  </p>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Achievements & Badges"
                  icon={
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                  }
                  className="h-full hover:shadow-lg transition-shadow"
                >
                  <p className="text-muted-foreground text-sm">
                    Earn badges and achievements as you donate. Track your impact and
                    see how many lives you've helped save.
                  </p>
                </AnimatedCard>
              </motion.div>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* For Hospitals */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-500/5 to-background" />

        <div className="container px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
                  <Building2 className="w-3 h-3 mr-1" />
                  For Hospitals
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  For Hospitals & Medical Centers
                </h2>
                <p className="text-xl text-muted-foreground">
                  Powerful tools to manage blood drives and connect with verified donors
                </p>
              </div>
            </FadeIn>

            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Donor Verification"
                  icon={
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                  }
                  className="h-full border-l-4 border-l-green-500/50 hover:border-l-green-500 transition-colors"
                >
                  <p className="text-muted-foreground">
                    Verify donor eligibility and maintain accurate records of verified donors
                    in your network.
                  </p>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Blood Drive Management"
                  icon={
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  }
                  className="h-full border-l-4 border-l-blue-500/50 hover:border-l-blue-500 transition-colors"
                >
                  <p className="text-muted-foreground">
                    Create and manage blood drives with specific blood type requirements
                    and target radius for donor notifications.
                  </p>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Emergency Alerts"
                  icon={
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                  }
                  className="h-full border-l-4 border-l-red-500/50 hover:border-l-red-500 transition-colors"
                >
                  <p className="text-muted-foreground">
                    Send targeted emergency alerts to donors with specific blood types
                    when urgent needs arise.
                  </p>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={staggerItem}>
                <AnimatedCard
                  title="Donation Records"
                  icon={
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                  }
                  className="h-full border-l-4 border-l-purple-500/50 hover:border-l-purple-500 transition-colors"
                >
                  <p className="text-muted-foreground">
                    Log donations, set cooldown periods, and maintain comprehensive
                    donation records for your medical center.
                  </p>
                </AnimatedCard>
              </motion.div>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-red-600 to-primary text-primary-foreground py-20">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container px-4 relative z-10">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Making an Impact</h2>
              <p className="text-xl opacity-90">
                Join our growing community of donors and hospitals
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <motion.div variants={staggerItem}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-12 h-12" />
                </div>
                <div className="text-5xl md:text-6xl font-bold mb-2">1000+</div>
                <div className="text-lg opacity-90">Registered Donors</div>
              </motion.div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="flex items-center justify-center mb-4">
                  <Building2 className="w-12 h-12" />
                </div>
                <div className="text-5xl md:text-6xl font-bold mb-2">50+</div>
                <div className="text-lg opacity-90">Partner Hospitals</div>
              </motion.div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="flex items-center justify-center mb-4">
                  <Heart className="w-12 h-12" />
                </div>
                <div className="text-5xl md:text-6xl font-bold mb-2">5000+</div>
                <div className="text-lg opacity-90">Lives Saved</div>
              </motion.div>
            </motion.div>
          </StaggerContainer>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Who We Serve
              </h2>
            </FadeIn>

            <StaggerContainer className="grid md:grid-cols-2 gap-8">
              <motion.div variants={staggerItem}>
                <Card className="border-2 border-primary/20 h-full hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Droplet className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">Repeat Donors</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">
                      People who have donated before and want to stay engaged with convenient tools:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Reminders for next eligible donation date</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Easy access to nearby blood drives</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Complete donation history tracking</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Card className="border-2 border-blue-500/20 h-full hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-2xl">Prospective Donors</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">
                      People who have never donated or are unsure, needing guidance:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Educational content about blood donation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Clear eligibility requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Step-by-step guidance for first-time donors</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Card className="border-2 border-green-500/20 h-full hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-green-600" />
                      </div>
                      <CardTitle className="text-2xl">Hospitals & Medical Centers</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">
                      Organizations that run blood drives and need to connect with donors:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Donor verification and management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Blood drive creation and management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Emergency alert system for urgent needs</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Card className="border-2 border-purple-500/20 h-full hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <Settings className="w-6 h-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-2xl">System Administrators</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">
                      Platform maintainers who manage the HemaWeb ecosystem:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Medical organization management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Educational content management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>User account moderation</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/10 to-background" />
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className="container px-4 relative z-10">
            <FadeIn>
              <Card className="max-w-3xl mx-auto text-center border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 shadow-2xl shadow-primary/10">
                <CardHeader className="space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                  >
                    <Heart className="w-10 h-10 text-primary" />
                  </motion.div>
                  <CardTitle className="text-3xl md:text-4xl bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                    Ready to Make a Difference?
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Join thousands of donors saving lives across Thailand.
                    Register now and start your journey as a blood donor.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" className="w-full sm:w-auto text-lg px-8 shadow-lg shadow-primary/25">
                          <Heart className="w-5 h-5 mr-2" />
                          Sign Up Now
                        </Button>
                      </motion.div>
                    </Link>
                    <Link href="/login">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                          Already have an account?
                        </Button>
                      </motion.div>
                    </Link>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>Free to join</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>Start saving lives today</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
