import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { ConfigService } from '@nestjs/config';
import type { MikroOrmModuleAsyncOptions } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';

const ormConfig = defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  extensions: [Migrator],
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  dbName: process.env.DB_NAME ?? 'expense-sharing.db',
  driver: SqliteDriver,
  ensureDatabase: true,
  migrations: {
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
  },
});

export const mikroOrmConfig: MikroOrmModuleAsyncOptions = {
  inject: [ConfigService],

  useFactory: (configService: ConfigService) => {
    return {
      ...ormConfig,
      host: configService.get<string>('DB_HOST') ?? 'localhost',
      port: Number(configService.get<string>('DB_PORT') ?? 5432),
      dbName: configService.get<string>('DB_NAME') ?? 'cyberian',
      ensureDatabase: true,
      registerRequestContext: true,

      // allowGlobalContext: true,
    };
  },
};

export default ormConfig;
