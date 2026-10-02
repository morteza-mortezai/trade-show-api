import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UserService } from '../user/user.service';
import { EntityManager, FilterQuery } from '@mikro-orm/sqlite';
import { Expense } from './entities/expense.entity';
import { Owe } from './entities/owe.entity';
import Decimal from 'decimal.js';
import { User } from '../user/entities/user.entity';
import { FindExpenseDto } from './dto/find-expense.dto';
import { FindOweDto } from './dto/find-owe.dto';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly userService: UserService,
    private readonly em: EntityManager,
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
    const {
      page = 1,
      limit = 20,
      paidById,
      expenseForId,
      userId,
      search,
      fromDate,
      toDate,
    } = filters;

    const where: FilterQuery<Expense> = {};

    if (paidById) {
      where.paidBy = paidById;
    }

    if (expenseForId) {
      where.expenseFor = expenseForId;
    }

    if (userId) {
      where.$or = [{ paidBy: userId }, { expenseFor: userId }];
    }

    if (search) {
      where.description = {
        $like: `%${search}%`,
      };
    }

    if (fromDate || toDate) {
      where.createdAt = {};

      if (fromDate) {
        where.createdAt.$gte = new Date(fromDate);
      }

      if (toDate) {
        where.createdAt.$lte = new Date(toDate);
      }
    }

    const [expenses, total] = await this.em.findAndCount(Expense, where, {
      populate: ['paidBy', 'expenseFor'],
      limit,
      offset: (page - 1) * limit,
      orderBy: {
        createdAt: 'DESC',
      },
    });

    return {
      data: expenses,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllOws(filters: FindOweDto) {
    const { page = 1, limit = 20, fromUserId, toUserId, userId } = filters;

    const where: FilterQuery<Owe> = {};

    if (fromUserId) {
      where.fromUser = fromUserId;
    }

    if (toUserId) {
      where.toUser = toUserId;
    }

    if (userId) {
      where.$or = [{ fromUser: userId }, { toUser: userId }];
    }

    const [owes, total] = await this.em.findAndCount(Owe, where, {
      populate: ['fromUser', 'toUser'],
      limit,
      offset: (page - 1) * limit,
      orderBy: {
        createdAt: 'DESC',
      },
    });

    return {
      data: owes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
    const expense = em.create(Expense, data);

    em.persist(expense);
  }

  private async updateOweBalance(
    em: EntityManager,
    paidBy: User,
    expenseFor: User,
    amount: number,
  ) {
    const existingOwe = await em.findOne(Owe, {
      $or: [
        {
          fromUser: paidBy,
          toUser: expenseFor,
        },
        {
          fromUser: expenseFor,
          toUser: paidBy,
        },
      ],
    });

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
    const owe = em.create(Owe, {
      fromUser,
      toUser,
      balance: new Decimal(amount).toNumber(),
    });

    em.persist(owe);
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
      em.remove(owe);
      return;
    }

    owe.balance = newBalance.toNumber();
  }
}
