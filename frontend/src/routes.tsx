import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@app/views/home";
import Register from "@app/views/register";
import App from "@app/views/index";

const routes = (
  <BrowserRouter>
    <Routes>
      <Route Component={App}>
        <Route index Component={Home} />
        <Route path="register" Component={Register} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default routes;
