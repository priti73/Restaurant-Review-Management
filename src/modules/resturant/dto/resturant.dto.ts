// business-listing.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateResturantDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  city: string;

  

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  address: string;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  images: string[];
}
