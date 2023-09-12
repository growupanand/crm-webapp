import { NavTab } from "@app/components/navTabs";
import SettingLayoutPage from "./components/settingsLayout";

const tabs = [{ label: "Details", path: "details" }] as NavTab[];

function OrganizationSettingsLayout() {
  return <SettingLayoutPage tabs={tabs} title="Organization settings" />;
}

export default OrganizationSettingsLayout;
