//services we use to communicate with our database
//need two services 1-create application 2-list application

import { InferModel } from "drizzle-orm";
import { db } from "../../db";
import { applications } from "../../db/schema";

export async function createApplication(
    data:InferModel<typeof applications,"insert">
    ) {
    const result = await db.insert(applications).values(data).returning()

    //result retuns an array, need 1 item
    return result[0]
}

export async function getApplications() {
    //we need SELECT id, name, createdAt from applications
    const result = await db.select({
        id:applications.id,
        name:applications.name,
        createdAt:applications.createdAt,
    })
     .from(applications);

    return result;

}