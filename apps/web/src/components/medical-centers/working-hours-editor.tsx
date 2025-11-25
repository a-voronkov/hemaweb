'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Clock } from 'lucide-react';

interface DaySchedule {
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface WorkingHoursEditorProps {
  workingHours: WorkingHours | null;
  onChange: (workingHours: WorkingHours) => void;
  disabled?: boolean;
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

const DEFAULT_HOURS: WorkingHours = {
  monday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
  tuesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
  wednesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
  thursday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
  friday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
  saturday: { isOpen: false, openTime: null, closeTime: null },
  sunday: { isOpen: false, openTime: null, closeTime: null },
};

export function WorkingHoursEditor({ workingHours, onChange, disabled = false }: WorkingHoursEditorProps) {
  const hours = workingHours || DEFAULT_HOURS;

  const handleDayToggle = (day: keyof WorkingHours, isOpen: boolean) => {
    onChange({
      ...hours,
      [day]: {
        isOpen,
        openTime: isOpen ? '08:00' : null,
        closeTime: isOpen ? '17:00' : null,
      },
    });
  };

  const handleTimeChange = (day: keyof WorkingHours, field: 'openTime' | 'closeTime', value: string) => {
    onChange({
      ...hours,
      [day]: {
        ...hours[day],
        [field]: value,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Working Hours
        </CardTitle>
        <CardDescription>
          Set the operating hours for each day of the week
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {DAYS.map(({ key, label }) => {
          const daySchedule = hours[key];
          
          return (
            <div key={key} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-32">
                <Label className="font-medium">{label}</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={daySchedule.isOpen}
                  onCheckedChange={(checked) => handleDayToggle(key, checked)}
                  disabled={disabled}
                />
                <span className="text-sm text-muted-foreground">
                  {daySchedule.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>

              {daySchedule.isOpen && (
                <div className="flex items-center gap-2 ml-auto">
                  <Input
                    type="time"
                    value={daySchedule.openTime || ''}
                    onChange={(e) => handleTimeChange(key, 'openTime', e.target.value)}
                    disabled={disabled}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={daySchedule.closeTime || ''}
                    onChange={(e) => handleTimeChange(key, 'closeTime', e.target.value)}
                    disabled={disabled}
                    className="w-32"
                  />
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

