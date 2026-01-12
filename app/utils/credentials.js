import crypto from "crypto";

/**
 * Utility functions for generating secure API credentials
 */

/**
 * Generate a secure API key with format: ek_<16 hex chars>
 * Uses 8 random bytes (64 bits of entropy)
 * 
 * @returns {string} API key in format "ek_xxxxxxxxxxxxxxxx"
 */
export function generateApiKey() {
  const randomBytes = crypto.randomBytes(8);
  return `ek_${randomBytes.toString("hex")}`;
}

/**
 * Generate a secure API secret with format: sk_<64 hex chars>
 * Uses 32 random bytes (256 bits of entropy)
 * 
 * @returns {string} API secret in format "sk_xx...xx" (67 chars total)
 */
export function generateApiSecret() {
  const randomBytes = crypto.randomBytes(32);
  return `sk_${randomBytes.toString("hex")}`;
}

/**
 * Validate API key format
 * 
 * @param {string} apiKey - The API key to validate
 * @returns {boolean} True if valid format
 */
export function validateApiKeyFormat(apiKey) {
  if (typeof apiKey !== "string") return false;
  if (!apiKey.startsWith("ek_")) return false;
  if (apiKey.length !== 19) return false;
  
  const hexPart = apiKey.slice(3);
  return /^[0-9a-f]{16}$/.test(hexPart);
}

/**
 * Validate API secret format
 * 
 * @param {string} apiSecret - The API secret to validate
 * @returns {boolean} True if valid format
 */
export function validateApiSecretFormat(apiSecret) {
  if (typeof apiSecret !== "string") return false;
  if (!apiSecret.startsWith("sk_")) return false;
  if (apiSecret.length !== 67) return false;
  
  const hexPart = apiSecret.slice(3);
  return /^[0-9a-f]{64}$/.test(hexPart);
}

/**
 * Mask an API secret for safe display
 * Shows only the first 7 characters and last 4 characters
 * 
 * @param {string} apiSecret - The API secret to mask
 * @returns {string} Masked secret
 */
export function maskApiSecret(apiSecret) {
  if (!apiSecret || apiSecret.length < 12) {
    return "****";
  }
  const start = apiSecret.slice(0, 7);
  const end = apiSecret.slice(-4);
  return `${start}...${end}`;
}

export default {
  generateApiKey,
  generateApiSecret,
  validateApiKeyFormat,
  validateApiSecretFormat,
  maskApiSecret,
};
