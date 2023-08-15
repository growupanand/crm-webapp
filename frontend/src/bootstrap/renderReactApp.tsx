import { createRoot } from "react-dom/client";
import RenderMainApp from "./renderMain";

/**
 * React app will render from here
 */

export function renderReactApp() {
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(<RenderMainApp />);
}
