import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { FindExpenseDto } from './dto/find-expense.dto';
import { FindOweDto } from './dto/find-owe.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  @Get()
  findAll(@Query() query: FindExpenseDto) {
    return this.expenseService.findAll(query.page, query.limit);
  }

  @Get()
  findAllOwes(@Query() query: FindOweDto) {
    return this.expenseService.findAllOws(query.page, query.limit);
  }
}
