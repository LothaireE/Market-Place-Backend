import { GraphQLError } from "graphql";

export const forbid = (msg: string) =>
  new GraphQLError("Forbidden", { extensions: { code: "FORBIDDEN", error: msg } });

export const unauth = (msg: string) =>
  new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHORIZED", error: msg } });

export const notFound = (msg = "Resource not found") =>
  new GraphQLError("Not Found", { extensions: { code: "NOT_FOUND", error: msg } });
