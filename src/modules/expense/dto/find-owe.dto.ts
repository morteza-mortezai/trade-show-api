import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class FindOweDto extends PaginationDto {
  @IsOptional()
  @IsString()
  fromUserId?: string;

  @IsOptional()
  @IsString()
  toUserId?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
