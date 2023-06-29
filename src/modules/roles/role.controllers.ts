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
    //to guard against unauthorised access by injection of application ids
    const user = request.user;
    const applicationId = user.applicationId;

  const { name, permissions } = request.body;

  const role = await createRole({ name, permissions, applicationId });

  return role;
}
