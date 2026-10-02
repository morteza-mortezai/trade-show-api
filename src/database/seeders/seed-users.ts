import { MikroORM } from '@mikro-orm/sqlite';
import ormConfig from '../../config/mikro-orm.config';
import { User } from '../../modules/user/entities/user.entity';

const PEOPLE = [
  'Ava Carter',
  'Noah Bennett',
  'Mia Thompson',
  'Liam Parker',
  'Sophia Morgan',
  'Ethan Foster',
  'Olivia Reed',
  'Lucas Hayes',
  'Emma Collins',
  'James Walker',
  'Isabella Brooks',
  'Henry Cooper',
] as const;

async function seedUsers() {
  const orm = await MikroORM.init(ormConfig);

  try {
    const em = orm.em.fork();
    const existingUsers = await em.find(User, {});
    const existingNames = new Set(
      existingUsers.map((user) => user.fullName.toLocaleLowerCase()),
    );
    const usersToCreate = PEOPLE.filter(
      (fullName) => !existingNames.has(fullName.toLocaleLowerCase()),
    ).map((fullName) => em.create(User, { fullName }));

    if (usersToCreate.length > 0) {
      await em.persistAndFlush(usersToCreate);
    }

    console.log(
      `User seed complete: ${usersToCreate.length} added, ${PEOPLE.length - usersToCreate.length} already present.`,
    );
  } finally {
    await orm.close(true);
  }
}

void seedUsers().catch((error: unknown) => {
  console.error('User seed failed.', error);
  process.exitCode = 1;
});
