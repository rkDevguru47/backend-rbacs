
//drizzle can take schemas and create migration for you
//can also run those migrations for you
// also gives you typescript support inside yoor appliction code 

import {pgTable,primaryKey,text,timestamp,uniqueIndex,uuid, varchar} from "drizzle-orm/pg-core";


//here we are creating a table called applications
export const applications = pgTable("applications",{
    //drizzle will automatically create an id column that will be unique
    id: uuid("id").primaryKey().defaultRandom(),
    //cant have a application that dosent have a name defined
    name: varchar('name',{length: 256}).notNull(),
    //timestamp(' here we put name of what we are defining ')
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

//user schema
//1st arg is name 2nd is the schema and the third is indexes
export const users = pgTable('users',{
    //composite primary key used here of id and email
    id: uuid('id').defaultRandom().notNull(),
    email: varchar('email',{length: 256}).notNull(),
    name: varchar('name',{length: 256}).notNull(),
    applicationId: uuid('applicationId').references(()=>applications.id),
    password: varchar('password',{length: 256}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
},(users)=>{
    return {
        //cpk-composite primary key 
        //email dosent have to be unique but the combiantion with the applictionId 
        // have to be unique
        cpk:primaryKey(users.email,users.applicationId),
        //index on id here as id is not a primary key 
        // so it dosent have a unique index on it 
        // we need to use this in a joint table later on
        idIndex: uniqueIndex("users_id_index").on(users.id),
    };
});

//3rd table for roles 
export const roles = pgTable('roles',{
    //same as users schema
       //composite primary key used here of id and email
       id: uuid('id').defaultRandom().notNull(),
       name: varchar('name',{length: 256}).notNull(),
       applicationId: uuid('applicationId').references(()=>applications.id),
       //hard coded array of text fields
       //no table for permissions as it may add a lot of complexlexity to our app
       permissions: text('permisions').array().$type<Array<string>>(), 
       createdAt: timestamp('created_at').defaultNow().notNull(),
       updatedAt: timestamp('updated_at').defaultNow().notNull(),
   },(roles)=>{
       return {
           //cpk-composite primary key 
           //role anme dosent have to be uniquie but the combiantion with the applictionId
           //as application can have many roles 
           cpk:primaryKey(roles.name,roles.applicationId), 
           //index on id here as id is not a primary key 
           // so it dosent have a unique index on it 
           // we need to use this in a joint table later on
           idIndex: uniqueIndex("roles_id_index").on(roles.id),
       };
})
    //if app is not multi-tenanted then this joint table will be between users and roles
    // as users can have many roles and a role can be assigned to many users -> many to many relationship bet. users and roles
//joint table between our role, users and our application
export const usersToRoles = pgTable('usersToRoles',{
    //these three properties here need not be unique on their own but together they have to be unique
    applicationId: uuid('applicationId').references(()=>applications.id).notNull(),
    roleId: uuid('roleId').references(()=>roles.id).notNull(),
    userId: uuid('userId').references(()=>users.id).notNull(), 
},(usersToRoles)=>{
    return{
        cpk:primaryKey(
            usersToRoles.applicationId,
            usersToRoles.roleId,
            usersToRoles.userId
        )
    }
});

//this is good as we got our tables done in the neon db                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                