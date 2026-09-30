import { Entity, Property, ManyToOne, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Role } from '../../role/entities/role.entity';
import { User } from './user.entity';

@Entity()
@Unique({ properties: ['tenantId', 'user', 'role'] })
export class UserRole extends BaseEntity {
  @Property({ type: 'string' })
  tenantId!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Role)
  role!: Role;
}
