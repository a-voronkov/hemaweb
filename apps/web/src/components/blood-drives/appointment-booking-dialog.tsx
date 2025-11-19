'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addDays, isSameDay, parseISO, setHours, setMinutes } from 'date-fns';
import { apiClient } from '@/lib/api/client';

interface WorkingHours {
  monday: { isOpen: boolean; openTime: string | null; closeTime: string | null };
  tuesday: { isOpen: boolean; openTime: string | null; closeTime: string | null };
  wednesday: { isOpen: boolean; openTime: string | null; closeTime: string | null };
  thursday: { isOpen: boolean; openTime: string | null; closeTime: string | null };
  friday: { isOpen: boolean; openTime: string | null; closeTime: string | null };
  saturday: { isOpen: boolean; openTime: string | null; closeTime: string | null };
  sunday: { isOpen: boolean; openTime: string | null; closeTime: string | null };
}

interface BloodDrive {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  medicalCenter: {
    id: string;
    name: string;
    workingHours?: WorkingHours | null;
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bloodDrive: BloodDrive;
  onSuccess: () => void;
}

const DAYS_MAP: Record<number, keyof WorkingHours> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

export function AppointmentBookingDialog({
  open,
  onOpenChange,
  bloodDrive,
  onSuccess,
}: AppointmentBookingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startDate = parseISO(bloodDrive.startDate);
  const endDate = parseISO(bloodDrive.endDate);

  // Generate time slots when date is selected
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    const dayOfWeek = selectedDate.getDay();
    const dayName = DAYS_MAP[dayOfWeek];
    const workingHours = bloodDrive.medicalCenter.workingHours;

    if (!workingHours || !workingHours[dayName]?.isOpen) {
      setTimeSlots([]);
      return;
    }

    const daySchedule = workingHours[dayName];
    if (!daySchedule.openTime || !daySchedule.closeTime) {
      setTimeSlots([]);
      return;
    }

    // Generate hourly slots
    const [openHour] = daySchedule.openTime.split(':').map(Number);
    const [closeHour] = daySchedule.closeTime.split(':').map(Number);

    const slots: TimeSlot[] = [];
    for (let hour = openHour; hour < closeHour; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: true, // TODO: Check availability from API
      });
    }

    setTimeSlots(slots);
  }, [selectedDate, bloodDrive]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiClient.post('/blood-drives/appointments', {
        bloodDriveId: bloodDrive.id,
        appointmentDate: selectedDate.toISOString(),
        appointmentTime: selectedTime,
      });

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    return date < startDate || date > endDate;
  };

  const isDayOpen = (date: Date) => {
    const dayOfWeek = date.getDay();
    const dayName = DAYS_MAP[dayOfWeek];
    const workingHours = bloodDrive.medicalCenter.workingHours;
    return workingHours?.[dayName]?.isOpen || false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Select a date and time for your blood donation at {bloodDrive.medicalCenter.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Select Date
            </Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              className="rounded-md border"
            />
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Select Time
            </Label>

            {!selectedDate && (
              <div className="text-sm text-muted-foreground p-4 border rounded-md">
                Please select a date first
              </div>
            )}

            {selectedDate && !isDayOpen(selectedDate) && (
              <Alert>
                <AlertDescription>
                  The medical center is closed on this day
                </AlertDescription>
              </Alert>
            )}

            {selectedDate && isDayOpen(selectedDate) && timeSlots.length > 0 && (
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 border rounded-md">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? 'default' : 'outline'}
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className="w-full"
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Book Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

