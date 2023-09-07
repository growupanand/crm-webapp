import buildRoutes from "@app/routes";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

function RenderMainApp() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <Notifications />
        {buildRoutes()}
      </ModalsProvider>
    </MantineProvider>
  );
}

export default RenderMainApp;
