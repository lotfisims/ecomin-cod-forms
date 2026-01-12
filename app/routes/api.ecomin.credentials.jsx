import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import crypto from "crypto";

// CORS headers for API endpoint
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Generate secure API key with format: ek_<16 hex chars>
function generateApiKey() {
  const randomBytes = crypto.randomBytes(8);
  return `ek_${randomBytes.toString("hex")}`;
}

// Generate secure API secret with format: sk_<64 hex chars>
function generateApiSecret() {
  const randomBytes = crypto.randomBytes(32);
  return `sk_${randomBytes.toString("hex")}`;
}

// Handle OPTIONS request for CORS
export async function options() {
  return json({}, { headers: corsHeaders });
}

// GET endpoint - Retrieve existing credentials
export async function loader({ request }) {
  try {
    console.info("GET /api/ecomin/credentials - Retrieving credentials");
    
    const { session } = await authenticate.admin(request);
    const shop = session.shop;

    console.info(`Fetching credentials for shop: ${shop}`);

    const credentials = await prisma.ecominCredentials.findUnique({
      where: { shop },
    });

    if (!credentials) {
      console.info(`No credentials found for shop: ${shop}`);
      return json(
        {
          success: false,
          error: "No credentials found",
          message: "No API credentials have been generated for this shop yet. Please generate new credentials.",
        },
        { 
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    console.info(`Credentials found for shop: ${shop}`);
    return json(
      {
        success: true,
        data: {
          apiKey: credentials.apiKey,
          apiSecret: credentials.apiSecret,
          createdAt: credentials.createdAt,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error fetching credentials:", error);
    
    if (error.message?.includes("authentication") || error.message?.includes("session")) {
      return json(
        {
          success: false,
          error: "Authentication failed",
          message: "Unable to authenticate your session. Please refresh the page and try again.",
        },
        { 
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    return json(
      {
        success: false,
        error: "Server error",
        message: "An unexpected error occurred while fetching credentials. Please try again later.",
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// POST endpoint - Generate new credentials
export async function action({ request }) {
  if (request.method !== "POST") {
    return json(
      { 
        success: false, 
        error: "Method not allowed",
        message: "Only POST requests are allowed for this endpoint.",
      },
      { 
        status: 405,
        headers: corsHeaders,
      }
    );
  }

  try {
    console.info("POST /api/ecomin/credentials - Generating new credentials");
    
    const { session } = await authenticate.admin(request);
    const shop = session.shop;

    console.info(`Generating credentials for shop: ${shop}`);

    // Generate new secure credentials
    const apiKey = generateApiKey();
    const apiSecret = generateApiSecret();

    console.info(`Generated new credentials for shop: ${shop}`);

    // Upsert credentials (create or update)
    const credentials = await prisma.ecominCredentials.upsert({
      where: { shop },
      update: {
        apiKey,
        apiSecret,
        updatedAt: new Date(),
      },
      create: {
        shop,
        apiKey,
        apiSecret,
      },
    });

    console.info(`Credentials saved for shop: ${shop}`);

    return json(
      {
        success: true,
        data: {
          apiKey: credentials.apiKey,
          apiSecret: credentials.apiSecret,
          createdAt: credentials.createdAt,
        },
        message: "API credentials generated successfully!",
      },
      { 
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error generating credentials:", error);
    
    if (error.message?.includes("authentication") || error.message?.includes("session")) {
      return json(
        {
          success: false,
          error: "Authentication failed",
          message: "Unable to authenticate your session. Please refresh the page and try again.",
        },
        { 
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    if (error.code === "P2002") {
      // Unique constraint violation
      return json(
        {
          success: false,
          error: "Duplicate credentials",
          message: "A conflict occurred while generating credentials. Please try again.",
        },
        { 
          status: 409,
          headers: corsHeaders,
        }
      );
    }

    return json(
      {
        success: false,
        error: "Server error",
        message: "An unexpected error occurred while generating credentials. Please try again later.",
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
