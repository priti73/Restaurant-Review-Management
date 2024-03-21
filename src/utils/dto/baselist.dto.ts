import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class BaseListDto {
  @ApiProperty({
    description: 'number of records to skip',
    example: '0',
    required: false,
  })
  @IsOptional()
  skip?: number = 0;

  @ApiProperty({
    description: 'number of records to return',
    example: '5',
    required: false,
  })
  @IsOptional()
  take?: number = 10;
}
