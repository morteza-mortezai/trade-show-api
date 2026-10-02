# API2

NestJS backend API using MikroORM and PostgreSQL.

## Setup

Install dependencies:

```bash
npm install
```

Create your `.env` file and configure the database connection.

## Run Migrations & Seed Database

To reset the database, run all migrations, and seed the data:

```bash
npm run db:reset
```

The default user seeder creates 12 people for testing shared expenses. It is idempotent, so it can also be run on its own without duplicating those people:

```bash
npm run db:seed
```

> **Warning:** `db:reset` drops the existing database schema before recreating it.

## Run Project

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

## Swagger

API documentation is available at:

```text
/docs
```
