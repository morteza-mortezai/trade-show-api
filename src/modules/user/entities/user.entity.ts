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
@Unique({ properties: ['tenant', 'phone'] })
export class User extends BaseEntity {
  [OptionalProps]!: 'createdAt' | 'gender';
  @ManyToOne(() => Tenant, { deleteRule: 'cascade' })
  tenant!: Tenant;

  @Property({ nullable: true })
  firstName!: string | null;

  @Property({ nullable: true })
  lastName!: string | null;

  @Property({ length: 11, type: 'string' })
  phone!: string;

  @Property({ default: true })
  gender!: boolean;
}
