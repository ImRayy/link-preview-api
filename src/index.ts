import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { fetchLinkPreview } from "./features/link-preview.js";
import verifyAPIKey from "./middlewares/verify-api-key.js";
import type { HonoBindings } from "./types/hono.js";

const app = new Hono<HonoBindings>();

app.use("*", verifyAPIKey);

app.get("/", (c) => {
  return c.text("link-preview-api");
});

app.post("/api/v1", async (c) => {
  const { url } = await c.req.json();

  if (!url || url.trim() === "") {
    throw new HTTPException(400, { message: "url is required" });
  }

  const metadata = await fetchLinkPreview(url);

  if (!metadata.data) {
    throw new HTTPException(500, { message: "Failed to fetch link preview" });
  }

  return c.json(metadata);
});

export default app;
