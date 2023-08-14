import routes from "@app/routes";
import { MantineProvider } from "@mantine/core";

function RenderMainApp() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {routes}
    </MantineProvider>
  );
}

export default RenderMainApp;
