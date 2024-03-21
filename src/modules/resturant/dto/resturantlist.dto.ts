// book-filter.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BaseListSortDto } from 'src/utils/dto/baselistsorting.dto';

export class restuarntDto extends BaseListSortDto {
  @ApiProperty({ required: false })
  name?: string;
}
