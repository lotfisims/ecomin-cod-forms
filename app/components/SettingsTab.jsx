import { BlockStack, Tabs } from "@shopify/polaris";
import { useState, useCallback } from "react";
import GeneralSettings from "./settings/GeneralSettings";
import PixelsSettings from "./settings/PixelsSettings";
import EcominAPISettings from "./settings/EcominAPISettings";

export default function SettingsTab({ shop }) {
  const [selectedSubTab, setSelectedSubTab] = useState(0);

  const handleSubTabChange = useCallback((selectedTabIndex) => {
    setSelectedSubTab(selectedTabIndex);
  }, []);

  const subTabs = [
    {
      id: "general",
      content: "General",
      panelID: "general-panel",
    },
    {
      id: "pixels",
      content: "Pixels",
      panelID: "pixels-panel",
    },
    {
      id: "ecomin-api",
      content: "Ecomin API",
      panelID: "ecomin-api-panel",
    },
  ];

  return (
    <BlockStack gap="400">
      <Tabs tabs={subTabs} selected={selectedSubTab} onSelect={handleSubTabChange}>
        <div style={{ paddingTop: "1.6rem" }}>
          {selectedSubTab === 0 && <GeneralSettings shop={shop} />}
          {selectedSubTab === 1 && <PixelsSettings />}
          {selectedSubTab === 2 && <EcominAPISettings shop={shop} />}
        </div>
      </Tabs>
    </BlockStack>
  );
}
