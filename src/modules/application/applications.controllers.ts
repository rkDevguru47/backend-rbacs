//handlers that has business logic in them

import { FastifyReply, FastifyRequest } from "fastify";
import { createApplicationBody } from "./applications.schemas";
import { createApplication, getApplications } from "./applicatons.services";
import { createRole } from "../roles/roles.services";
import { ALL_PERMISSIONS, SYSTEM_ROLES, USER_ROLE_PERMISSIONS } from "../../config/permissions";

export async function createApplicationHandler(
    request:FastifyRequest<{
        //use type from our created schemas
        Body: createApplicationBody
    }>,
    reply:FastifyReply
) {
    const {name} = request.body;

    const application = await createApplication({
        name,
    });

    const superAdminRolePromise = createRole({
        applicationId: application.id,
        name: SYSTEM_ROLES.SUPER_ADMIN,
        permissions: ALL_PERMISSIONS as unknown as Array<string>,
    });

    const applicationUserRolePromise = createRole({
        applicationId: application.id,
        name: SYSTEM_ROLES.APPLICATION_USER,
        permissions: USER_ROLE_PERMISSIONS
    });

    //optimisation to await all promises at one place
    const [superAdminRole,applicationUserRole] = await Promise.allSettled([
        superAdminRolePromise,
        applicationUserRolePromise,
    ]);

    //to safeguard ts from throwing errors
    if(superAdminRole.status === "rejected") {
        throw new Error("Failed to create super admin role");
    }
    if(applicationUserRole.status === "rejected") {
        throw new Error("Failed to create application user role");
    }
    

    return {
        application,
        superAdminRole: superAdminRole.value,
        applicationUserRole: applicationUserRole.value,
    };
}

//to list out our applications
export async function getApplicationshandler() {
    return getApplications();
}