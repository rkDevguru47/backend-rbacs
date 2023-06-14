//this is a  instance of fastify    



import fastify from "fastify";
import { logger } from "./logger";
import { applicationRoutes } from "../modules/application/applications.routes";

export async function buildServer(){
    const app = fastify({
        logger,
    });
    
    //register plugin

    //register routes
    app.register(applicationRoutes,{prefix:"/api/applications"});


    return app;
}
