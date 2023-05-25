import { Route, Routes } from "react-router-dom";
import App from "@app/views/App";

const routes = (
  <Routes>
    <Route path="/" Component={App} />
  </Routes>
);

export default routes;
