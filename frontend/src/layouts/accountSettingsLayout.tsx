import { NavTab } from "@app/components/navTabs";
import SettingLayoutPage from "./components/settingsLayout";

const tabs = [
  { label: "Account", path: "account" },
  { label: "Change Password", path: "change-password" },
] as NavTab[];

function AccountSettingsLayout() {
  return <SettingLayoutPage tabs={tabs} title="Account settings" />;
}

export default AccountSettingsLayout;
