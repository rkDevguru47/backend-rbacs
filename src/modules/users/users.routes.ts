import { FastifyInstance } from "fastify";
import {
  assignRoleToUserHandler,
  createUserHandler,
  loginHandler,
} from "./users.controllers";
import {
  assignRoleTouserJsonSchema,
  createUserJsonSchema,
  loginJsonSchema,
} from "./users.schemas";

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  );

  app.post(
    "/login",
    {
      schema: loginJsonSchema,
    },
    loginHandler
  );

  app.post(
    "/roles",
    {
      schema: assignRoleTouserJsonSchema,
    },
    assignRoleToUserHandler
  );
}
