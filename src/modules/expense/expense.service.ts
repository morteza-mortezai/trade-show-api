import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UserService } from '../user/user.service';
import { EntityManager } from '@mikro-orm/sqlite';
import { Expense } from './entities/expense.entity';
import { Owe } from './entities/owe.entity';
import Decimal from 'decimal.js';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly userService: UserService,
    private readonly em: EntityManager,
  ) {}
  async create(createExpenseDto: CreateExpenseDto) {
    const { amount, expenseForId, paidById, description } = createExpenseDto;
    const [paidBy, expenseFor] = await Promise.all([
      this.userService.findOneOrFail(paidById),
      this.userService.findOneOrFail(expenseForId),
    ]);

    this.em.transactional(async (em) => {
      const expense = em.create(Expense, {
        paidBy,
        expenseFor,
        amount,
        description,
      });

      em.persist(expense);

      // calc balance

      const exitingOweRecord = await em.findOne(
        Owe,
        {
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
        },
        { populate: ['fromUser', 'toUser'] },
      );

      if (exitingOweRecord) {
        const isForwardDirection = exitingOweRecord.fromUser == paidBy;

        const currentBalance = new Decimal(exitingOweRecord.balance);

        const decimalAmount = new Decimal(amount);

        if (isForwardDirection) {
          exitingOweRecord.balance = currentBalance
            .plus(decimalAmount)
            .toNumber();
        } else {
          exitingOweRecord.balance = currentBalance
            .minus(decimalAmount)
            .toNumber();
        }
      } else {
        const owe = em.create(Owe, {
          fromUser: paidBy,
          toUser: expenseFor,
          balance: amount,
        });

        em.persist(owe);
      }

      await em.flush();
    });
  }
}
