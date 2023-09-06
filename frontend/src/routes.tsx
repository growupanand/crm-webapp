import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@app/views/home";
import Register from "@app/views/register";
import Login from "@app/views/login";
import AuthLayout from "@app/layouts/authLayout";
import ForgetPassword from "@app/views/forgetPassword";
import TokenPage from "@app/views/token";
import AppLayout from "@app/layouts/appLayout";
import ChangePasswordPage from "@app/views/changePassword";

const routes = (
  <BrowserRouter>
    <Routes>
      <Route>
        {/* Unauthorized Routes - Don't require user login */}
        <Route path="auth" Component={AuthLayout}>
          <Route path="register" Component={Register} />
          <Route path="login" Component={Login} />
          <Route path="forget-password" Component={ForgetPassword} />
          <Route
            path="token/:token"
            Component={TokenPage}
            errorElement={<p>error page</p>}
          />
        </Route>
        {/* Authorized Routes - Require user login */}
        <Route Component={AppLayout}>
          <Route index Component={Home} />
          <Route path="change-password" Component={ChangePasswordPage} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default routes;
