import { BadRequestException, Injectable } from '@nestjs/common';
import { PersonListQueryDto } from './dto/users-list-query.dto';
import { UserRepository } from './user.repository';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly em: EntityManager,
  ) {}

  findAll(filters: PersonListQueryDto) {
    const { cursor, limit, ...rest } = filters;
    return this.userRepository.findAll(rest, cursor, limit);
  }

  async findOneByPhoneOrFail(phone: string) {
    const user = await this.userRepository.findOne({ phone });
    if (!user) {
      throw new BadRequestException('USer not found!');
    }
  }
 
}
