import { IsString, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Blood drive ID' })
  @IsString()
  @IsNotEmpty()
  bloodDriveId: string;

  @ApiProperty({ description: 'Appointment date (ISO 8601 format)' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @ApiProperty({ description: 'Appointment time (HH:MM format)' })
  @IsString()
  @IsNotEmpty()
  appointmentTime: string;
}
