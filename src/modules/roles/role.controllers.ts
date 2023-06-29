import { FastifyReply, FastifyRequest } from "fastify";
import { CreateRoleBody } from "./role.schemas";
import { createRole } from "./roles.services";

//defination of our handler-- role
export async function createRoleHandler(
  request: FastifyRequest<{
    Body: CreateRoleBody;
  }>,
  reply: FastifyReply
) {
  const { name, permissions, applicationId } = request.body;

  const role = await createRole({ name, permissions, applicationId });

  return role;
}