import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { envValidationSchema } from './config/env.validation';
import { appConfig } from './config/app.config';
import { mikroOrmConfig } from './config/mikro-orm.config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { TenantModule } from './modules/tenant/tenant.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { UtilModule } from './modules/util/util.module';
import { NotificationModule } from './modules/notification/notification.module';
import { jwtConfig } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      load: [appConfig],
      validationOptions: {
        libraryOptions: {
          abortEarly: true,
        },
      },
    }),
    JwtModule.registerAsync({
      ...jwtConfig,
      global: true,
    }),
    UserModule,
    MikroOrmModule.forRootAsync(mikroOrmConfig),
    TenantModule,
    InvoiceModule,
    CustomerModule,
    ProductModule,
    AuthModule,
    RoleModule,
    UtilModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
