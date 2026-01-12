import { BlockStack, Text, Banner, InlineStack, Icon } from "@shopify/polaris";
import { AlertCircleIcon } from "@shopify/polaris-icons";

export default function SalesBoosterTab() {
  return (
    <BlockStack gap="400">
      <Banner tone="info">
        <BlockStack gap="200">
          <Text variant="headingMd" as="h3">
            Sales Booster Feature
          </Text>
          <Text as="p">
            This section will provide tools to increase your sales and conversions. Features coming
            soon:
          </Text>
        </BlockStack>
      </Banner>

      <BlockStack gap="300">
        <InlineStack gap="200" align="start">
          <Icon source={AlertCircleIcon} tone="base" />
          <Text as="p" fontWeight="semibold">
            Upcoming Features:
          </Text>
        </InlineStack>
        <BlockStack gap="200" inlineAlign="start">
          <Text as="p">• Upsell and cross-sell recommendations</Text>
          <Text as="p">• Limited-time offer popups and banners</Text>
          <Text as="p">• Urgency timers and stock counters</Text>
          <Text as="p">• Product bundles and discounts</Text>
          <Text as="p">• Cart abandonment recovery</Text>
          <Text as="p">• Customer segmentation tools</Text>
          <Text as="p">• A/B testing for campaigns</Text>
          <Text as="p">• Performance analytics and insights</Text>
        </BlockStack>
      </BlockStack>

      <Banner tone="warning">
        <Text as="p">
          This feature is currently under development. Please check back later for updates.
        </Text>
      </Banner>
    </BlockStack>
  );
}
