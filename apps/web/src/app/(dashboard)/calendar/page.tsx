'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';

interface Donation {
  id: string;
  donationDate: string;
  volumeMl: number;
  bloodType: {
    name: string;
  };
  medicalCenter: {
    name: string;
  };
}

interface BloodDrive {
  id: string;
  title: string;
  startDateTime: string;
  type: {
    code: string;
    name: string;
  };
  status: {
    code: string;
    name: string;
  };
}

interface CalendarEvent {
  date: Date;
  type: 'donation' | 'blood-drive' | 'eligible';
  data?: Donation | BloodDrive;
  title: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [nextEligibleDate, setNextEligibleDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadCalendarData();
    }
  }, [user, authLoading, router, currentDate]);

  const loadCalendarData = async () => {
    try {
      const [donationsRes, drivesRes, profileRes] = await Promise.all([
        apiClient.get<{ donations: Donation[] }>('/users/me/donations'),
        apiClient.get<{ data: BloodDrive[] }>('/blood-drives'),
        apiClient.get<{ profile: { nextEligibleDate?: string } }>('/users/me/profile'),
      ]);

      const calendarEvents: CalendarEvent[] = [];

      // Add donations
      donationsRes.donations.forEach((donation) => {
        calendarEvents.push({
          date: new Date(donation.donationDate),
          type: 'donation',
          data: donation,
          title: `Donated ${donation.volumeMl}ml`,
        });
      });

      // Add blood drives
      drivesRes.data.forEach((drive) => {
        calendarEvents.push({
          date: new Date(drive.startDateTime),
          type: 'blood-drive',
          data: drive,
          title: drive.title,
        });
      });

      // Add next eligible date
      if (profileRes.profile.nextEligibleDate) {
        const eligibleDate = new Date(profileRes.profile.nextEligibleDate);
        setNextEligibleDate(eligibleDate);
        calendarEvents.push({
          date: eligibleDate,
          type: 'eligible',
          title: 'Eligible to donate again',
        });
      }

      setEvents(calendarEvents);
    } catch (err) {
      console.error('Failed to load calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (loading || authLoading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl px-4 py-8">
          <p>Loading calendar...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Donation Calendar</h1>
          <p className="text-muted-foreground">
            Track your donation history and upcoming blood drives
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">{monthName}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Legend */}
            <div className="flex gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Donation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Blood Drive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Eligible to Donate</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-sm p-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2 min-h-24 border rounded-lg bg-muted/20"></div>
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const dayEvents = getEventsForDate(date);
                const isToday =
                  date.getDate() === new Date().getDate() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={day}
                    className={`p-2 min-h-24 border rounded-lg ${
                      isToday ? 'border-primary border-2 bg-primary/5' : ''
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayEvents.map((event, idx) => (
                        <div
                          key={idx}
                          className={`text-xs p-1 rounded ${
                            event.type === 'donation'
                              ? 'bg-red-100 text-red-800'
                              : event.type === 'blood-drive'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                          title={event.title}
                        >
                          {event.title.length > 15
                            ? event.title.substring(0, 15) + '...'
                            : event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

