import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PersonListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  industryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  skillId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  interestId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  certificateId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  countryId?: number;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 25;
}
