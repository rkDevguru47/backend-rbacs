

import { InferModel, and, eq } from "drizzle-orm";
import { db } from "../../db";
import { roles } from "../../db/schema";

export async function createRole(data:InferModel<typeof roles,"insert">){
    const result = await db.insert(roles).values(data).returning();

    return result[0];
}

export async function getRoleByName({
    name,
    applicationId
}:{
    name: string;
    applicationId: string;
}){
    //SELECT * From roles WHERE name = $1 AND applicationId = $2 LIMIT 1
    //this is how to do this in drizzle orm
    const result = await db.select().from(roles).where(
        and(
            eq(roles.name,name),
            eq(roles.applicationId,applicationId)
        )
    ).limit(1);

    return result[0];
}