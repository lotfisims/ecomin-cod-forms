import { BlockStack, Text, Banner, Card, InlineStack } from "@shopify/polaris";

export default function GeneralSettings({ shop }) {
  return (
    <BlockStack gap="400">
      <Card>
        <BlockStack gap="300">
          <Text variant="headingMd" as="h3">
            General Settings
          </Text>
          <Text as="p" tone="subdued">
            Configure general app settings and preferences for your store.
          </Text>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="300">
          <Text variant="headingSm" as="h4">
            Store Information
          </Text>
          <InlineStack gap="200" blockAlign="center">
            <Text as="span" fontWeight="semibold">
              Shop Domain:
            </Text>
            <Text as="span">{shop}</Text>
          </InlineStack>
        </BlockStack>
      </Card>

      <Banner tone="info">
        <Text as="p">
          Additional general settings will be available in future updates. This section will
          include app preferences, notification settings, and store configuration options.
        </Text>
      </Banner>
    </BlockStack>
  );
}
