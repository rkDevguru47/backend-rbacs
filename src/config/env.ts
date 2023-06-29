//to setup environment variables

//zennv is a module that allows you to get environment variables using a zod config
import zennv from "zennv";
import { z } from "zod";

export const env = zennv({
  //means we are going to get our environment variables from .env file
  dotenv: true,
  //defining schema : zod schema
  schema: z.object({
    PORT: z.number().default(3000),
    HOST: z.string().default("0.0.0.0"),
    DATABASE_CONNECTION: z.string(),
  }),
});
