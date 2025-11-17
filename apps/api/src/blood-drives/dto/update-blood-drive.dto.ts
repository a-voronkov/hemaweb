import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsArray, IsNumber, MinLength, MaxLength } from 'class-validator';

export class UpdateBloodDriveDto {
  @ApiProperty({
    example: 'Emergency Blood Drive - O Negative Needed',
    description: 'Blood drive title',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title?: string;

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
    example: 'active',
    description: 'Blood drive status code',
    required: false,
  })
  @IsOptional()
  @IsString()
  statusCode?: string;

  @ApiProperty({
    example: '2025-11-20T09:00:00Z',
    description: 'Start date and time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDateTime?: string;

  @ApiProperty({
    example: '2025-11-20T17:00:00Z',
    description: 'End date and time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDateTime?: string;

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
}

