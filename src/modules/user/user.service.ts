import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly em: EntityManager,
  ) {}

  findAll() {
    return this.userRepository.find({});
  }
}
