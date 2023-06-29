import { FastifyReply, FastifyRequest } from "fastify";
import {
  AssignRoleToUserBody,
  CreateUserBody,
  LoginBody,
} from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.services";
import {
  assignRoleToUser,
  createUser,
  getUserByEmail,
  getUsersByApplication,
} from "./users.services";
import jwt from "jsonwebtoken";
import { logger } from "../../utils/logger";

export async function createUserHandler(
  request: FastifyRequest<{
    Body: CreateUserBody;
  }>,
  reply: FastifyReply
) {
  const { initialUser, ...data } = request.body;

  const roleName = initialUser
    ? SYSTEM_ROLES.SUPER_ADMIN
    : SYSTEM_ROLES.APPLICATION_USER;

  //if this request has initial user set to true them we need to check that
  //it dose have the permission to assume the super admin role
  if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    const appUsers = await getUsersByApplication(data.applicationId);

    if (appUsers.length > 0) {
      return reply.code(400).send({
        message: "Application already has super admin user",
        extensions: {
          code: "APPLICATION_ALRADY_SUPER_USER",
          applicationId: data.applicationId,
        },
      });
    }
  }

  const role = await getRoleByName({
    name: roleName,
    applicationId: data.applicationId,
  });
  //if we see this means something is wrong while creating application or role
  if (!role) {
    return reply.code(404).send({
      message: "Role not found",
    });
  }
  //create a role and assign the role to that user
  try {
    const user = await createUser(data);
    await assignRoleToUser({
      userId: user.id,
      roleId: role.id,
      applicationId: data.applicationId,
    });

    return user;
  } catch (e) {}
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginBody;
  }>,
  reply: FastifyReply
) {
  const { applicationId, email, password } = request.body;

  const user = await getUserByEmail({
    applicationId,
    email,
  });
  if (!user) {
    return reply.code(400).send({
      message: "Invalid Email or Password",
    });
  }

  //to check what this is returning we can write
  //return user;
  // console.log(user);

  //IMP-INFO to check the token we can go to jwt.io and paste it there
  //sign a token for the user
  const token = jwt.sign(
    {
      //can put user's id, application-id, email, list of all permissions this user has
      id: user.id,
      email,
      applicationId,
      scopes: user.permissions,
    },
    "secret"
  ); //change this secret or signing method or game over
  //ideally the signing method will be rs256 means using a public and private key
  //todo ==> later

  return { token };
}

export async function assignRoleToUserHandler(
  request: FastifyRequest<{
    Body: AssignRoleToUserBody;
  }>,

  reply: FastifyReply
) {
  const { userId, roleId, applicationId } = request.body;
  try {
    const result = await assignRoleToUser({
      userId,
      applicationId,
      roleId,
    });

    return result;
  } catch (error) {
    logger.error(error, `error assigning role to user`);
    return reply.code(400).send({
      message: "could not assign role to user",
    });
  }
}
