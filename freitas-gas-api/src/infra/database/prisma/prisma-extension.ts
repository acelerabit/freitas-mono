import { INestApplication } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

const operationsWatched = ['update', 'create', 'delete'];

export const prismaExtensionFactory = (
  client: PrismaClient<Prisma.PrismaClientOptions, 'query'>,
) => {
  return client.$extends({
    query: {
      $allOperations: async ({ model, operation, args, query }) => {
        /* your custom logic for modifying all Prisma Client operations here */

        if (operationsWatched.includes(operation) && model !== 'Log') {
          /** if you want registry all operations in db, enable it */
          // await client.log.create({
          //   data: {
          //     data: {
          //       model,
          //       operation,
          //       args,
          //       query: JSON.stringify(query),
          //       tag: 'db',
          //     },
          //   },
          // });
        }

        return query(args);
      },
    },
    client: {
      async enableShutdownHooks(app: INestApplication) {
        Prisma.getExtensionContext(client).$on('beforeExit', async () => {
          console.log('Gracefully shutdown prisma');

          await app.close();
        });
      },
    },
  });
};

export type ExtendedPrismaClient = ReturnType<typeof prismaExtensionFactory>;
