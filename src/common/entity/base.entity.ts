import { PrimaryKey, Property } from '@mikro-orm/sqlite';
import { ulid } from 'ulid';

export abstract class BaseEntity {
  @PrimaryKey({ type: 'string', columnType: 'char(26)' })
  id = ulid();

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP', type: 'datetime' })
  createdAt: Date = new Date();
}
