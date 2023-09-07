import buildRoutes from "@app/routes";
import { MantineProvider } from "@mantine/core";

function RenderMainApp() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {buildRoutes()}
    </MantineProvider>
  );
}

export default RenderMainApp;
