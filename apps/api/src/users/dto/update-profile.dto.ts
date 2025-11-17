import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, Matches, IsDateString, IsEnum } from 'class-validator';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class UpdateProfileDto {
  @ApiProperty({
    example: 'John',
    description: 'First name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({
    example: '+66-81-234-5678',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be in valid international format',
  })
  phone?: string;

  @ApiProperty({
    example: '1990-01-15',
    description: 'Date of birth (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    example: 'male',
    description: 'Gender',
    enum: Gender,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    example: '1234567890123',
    description: 'National ID number',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(13)
  @MaxLength(13)
  nationalId?: string;

  @ApiProperty({
    example: '123 Main St, Bangkok',
    description: 'Address',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;
}

