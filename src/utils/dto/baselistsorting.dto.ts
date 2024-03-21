import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseListDto } from './baselist.dto';

export class BaseListSortDto extends BaseListDto {
  @ApiProperty({
    description: 'name | id',
    required: false,
  })
  @IsOptional()
  orderBy?: string;

  @ApiProperty({
    description: 'ASC | DESC',

    required: false,
  })
  @IsOptional()
  orderId?: 'ASC' | 'DESC';
}
