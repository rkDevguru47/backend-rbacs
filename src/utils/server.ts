//this is a  instance of fastify

import fastify from "fastify";
import { logger } from "./logger";
import { applicationRoutes } from "../modules/application/applications.routes";
import { usersRoutes } from "../modules/users/users.routes";
import { roleRoutes } from "../modules/roles/role.routes";
import  guard  from "fastify-guard";
import jwt from "jsonwebtoken"

 //can add other properties if we want
 type User = {
    id: string;
    applicationId: string;
    scopes: Array<string>;
  };
  

//tell fastify types that a user is going to exist on a request
declare module "fastify" {
  export interface FastifyRequest {
    user: User;
  }
}


export async function buildServer() {
  const app = fastify({
    logger,
  });

 //====>>so we put user in the fastify object so we can modify later on
  app.decorateRequest("user", null);//user->object that we will put in the request-->null is an object


  //hook to attach user to the request 
  app.addHook('onRequest', async function(request, reply)  {
    //put bearer token inside authHeader
    const authHeader = request.headers.authorization;
    if(!authHeader){
        return;
    }

    try{
        const token = authHeader.replace('Bearer ',"");
        const decoded = jwt.verify(token, "secret") as User;
        //replace secret with something better or a different signing algorithm
        console.log("user", decoded);
        request.user = decoded;//we will have to mutate the request here-- time-- rebuild request
        //so we put user in the fastify object so we can modify later on

    }catch(e){

    }
     

  });


  //register plugin
  app.register(guard,{
    //tell guars which property in the request we can find the user
    requestProperty: "user",
    scopeProperty: "scopes",

    errorHandler: (result, request, reply) => {
        return reply.send("You are not allowed to do that!")
    },
  });

  //register routes
  app.register(applicationRoutes, { prefix: "/api/applications" });
  app.register(usersRoutes, { prefix: "/api/users" });
  app.register(roleRoutes, { prefix: "/api/roles" });

  return app;
}
