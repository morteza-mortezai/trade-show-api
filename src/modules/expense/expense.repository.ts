import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
} from '@mikro-orm/sqlite';
import { User } from '../user/entities/user.entity';
import { FindExpenseDto } from './dto/find-expense.dto';
import { FindOweDto } from './dto/find-owe.dto';
import { Expense } from './entities/expense.entity';
import { Owe } from './entities/owe.entity';

export interface CreateExpenseData {
  amount: number;
  paidBy: User;
  expenseFor: User;
  description?: string;
}

@Injectable()
export class ExpenseRepository extends EntityRepository<Expense> {
  constructor(entityManager: EntityManager) {
    super(entityManager, Expense);
  }

  async findExpenses(filters: FindExpenseDto) {
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
      where.description = { $like: `%${search}%` };
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

    const [expenses, total] = await this.findAndCount(where, {
      populate: ['paidBy', 'expenseFor'],
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'DESC' },
    });

    return this.paginate(expenses, page, limit, total);
  }

  async findOwes(filters: FindOweDto) {
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

    const [owes, total] = await this.getEntityManager().findAndCount(
      Owe,
      where,
      {
        populate: ['fromUser', 'toUser'],
        limit,
        offset: (page - 1) * limit,
        orderBy: { createdAt: 'DESC' },
      },
    );

    return this.paginate(owes, page, limit, total);
  }

  createExpense(entityManager: EntityManager, data: CreateExpenseData) {
    const expense = entityManager.create(Expense, data);
    entityManager.persist(expense);

    return expense;
  }

  async findOweBetween(
    entityManager: EntityManager,
    paidBy: User,
    expenseFor: User,
  ) {
    return entityManager.findOne(Owe, {
      $or: [
        { fromUser: paidBy, toUser: expenseFor },
        { fromUser: expenseFor, toUser: paidBy },
      ],
    });
  }

  createOwe(
    entityManager: EntityManager,
    fromUser: User,
    toUser: User,
    balance: number,
  ) {
    const owe = entityManager.create(Owe, { fromUser, toUser, balance });
    entityManager.persist(owe);

    return owe;
  }

  removeOwe(entityManager: EntityManager, owe: Owe) {
    entityManager.remove(owe);
  }

  private paginate<T>(data: T[], page: number, limit: number, total: number) {
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
