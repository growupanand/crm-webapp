import { AppShell, MantineProvider } from "@mantine/core";
import { Outlet } from "react-router-dom";
import AppHeader from "./components/appHeader";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell header={<AppHeader />} fixed={false}>
        <Outlet />
      </AppShell>
    </MantineProvider>
  );
}

export default App;
