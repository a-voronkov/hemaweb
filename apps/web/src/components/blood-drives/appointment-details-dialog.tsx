'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, MapPin, Building2, Download, Printer, Loader2, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { apiClient } from '@/lib/api/client';

interface Appointment {
  id: string;
  confirmationNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  bloodDrive: {
    id: string;
    name: string;
    location: string;
    medicalCenter: {
      id: string;
      name: string;
      city: string;
    };
  };
}

interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment;
  onCancel?: () => void;
}

export function AppointmentDetailsDialog({
  open,
  onOpenChange,
  appointment,
  onCancel,
}: AppointmentDetailsDialogProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    setCancelling(true);
    setError('');

    try {
      await apiClient.delete(`/blood-drives/appointments/${appointment.id}`);
      setCancelDialogOpen(false);
      onOpenChange(false);
      onCancel?.();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel appointment');
    } finally {
      setCancelling(false);
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `appointment-${appointment.confirmationNumber}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Appointment Confirmed</DialogTitle>
          <DialogDescription>
            Your blood donation appointment has been confirmed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Code */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <QRCodeSVG
                id="qr-code"
                value={appointment.confirmationNumber}
                size={200}
                level="H"
                includeMargin
              />
              <p className="mt-4 text-sm font-mono text-center">
                {appointment.confirmationNumber}
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Appointment Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{appointment.bloodDrive.name}</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.bloodDrive.medicalCenter.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm">{appointment.bloodDrive.location}</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.bloodDrive.medicalCenter.city}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm">
                {format(parseISO(appointment.appointmentDate), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm">{appointment.appointmentTime}</p>
            </div>
          </div>

          <Separator />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download QR
            </Button>
          </div>

          <Button
            variant="destructive"
            onClick={handleCancelClick}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel Appointment
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Please show this QR code or confirmation number when you arrive for your appointment
          </p>
        </div>
      </DialogContent>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
              You will need to book a new appointment if you change your mind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>
              Keep Appointment
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

