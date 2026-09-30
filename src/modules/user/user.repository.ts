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

  async findAll(filters: PersonListFilters = {}, cursor?: string, limit = 25) {
    const safeLimit = Math.min(Math.max(1, Number(limit) || 25), 100);

    const qb = this.createQueryBuilder('p').select('p.*');

    /*
     * Cursor pagination
     */
    if (cursor) {
      const cursorId = Number(cursor);

      if (Number.isFinite(cursorId)) {
        qb.andWhere({
          id: {
            $gt: cursorId,
          },
        });
      }
    }

    /*
     * Search
     */
    const search = filters.search?.trim();

    if (search) {
      qb.andWhere({
        $or: [
          { firstName: { $ilike: `%${search}%` } },
          { lastName: { $ilike: `%${search}%` } },
        ],
      });
    }

    /*
     * Industry
     */
    if (filters.industryId) {
      qb.andWhere({
        industry: filters.industryId,
      });
    }

    /*
     * Country
     */
    // if (filters.countryId) {
    //   const subQuery = this.entityManager
    //     .createQueryBuilder(PersonCountryRelation, 'pco')
    //     .select('pco.person')
    //     .where({
    //       country: filters.countryId,
    //     });

    //   qb.andWhere({
    //     id: {
    //       $in: subQuery,
    //     },
    //   });
    // }

    /*
     * Cursor pagination
     */
    qb.orderBy({
      id: 'asc',
    });

    qb.limit(safeLimit + 1);

    const rows = await qb.getResult();

    const hasNextPage = rows.length > safeLimit;

    const items = hasNextPage ? rows.slice(0, safeLimit) : rows;

    const nextCursor =
      hasNextPage && items.length > 0
        ? String(items[items.length - 1].id)
        : null;

    return {
      items,
      pagination: {
        hasNextPage,
        nextCursor,
      },
    };
  }
}
