import pino from "pino";

export const logger = pino({
  //to redact all the things that are not needed in the logs.
  redact: ["DATABASE_CONNECTION"],

  //to set the level of the logs.
  level: "debug",

  //pino docs recommends to not use the pino-pretty package for production.
  //but here we use it for development purposes.
  //see https://getpino.io/#/docs/api?id=pretty-print for more info.

  transport: {
    target: "pino-pretty",
  },
});
