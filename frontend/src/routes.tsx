import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "@app/views/home";
import Register from "@app/views/register";
import Login from "@app/views/login";
import AuthLayout from "@app/layouts/authLayout";
import ForgetPassword from "@app/views/forgetPassword";
import TokenPage from "@app/views/token";
import AppLayout from "@app/layouts/appLayout";
import ChangePasswordPage from "@app/views/settings/changePassword";
import AccountPage from "@app/views/settings/account";
import AppIndexPage from "./views/appIndex";
import OrganizationLayout from "@app/layouts/organizationLayout";
import AccountSettingsLayout from "./layouts/accountSettingsLayout";
import OrganizationSettingsLayout from "./layouts/organizationSettingsLayout";
import OrganizationSettingsDetailsPage from "./views/organizationSettings/details";

function buildRoutes() {
  const settingRoutes = (
    <Route path="settings" Component={AccountSettingsLayout}>
      <Route index element={<Navigate replace to="account" />} />
      <Route path="account" Component={AccountPage} />
      <Route path="change-password" Component={ChangePasswordPage} />
    </Route>
  );

  const organizationRoutes = (
    <Route path="organization/:organizationId" Component={OrganizationLayout}>
      <Route index Component={Home} />
      <Route path="settings" Component={OrganizationSettingsLayout}>
        <Route index element={<Navigate replace to="details" />} />
        <Route path="details" Component={OrganizationSettingsDetailsPage} />
      </Route>
    </Route>
  );

  const appRoutes = (
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
          <Route path="/" Component={AppLayout}>
            <Route path="/" Component={AppIndexPage} />
            {settingRoutes}
            {organizationRoutes}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );

  return appRoutes;
}

export default buildRoutes;
