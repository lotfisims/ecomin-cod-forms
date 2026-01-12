import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Page,
  Layout,
  Card,
  Tabs,
  Text,
  BlockStack,
  Banner,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import CODFormTab from "../components/CODFormTab";
import SalesBoosterTab from "../components/SalesBoosterTab";
import SettingsTab from "../components/SettingsTab";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  
  return json({
    shop: session.shop,
    apiKey: process.env.SHOPIFY_API_KEY,
  });
};

export default function Index() {
  const { shop } = useLoaderData();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
  }, []);

  const tabs = [
    {
      id: "cod-form",
      content: "COD Form",
      panelID: "cod-form-panel",
    },
    {
      id: "sales-booster",
      content: "Sales Booster",
      panelID: "sales-booster-panel",
    },
    {
      id: "settings",
      content: "Settings & Integration",
      panelID: "settings-panel",
    },
  ];

  return (
    <Page>
      <TitleBar title="Ecomin Connector and Forms" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingLg" as="h1">
                Welcome to Ecomin Connector and Forms
              </Text>
              <Text as="p" tone="subdued">
                Shop: {shop}
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card padding="0">
            <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
              <div style={{ padding: "1.6rem" }}>
                {selectedTab === 0 && <CODFormTab />}
                {selectedTab === 1 && <SalesBoosterTab />}
                {selectedTab === 2 && <SettingsTab shop={shop} />}
              </div>
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
