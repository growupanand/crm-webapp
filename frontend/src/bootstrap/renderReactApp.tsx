import { createRoot } from "react-dom/client";

import routes from "@app/routes";

/**
 * React app will render from here
 */

export function renderReactApp() {
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(<React.StrictMode>{routes}</React.StrictMode>);
}
