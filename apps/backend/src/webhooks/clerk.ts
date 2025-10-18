import type { IncomingMessage } from "node:http";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { eq } from "drizzle-orm";
import { api } from "encore.dev/api";
import log from "encore.dev/log";
import getRawBody from "raw-body";
import { db } from "@/db/database";
import { users } from "@/db/schema";

async function requestToWeb(
  req: IncomingMessage,
  body: Buffer,
): Promise<Request> {
  const url = `https://${req.headers.host}${req.url}`;
  return new Request(url, {
    method: req.method,
    // @ts-expect-error
    headers: req.headers,
    body,
  });
}

export const clerk = api.raw(
  { expose: true, path: "/webhooks/clerk", method: "POST" },
  async (req, resp) => {
    try {
      const rawBody = await getRawBody(req);
      const webRequest = await requestToWeb(req, rawBody);

      const evt = await verifyWebhook(webRequest);

      if (evt.type === "user.created") {
        const id = evt.data.id;
        const firstName = evt.data.first_name;
        const lastName = evt.data.last_name;
        const image_url = evt.data.image_url;

        if (!firstName || !lastName) {
          resp.writeHead(400, { "Content-Type": "text/plain" });
          resp.end("Missing required user information");
          return;
        }

        const data = {
          name: `${firstName} ${lastName}`,
          id,
          image_url,
        };
        await db.insert(users).values(data);
      } else if (evt.type === "user.updated") {
        const id = evt.data.id;
        const firstName = evt.data.first_name;
        const lastName = evt.data.last_name;
        const image_url = evt.data.image_url;

        if (!id) {
          resp.writeHead(400, { "Content-Type": "text/plain" });
          resp.end("Missing required user information");
          return;
        }

        const data = {
          name: firstName || lastName ? `${firstName} ${lastName}` : undefined,
          image_url,
        };
        await db.update(users).set(data).where(eq(users.id, id));
      }

      resp.writeHead(200, { "Content-Type": "text/plain" });
      resp.end("Success");
    } catch (error) {
      log.error("Webhook Verification Failed", error);
      resp.writeHead(500, { "Content-Type": "text/plain" });
      resp.end("Webhook Verification Failed");
    }
  },
);
