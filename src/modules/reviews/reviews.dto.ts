import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsInt, Min, Max, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty()
  rating: number;

  @IsString()
  @ApiProperty()
  comment: string;

  @IsInt()
  @ApiProperty()
  menuItemId: number;
}


export class UpdateReviewDto extends OmitType(CreateReviewDto, ['menuItemId'] as const) {}
