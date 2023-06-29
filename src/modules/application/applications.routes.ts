import { FastifyInstance } from "fastify";
import {
  createApplicationHandler,
  getApplicationshandler,
} from "./applications.controllers";
import { createApplicationJsonSchema } from "./applications.schemas";

//do not remove async here as fastify does not support sync routes
//as for any plugin we are using
export async function applicationRoutes(app: FastifyInstance) {
  //route to create a application
  app.post(
    "/",
    {
      schema: createApplicationJsonSchema,
    },
    createApplicationHandler
  );

  app.get("/", getApplicationshandler);
}
