import {
  BlockStack,
  Text,
  Banner,
  Card,
  Button,
  InlineStack,
  TextField,
  Spinner,
  InlineCode,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

const API_TIMEOUT = 30000; // 30 seconds timeout

export default function EcominAPISettings({ shop }) {
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useState(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch with timeout
  const fetchWithTimeout = async (url, options = {}, timeout = API_TIMEOUT) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Request timeout - please check your connection and try again");
      }
      throw error;
    }
  };

  const handleLoadCredentials = useCallback(async () => {
    if (!isOnline) {
      setError("No internet connection. Please check your network and try again.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.info("Loading existing Ecomin credentials...");
      
      const response = await fetchWithTimeout("/api/ecomin/credentials", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError(
            data.message || "No credentials found. Please generate new credentials first."
          );
        } else if (response.status === 401) {
          setError(
            data.message || "Authentication failed. Please refresh the page and try again."
          );
        } else if (response.status >= 500) {
          setError(
            data.message || "Server error occurred. Please try again later."
          );
        } else {
          setError(data.message || "Failed to load credentials. Please try again.");
        }
        console.error("Error response:", data);
        return;
      }

      if (data.success && data.data) {
        setCredentials(data.data);
        setSuccess("Credentials loaded successfully!");
        console.info("Credentials loaded:", { apiKey: data.data.apiKey });
      } else {
        setError("Invalid response format received from server.");
      }
    } catch (error) {
      console.error("Error loading credentials:", error);
      
      if (error.message.includes("timeout")) {
        setError("Request timed out. Please check your internet connection and try again.");
      } else if (error.message.includes("fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(`Failed to load credentials: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  const handleGenerateCredentials = useCallback(async () => {
    if (!isOnline) {
      setError("No internet connection. Please check your network and try again.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.info("Generating new Ecomin credentials...");
      
      const response = await fetchWithTimeout("/api/ecomin/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            data.message || "Authentication failed. Please refresh the page and try again."
          );
        } else if (response.status === 409) {
          setError(
            data.message || "Conflict occurred. Please try again."
          );
        } else if (response.status >= 500) {
          setError(
            data.message || "Server error occurred. Please try again later."
          );
        } else {
          setError(data.message || "Failed to generate credentials. Please try again.");
        }
        console.error("Error response:", data);
        return;
      }

      if (data.success && data.data) {
        setCredentials(data.data);
        setSuccess(data.message || "Credentials generated successfully!");
        console.info("Credentials generated:", { apiKey: data.data.apiKey });
      } else {
        setError("Invalid response format received from server.");
      }
    } catch (error) {
      console.error("Error generating credentials:", error);
      
      if (error.message.includes("timeout")) {
        setError("Request timed out. Please check your internet connection and try again.");
      } else if (error.message.includes("fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(`Failed to generate credentials: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  return (
    <BlockStack gap="400">
      <Card>
        <BlockStack gap="300">
          <Text variant="headingMd" as="h3">
            Ecomin API Credentials
          </Text>
          <Text as="p" tone="subdued">
            Generate and manage your API credentials to integrate with Ecomin services. These
            credentials are unique to your store and should be kept secure.
          </Text>
        </BlockStack>
      </Card>

      {!isOnline && (
        <Banner tone="critical">
          <Text as="p" fontWeight="semibold">
            No internet connection detected. Please check your network connection.
          </Text>
        </Banner>
      )}

      {error && (
        <Banner tone="critical" onDismiss={() => setError(null)}>
          <Text as="p">{error}</Text>
        </Banner>
      )}

      {success && (
        <Banner tone="success" onDismiss={() => setSuccess(null)}>
          <Text as="p">{success}</Text>
        </Banner>
      )}

      <Card>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h4">
            Actions
          </Text>
          <InlineStack gap="300">
            <Button
              onClick={handleGenerateCredentials}
              loading={loading}
              disabled={loading || !isOnline}
              primary
            >
              Generate New Credentials
            </Button>
            <Button
              onClick={handleLoadCredentials}
              loading={loading}
              disabled={loading || !isOnline}
            >
              Load Existing Credentials
            </Button>
          </InlineStack>
          <Text as="p" tone="subdued">
            {loading ? "Processing your request..." : "Click to generate new or load existing API credentials"}
          </Text>
        </BlockStack>
      </Card>

      {loading && (
        <Card>
          <InlineStack gap="300" align="center" blockAlign="center">
            <Spinner size="small" />
            <Text as="p">Loading credentials...</Text>
          </InlineStack>
        </Card>
      )}

      {credentials && !loading && (
        <Card>
          <BlockStack gap="400">
            <Text variant="headingSm" as="h4">
              Your API Credentials
            </Text>

            <BlockStack gap="300">
              <Text as="p" fontWeight="semibold">
                API Key
              </Text>
              <TextField
                value={credentials.apiKey}
                readOnly
                monospaced
                autoComplete="off"
                helpText="Your public API key (starts with ek_)"
              />
            </BlockStack>

            <BlockStack gap="300">
              <Text as="p" fontWeight="semibold">
                API Secret
              </Text>
              <TextField
                value={credentials.apiSecret}
                readOnly
                monospaced
                type="password"
                autoComplete="off"
                helpText="Your private API secret (starts with sk_) - Keep this secure!"
              />
            </BlockStack>

            <BlockStack gap="200">
              <Text as="p" tone="subdued">
                Created: {new Date(credentials.createdAt).toLocaleString()}
              </Text>
            </BlockStack>

            <Banner tone="warning">
              <BlockStack gap="200">
                <Text as="p" fontWeight="semibold">
                  Security Notice
                </Text>
                <Text as="p">
                  Keep your API secret secure and never share it publicly. These credentials
                  provide access to your Ecomin integration. If compromised, generate new
                  credentials immediately.
                </Text>
              </BlockStack>
            </Banner>
          </BlockStack>
        </Card>
      )}

      <Card>
        <BlockStack gap="300">
          <Text variant="headingSm" as="h4">
            Integration Guide
          </Text>
          <BlockStack gap="200">
            <Text as="p">
              Use these credentials to authenticate API requests to Ecomin services:
            </Text>
            <BlockStack gap="100" inlineAlign="start">
              <Text as="p">
                1. Include your API key in the <InlineCode>X-API-Key</InlineCode> header
              </Text>
              <Text as="p">
                2. Include your API secret in the <InlineCode>X-API-Secret</InlineCode> header
              </Text>
              <Text as="p">3. Make requests to the Ecomin API endpoints</Text>
            </BlockStack>
          </BlockStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
