import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantRepository } from './tenant.repository';
import { Tenant } from './entities/tenant.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TenantService {
  constructor(private readonly tenantRepository: TenantRepository) {}
  create(createTenantDto: CreateTenantDto) {
    return 'This action adds a new tenant';
  }

  findAll() {
    return `This action returns all tenant`;
  }

  findByNameOrFail(tenantName: string) {
    return this.tenantRepository.findOne({ name: tenantName });
  }

  async findByNameAndPhoneOrFail(
    tenantName: string,
    userPhone: string,
  ): Promise<{ tenant: Tenant; user: User }> {
    const tenant = await this.tenantRepository.findOne(
      {
        name: tenantName,
        users: { phone: userPhone },
      },
      { populate: ['users'], populateFilter: { users: { phone: userPhone } } },
    );
    if (!tenant) {
      throw new BadRequestException(
        `Teanant with ${tenantName} and ${userPhone} not found !`,
      );
    }

    const user = tenant.users[0];
    if (!user) {
      throw new BadRequestException(
        `User with phone ${userPhone} not found in tenant ${tenantName}`,
      );
    }
    return { tenant, user };
  }

  findOne(id: number) {
    return `This action returns a #${id} tenant`;
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
