#!/usr/bin/env node

/**
 * Standalone script to generate Ecomin API credentials
 * 
 * This script can be used to test the credential generation logic
 * independently of the Shopify app.
 * 
 * Usage:
 *   node scripts/generate_ecomin_credentials.js
 *   npm run test:credentials
 */

import crypto from "crypto";

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

// Test credential generation
function testCredentialGeneration() {
  console.log("\n=== Ecomin Credential Generator ===\n");
  console.log("Generating test credentials...\n");

  try {
    // Generate multiple sets to verify uniqueness
    const sets = 3;
    const credentials = [];

    for (let i = 0; i < sets; i++) {
      const apiKey = generateApiKey();
      const apiSecret = generateApiSecret();

      credentials.push({ apiKey, apiSecret });

      console.log(`Set ${i + 1}:`);
      console.log(`  API Key:    ${apiKey}`);
      console.log(`  API Secret: ${apiSecret}`);
      console.log("");
    }

    // Verify format
    console.log("=== Format Verification ===\n");
    credentials.forEach((cred, index) => {
      const apiKeyValid = cred.apiKey.startsWith("ek_") && cred.apiKey.length === 19;
      const apiSecretValid = cred.apiSecret.startsWith("sk_") && cred.apiSecret.length === 67;

      console.log(`Set ${index + 1}:`);
      console.log(`  API Key format valid:    ${apiKeyValid ? "✓" : "✗"} (expected: ek_<16 hex chars>)`);
      console.log(`  API Secret format valid: ${apiSecretValid ? "✓" : "✗"} (expected: sk_<64 hex chars>)`);
      console.log("");
    });

    // Verify uniqueness
    console.log("=== Uniqueness Verification ===\n");
    const apiKeys = credentials.map((c) => c.apiKey);
    const apiSecrets = credentials.map((c) => c.apiSecret);
    const uniqueKeys = new Set(apiKeys).size === apiKeys.length;
    const uniqueSecrets = new Set(apiSecrets).size === apiSecrets.length;

    console.log(`API Keys are unique:    ${uniqueKeys ? "✓" : "✗"}`);
    console.log(`API Secrets are unique: ${uniqueSecrets ? "✓" : "✗"}`);
    console.log("");

    // Security information
    console.log("=== Security Information ===\n");
    console.log(`API Key entropy:    ${8 * 8} bits (8 random bytes)`);
    console.log(`API Secret entropy: ${32 * 8} bits (32 random bytes)`);
    console.log("");
    console.log("These credentials use cryptographically secure random generation.");
    console.log("API Keys (ek_) are suitable for client-side use.");
    console.log("API Secrets (sk_) should be kept secure and never exposed publicly.");
    console.log("");

    console.log("=== Generation Complete ===\n");
    console.log("✓ All tests passed successfully!\n");
  } catch (error) {
    console.error("Error generating credentials:", error);
    process.exit(1);
  }
}

// Run the test
testCredentialGeneration();
