import Client, { Environment, Local } from "./client";
import { config } from "./config";

/**
 * Returns the generated Encore request client for either the local or staging environment.
 * If we are running the frontend locally we assume that our Encore backend is also running locally.
 */
const getRequestClient = (token: string | undefined) => {
  const env =
    config.environment === "development" ? Local : Environment("staging");

  return new Client(env, {
    auth: { authorization: token || "" },
  });
};

export default getRequestClient;
