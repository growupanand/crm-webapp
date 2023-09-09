import buildRoutes from "@app/routes";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

function RenderMainApp() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications />
      {buildRoutes()}
    </MantineProvider>
  );
}

export default RenderMainApp;
