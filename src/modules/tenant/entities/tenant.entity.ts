import {
  Entity,
  Property,
  OneToMany,
  Collection,
  Cascade,
} from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity()
export class Tenant extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @Property({ nullable: true })
  logo!: string | null;

  @Property({ nullable: true })
  address!: string | null;

  @Property({ nullable: true })
  email!: string | null;

  @Property({ nullable: true })
  website!: string | null;

  @OneToMany(() => User, (user) => user.tenant, {
    cascade: [Cascade.PERSIST],
    orphanRemoval: true,
  })
  users = new Collection<User>(this);
}
