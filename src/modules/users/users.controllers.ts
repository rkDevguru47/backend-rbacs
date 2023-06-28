import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBody } from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.services";
import { assignRoleToUser, createUser, getUsersByApplication } from "./users.services";

export async function createUserHandler(
    request: FastifyRequest<{
        Body:CreateUserBody
    }>,
    reply: FastifyReply
    ){

        const { initialUser,...data} = request.body;

        const roleName = initialUser ? SYSTEM_ROLES.SUPER_ADMIN : SYSTEM_ROLES.APPLICATION_USER;

        //if this request has initial user set to true them we need to check that
        //it dose have the permission to assume the super admin role
        if(roleName === SYSTEM_ROLES.SUPER_ADMIN){
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
        try{
            const user = await createUser(data);
            await assignRoleToUser({
              userId: user.id,
              roleId: role.id,
              applicationId: data.applicationId,
            })

            return user;
        }catch(e){

        }
}