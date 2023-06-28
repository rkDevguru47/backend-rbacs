//service for creating a user

import { InferModel, and, eq } from "drizzle-orm";
import { applications, roles, users, usersToRoles } from "../../db/schema";
import { db } from "../../db";
import argon2 from "argon2";

export async function createUser(data: InferModel<typeof users,'insert'>) {
    
    const hashedPassword = await argon2.hash(data.password)

    const result = await db.insert(users).values({
        //password needs to be below so we do not include it in data
        ...data,
        password: hashedPassword
    }).returning({  //not pass all the values
        id:users.id,
        email: users.email,
        name: users.name,
        applicationId: applications.id,
    });
    return result[0];
}

//returns all the users for the application
//can optimise this query by only selection the id from the user and putting the limit as 1 
export async function getUsersByApplication(applicationId: string) {
    const result = await db
    .select()
    .from(users)
    .where(
        eq(users.applicationId, applicationId)
    );
    return result;
}

//service to assign role to the user 
export async function assignRoleToUser(data: InferModel<typeof usersToRoles,'insert'>){
    const result = await db.insert(usersToRoles).values(data).returning();

    return result[0];
}

//service to get user by their email address
export async function getUserByEmail({
    email,
    applicationId,
}:{
    email:string,
    applicationId:string,
}  ) {
    //query to get the user by their email address
    const result = await db.select().from(users).where(
        and(
            eq(users.email, email),
            eq(users.applicationId, applicationId)
        )//LEFT JOIN
        //FROM usersToRoles
        //ON usersToRoles.userId = users.id
        //AND usersToRoles.applicationId = users.applicationId
    ).leftJoin(usersToRoles,
        and(
            eq(usersToRoles.userId, users.id),
            eq(usersToRoles.applicationId, applicationId)
        )
        //LEFT JOIN 
        //FROM roles
        //ON roles.id = usersToRoles.roleId
    ).leftJoin(roles,
        eq(roles.id, usersToRoles.roleId)
        );  


    //will get back multiple results if there are multiple roles for the user
        //console.log(result);
    if(!result.length){
        return null;
    }

    
    return result;  
}