import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { login } from "../../shopify.server";
import { LoginErrorType } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { Page, Card, Text, Button, BlockStack } from "@shopify/polaris";

export const loader = async ({ request }) => {
  const errors = login(request);
  
  return json({
    errors,
    polarisTranslations: require("@shopify/polaris/locales/en.json"),
  });
};

export default function AuthLogin() {
  const { errors, polarisTranslations } = useLoaderData();

  return (
    <AppProvider i18n={polarisTranslations}>
      <Page>
        <Card>
          <BlockStack gap="400">
            <Text variant="headingLg" as="h1">
              Ecomin Connector and Forms
            </Text>
            <Text as="p">
              Please enter your shop domain to log in or install the app.
            </Text>
            <Form method="post" action="/auth/login">
              <BlockStack gap="400">
                <input
                  type="text"
                  name="shop"
                  placeholder="your-shop.myshopify.com"
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #c4cdd5",
                    borderRadius: "4px",
                    width: "100%",
                  }}
                />
                {errors?.shop && (
                  <Text tone="critical" as="p">
                    {errors.shop}
                  </Text>
                )}
                <Button submit primary>
                  Continue
                </Button>
              </BlockStack>
            </Form>
          </BlockStack>
        </Card>
      </Page>
    </AppProvider>
  );
}
