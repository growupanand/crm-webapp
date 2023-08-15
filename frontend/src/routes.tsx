import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@app/views/home";
import Register from "@app/views/register";
import App from "@app/views/index";
import Login from "@app/views/login";
import AuthLayout from "@app/layouts/authLayout";

const routes = (
  <BrowserRouter>
    <Routes>
      <Route>
        {/* Unauthorized Routes - Don't require user login */}
        <Route path="auth" Component={AuthLayout}>
          <Route path="register" Component={Register} />
          <Route path="login" Component={Login} />
        </Route>
        {/* Authorized Routes - Require user login */}
        <Route Component={App}>
          <Route index Component={Home} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default routes;
