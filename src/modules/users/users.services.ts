//service for creating a user

import { InferModel, eq } from "drizzle-orm";
import { applications, users, usersToRoles } from "../../db/schema";
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