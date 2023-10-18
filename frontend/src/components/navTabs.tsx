import React, { useState } from "react";
import { Box, NavLink, Text } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactNode } from "react";

export type NavTab = {
  label: string;
  path?: string;
  nestedTabs?: NavTab[];
  onClick?: () => void;
  Icon?: ReactNode;
  disabled?: boolean;
  /** Overwrite function to check if the current tab is active */
  isActive?: (path: string) => boolean;
};

export type Props = {
  onChange?: (path: string) => void;
  tabs: NavTab[];
  disabled?: boolean;
};

const NavTabs = (props: Props) => {
  const { onChange, tabs } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = tabs.find((tab) => location.pathname.includes(tab.path));
  const activeTabPath = activeTab?.path || "";

  // State to manage the visibility of the mobile menu
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <nav>
      <div className="desktop-nav">
        {tabs.map((tab) => (
          <NavLink
            key={`${tab.label}-${tab.path}`}
            active={
              tab.isActive !== undefined
                ? tab.isActive(tab.path)
                : activeTabPath === tab.path
            }
            label={tab.label}
            onClick={() => {
              onChange?.(tab.path);
              tab.onClick?.();
              tab.path && navigate(tab.path);
            }}
            icon={tab?.Icon}
            disabled={props.disabled || tab.disabled}
          >
            {tab.nestedTabs && (
              <Box mb={2}>
                <NavTabs onChange={onChange} tabs={tab.nestedTabs} />
              </Box>
            )}
          </NavLink>
        ))}
      </div>
      <div className="mobile-nav">
        <button className="hamburger-menu" onClick={toggleMobileMenu}>
          ☰
        </button>
        {mobileMenuVisible && (
          <div className="mobile-menu">
            {tabs.map((tab) => (
              <NavLink
                key={`${tab.label}-${tab.path}`}
                active={
                  tab.isActive !== undefined
                    ? tab.isActive(tab.path)
                    : activeTabPath === tab.path
                }
                label={tab.label}
                onClick={() => {
                  onChange?.(tab.path);
                  tab.onClick?.();
                  tab.path && navigate(tab.path);
                  // Close the mobile menu after a selection
                  setMobileMenuVisible(false);
                }}
                icon={tab?.Icon}
                disabled={props.disabled || tab.disabled}
              />
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavTabs;
