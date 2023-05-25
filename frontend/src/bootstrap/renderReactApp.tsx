import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";

import routes from "@app/routes";

/**
 * React app will render from here
 */

export function renderReactApp() {
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <BrowserRouter>{routes}</BrowserRouter>
      </MantineProvider>
    </React.StrictMode>
  );
}
