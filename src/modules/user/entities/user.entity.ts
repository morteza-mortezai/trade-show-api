import { Entity, Property, OptionalProps } from '@mikro-orm/core';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity({ tableName: 'users' })
export class User extends BaseEntity {
  [OptionalProps]!: 'createdAt';

  @Property()
  fullName!: string;
}
