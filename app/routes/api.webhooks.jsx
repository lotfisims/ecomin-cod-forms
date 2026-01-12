import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  console.info(`Webhook received: ${topic} for shop: ${shop}`);

  if (!admin) {
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        // Cleanup is handled in shopify.server.js webhook callback
      }
      break;
    case "APP_SCOPES_UPDATE":
      console.info(`Scopes updated for shop: ${shop}`);
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
