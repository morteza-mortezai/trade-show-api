import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { UserModule } from '../user/user.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Expense } from './entities/expense.entity';
import { Owe } from './entities/owe.entity';

@Module({
  imports: [UserModule, MikroOrmModule.forFeature([Expense, Owe])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
