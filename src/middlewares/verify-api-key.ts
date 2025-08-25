import type { Context, Next } from "hono";
import { env } from "hono/adapter";
import type { HonoBindings } from "../types/hono.js";

const verifyAPIKey = async (c: Context<HonoBindings>, next: Next) => {
  const { API_KEY } = env(c);

  if (!API_KEY || API_KEY.trim() === "") {
    return c.text("API_KEY key not found");
  }

  if (c.req.header("x-api-key") !== API_KEY) {
    return c.text("Invalid API_KEY", 401);
  }

  return next();
};

export default verifyAPIKey;
