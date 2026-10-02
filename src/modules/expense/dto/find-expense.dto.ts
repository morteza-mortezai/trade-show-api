import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class FindExpenseDto extends PaginationDto {
  @IsOptional()
  @IsString()
  paidById?: string;

  @IsOptional()
  @IsString()
  expenseForId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
