import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantRepository extends EntityRepository<Tenant> {}
