import { Entity, Property, OptionalProps, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/entity/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ tableName: 'expenses' })
export class Expense extends BaseEntity {
  [OptionalProps]!: 'createdAt';

  @ManyToOne(() => User)
  paidBy!: User;

  @ManyToOne(() => User)
  expenseFor!: User;

  @Property({ type: 'number' })
  amount!: number;

  @Property({ type: 'string', nullable: true })
  description?: string;
}
