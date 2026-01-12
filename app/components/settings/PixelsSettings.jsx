import { BlockStack, Text, Banner, Card, InlineStack, Icon } from "@shopify/polaris";
import { AlertCircleIcon } from "@shopify/polaris-icons";

export default function PixelsSettings() {
  return (
    <BlockStack gap="400">
      <Card>
        <BlockStack gap="300">
          <Text variant="headingMd" as="h3">
            Pixels Integration
          </Text>
          <Text as="p" tone="subdued">
            Connect your Facebook and TikTok pixels to track conversions and optimize your
            advertising campaigns.
          </Text>
        </BlockStack>
      </Card>

      <Banner tone="info">
        <BlockStack gap="200">
          <Text variant="headingSm" as="h4">
            Coming Soon: Pixel Tracking
          </Text>
          <Text as="p">
            This section will allow you to integrate tracking pixels from major advertising
            platforms.
          </Text>
        </BlockStack>
      </Banner>

      <Card>
        <BlockStack gap="300">
          <InlineStack gap="200" align="start">
            <Icon source={AlertCircleIcon} tone="base" />
            <Text as="p" fontWeight="semibold">
              Planned Integrations:
            </Text>
          </InlineStack>
          <BlockStack gap="200" inlineAlign="start">
            <Text as="p">• Facebook Pixel - Track website visitors and conversions</Text>
            <Text as="p">• TikTok Pixel - Measure ad performance and audience insights</Text>
            <Text as="p">• Google Analytics - Advanced analytics and reporting</Text>
            <Text as="p">• Custom event tracking and conversion optimization</Text>
            <Text as="p">• Real-time analytics dashboard</Text>
          </BlockStack>
        </BlockStack>
      </Card>

      <Banner tone="warning">
        <Text as="p">
          Pixel integration features are currently under development. Stay tuned for updates!
        </Text>
      </Banner>
    </BlockStack>
  );
}
