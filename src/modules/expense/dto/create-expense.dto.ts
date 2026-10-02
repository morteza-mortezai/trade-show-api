import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  paidById!: string;

  @IsString()
  @IsNotEmpty()
  expenseForId!: string;

  @IsInt()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsOptional()
  description?: string;
}
