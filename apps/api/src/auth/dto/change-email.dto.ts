import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({
    example: 'new-email@example.com',
    description: 'New email address',
  })
  @IsEmail()
  newEmail: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'Current password for verification',
  })
  @IsString()
  password: string;
}
