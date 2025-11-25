import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  IsNumber,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateBloodDriveDto {
  @ApiProperty({
    example: 'cuid123',
    description: 'Medical center ID (optional for staff, required for admin)',
    required: false,
  })
  @IsOptional()
  @IsString()
  medicalCenterId?: string;

  @ApiProperty({
    example: 'Emergency Blood Drive - O Negative Needed',
    description: 'Blood drive title',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'Urgent need for O- blood type. Please come donate if eligible.',
    description: 'Blood drive description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    example: '123 Main Street',
    description: 'Address for the blood drive',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'Bangkok',
    description: 'City for the blood drive',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: 'emergency',
    description: 'Blood drive type code (scheduled or emergency)',
  })
  @IsString()
  typeCode: string;

  @ApiProperty({
    example: '2025-11-20T09:00:00Z',
    description: 'Start date and time',
  })
  @IsDateString()
  startDateTime: string;

  @ApiProperty({
    example: '2025-11-20T17:00:00Z',
    description: 'End date and time',
  })
  @IsDateString()
  endDateTime: string;

  @ApiProperty({
    example: ['O-', 'O+', 'A-'],
    description: 'Blood types needed (array of blood type codes)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bloodTypesNeeded?: string[];

  @ApiProperty({
    example: 50,
    description: 'Target number of donors',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  targetDonors?: number;

  @ApiProperty({
    example: 10,
    description: 'Search radius in kilometers for notifications',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  radiusKm?: number;
}
