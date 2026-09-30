import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

export interface PersonListFilters {
  search?: string;
  industryId?: number;
  skillId?: number;
  interestId?: number;
  certificateId?: number;
  countryId?: number;
}

export interface PersonCursor {
  id: number;
}

@Injectable()
export class UserRepository extends EntityRepository<User> {
  // constructor(private readonly entityManager: EntityManager) {}
}
