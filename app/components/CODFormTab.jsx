import { BlockStack, Text, Banner, InlineStack, Icon } from "@shopify/polaris";
import { AlertCircleIcon } from "@shopify/polaris-icons";

export default function CODFormTab() {
  return (
    <BlockStack gap="400">
      <Banner tone="info">
        <BlockStack gap="200">
          <Text variant="headingMd" as="h3">
            COD Form Feature
          </Text>
          <Text as="p">
            This section will allow you to create and manage Cash on Delivery (COD) forms for your
            Shopify store. Features coming soon:
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
          <Text as="p">• Custom COD form builder with drag-and-drop interface</Text>
          <Text as="p">• Form field validation and conditional logic</Text>
          <Text as="p">• Integration with checkout process</Text>
          <Text as="p">• Order management for COD transactions</Text>
          <Text as="p">• Customer data collection and management</Text>
          <Text as="p">• Email notifications and confirmations</Text>
          <Text as="p">• Analytics and reporting dashboard</Text>
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
