import { NavLink } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactNode } from "react";

export type NavTab = {
  label: string;
  path?: string;
  nestedTabs?: NavTab[];
  onClick?: () => void;
  Icon?: ReactNode;
  disabled?: boolean;
};

export type Props = {
  onChange?: (path: string) => void;
  tabs: NavTab[];
};

const NavTabs = (props: Props) => {
  const { onChange, tabs } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = tabs.find((tab) => location.pathname.includes(tab.path));
  const activeTabPath = activeTab?.path || "";
  return (
    <>
      {tabs.map((tab) => (
        <NavLink
          key={`${tab.label}-${tab.path}`}
          active={activeTabPath === tab.path}
          label={tab.label}
          onClick={() => {
            onChange?.(tab.path);
            tab.onClick?.();
            tab.path && navigate(tab.path);
          }}
          icon={tab?.Icon}
          disabled={tab.disabled}
        >
          {tab.nestedTabs && (
            <NavTabs onChange={onChange} tabs={tab.nestedTabs} />
          )}
        </NavLink>
      ))}
    </>
  );
};

export default NavTabs;
