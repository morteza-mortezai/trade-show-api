import {
  Entity,
  Property,
  OptionalProps,
  Unique,
  ManyToOne,
} from '@mikro-orm/core';
import { BaseEntity } from '../../../common/entity/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ tableName: 'owes' })
@Unique({ properties: ['fromUser', 'toUser'] })
export class Owe extends BaseEntity {
  [OptionalProps]!: 'createdAt';

  @ManyToOne(() => User)
  fromUser!: User;

  @ManyToOne(() => User)
  toUser!: User;

  @Property({ type: 'number' })
  balance!: number;
}
