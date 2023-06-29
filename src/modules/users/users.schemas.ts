import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

//create user schema
const createUserBodySchema = z.object({
  //z will inforce that this is a email
  email: z.string().email(),
  name: z.string(),
  //everything needs a applicationId as all the resources are linked back to a application
  applicationId: z.string().uuid(),
  //password needs to be at least 6 characters
  password: z.string().min(6),
  //only for the first user to be created / or setting up the application
  initialUser: z.boolean().optional(),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;

export const createUserJsonSchema = {
  body: zodToJsonSchema(createUserBodySchema, "createUserBodySchema"),
  //can define other properties like headers, params, query etc
};

//login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  applicationId: z.string(),
});
export type LoginBody = z.infer<typeof loginSchema>;

export const loginJsonSchema = {
  body: zodToJsonSchema(loginSchema, "loginSchema"),
};

//Assign role to user Schema
const assignRoleToUserBody = z.object({
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
  applicationId: z.string().uuid(),
});

export type AssignRoleToUserBody = z.infer<typeof assignRoleToUserBody>;

export const assignRoleTouserJsonSchema = {
  body: zodToJsonSchema(assignRoleToUserBody, "assignRoleToUserBody"),
};
