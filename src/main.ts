import { migrate } from "drizzle-orm/node-postgres/migrator";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { buildServer } from "./utils/server";
import { db } from "./db";

async function gracefulShutdown({
  app,
}: {
  //awaited and return type are utility fn.s ts comes with
  app: Awaited<ReturnType<typeof buildServer>>;
}) {
  await app.close();
}

async function main() {
  const app = await buildServer();

  //app.listen returns a promice so we should await it
  await app.listen({
    port: env.PORT,
    host: env.HOST,
  });

  //to run this migrater
  await migrate(db, {
    migrationsFolder: "./migrations",
  });

  //singint = singnal interrupt and sinterm = singnal terminate
  const signals = ["SIGINT", "SIGTERM"];

  logger.debug(env, "using env");

  //--dosent work in ps 7.1.4-preview
  //loop to listen to thise signals
  for (const signal of signals) {
    process.on(signal, () => {
      gracefulShutdown({
        app,
      });
    });
  }
}

main();
