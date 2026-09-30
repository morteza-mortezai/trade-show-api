import {
  Entity,
  Property,
  OptionalProps,
  Unique,
  ManyToOne,
} from '@mikro-orm/core';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Tenant } from '../../tenant/entities/tenant.entity';

@Entity({ tableName: 'users' })
@Unique({ properties: ['tenant'] })
export class User extends BaseEntity {
  [OptionalProps]!: 'createdAt';
  @ManyToOne(() => Tenant, { deleteRule: 'cascade' })
  tenant!: Tenant;

  @Property()
  fullName!: string;
}
