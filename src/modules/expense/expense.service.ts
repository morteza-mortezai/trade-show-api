import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UserService } from '../user/user.service';
import { EntityManager } from '@mikro-orm/sqlite';
import { Owe } from './entities/owe.entity';
import Decimal from 'decimal.js';
import { User } from '../user/entities/user.entity';
import { FindExpenseDto } from './dto/find-expense.dto';
import { FindOweDto } from './dto/find-owe.dto';
import { ExpenseRepository } from './expense.repository';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly userService: UserService,
    private readonly em: EntityManager,
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async create(dto: CreateExpenseDto) {
    const { amount, expenseForId, paidById, description } = dto;

    const [paidBy, expenseFor] = await Promise.all([
      this.userService.findOneOrFail(paidById),
      this.userService.findOneOrFail(expenseForId),
    ]);

    await this.em.transactional(async (em) => {
      this.createExpense(em, {
        amount,
        paidBy,
        expenseFor,
        description,
      });

      await this.updateOweBalance(em, paidBy, expenseFor, amount);
    });
  }

  async findAll(filters: FindExpenseDto) {
    return this.expenseRepository.findExpenses(filters);
  }

  async findAllOws(filters: FindOweDto) {
    return this.expenseRepository.findOwes(filters);
  }

  private createExpense(
    em: EntityManager,
    data: {
      amount: number;
      paidBy: User;
      expenseFor: User;
      description?: string;
    },
  ) {
    this.expenseRepository.createExpense(em, data);
  }

  private async updateOweBalance(
    em: EntityManager,
    paidBy: User,
    expenseFor: User,
    amount: number,
  ) {
    const existingOwe = await this.expenseRepository.findOweBetween(
      em,
      paidBy,
      expenseFor,
    );

    if (!existingOwe) {
      this.createOwe(em, paidBy, expenseFor, amount);
      return;
    }

    this.applyBalanceChange(em, existingOwe, paidBy, amount);
  }

  private createOwe(
    em: EntityManager,
    fromUser: User,
    toUser: User,
    amount: number,
  ) {
    this.expenseRepository.createOwe(
      em,
      fromUser,
      toUser,
      new Decimal(amount).toNumber(),
    );
  }

  private applyBalanceChange(
    em: EntityManager,
    owe: Owe,
    paidBy: User,
    amount: number,
  ) {
    const currentBalance = new Decimal(owe.balance);
    const expenseAmount = new Decimal(amount);

    const isForwardDirection = owe.fromUser.id === paidBy.id;

    const newBalance = isForwardDirection
      ? currentBalance.plus(expenseAmount)
      : currentBalance.minus(expenseAmount);

    if (newBalance.isZero()) {
      this.expenseRepository.removeOwe(em, owe);
      return;
    }

    owe.balance = newBalance.toNumber();
  }
}
