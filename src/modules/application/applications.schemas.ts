//need to create a schema to type that body
//used zod to create our schemas but Fastify takes json schemas so we need to convert to that type

import { z } from "zod";
import zodtoJsonSchema from "zod-to-json-schema";

const createApplicationBodySchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
});

//ts type to use to type our body
//infer is a generic that takes typeof createApplicationBodySchema
export type createApplicationBody = z.infer<typeof createApplicationBodySchema>;

export const createApplicationJsonSchema = {
  //need to cast createApplicationBodySchema (zod object) to json (fastify json schema)
  body: zodtoJsonSchema(
    createApplicationBodySchema,
    "createApplicationBodySchema"
  ),
};
