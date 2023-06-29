//this is a  instance of fastify

import fastify from "fastify";
import { logger } from "./logger";
import { applicationRoutes } from "../modules/application/applications.routes";
import { usersRoutes } from "../modules/users/users.routes";
import { roleRoutes } from "../modules/roles/role.routes";

export async function buildServer() {
  const app = fastify({
    logger,
  });

  //register plugin

  //register routes
  app.register(applicationRoutes, { prefix: "/api/applications" });
  app.register(usersRoutes, { prefix: "/api/users" });
  app.register(roleRoutes, { prefix: "/api/roles" });

  return app;
}
