/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/pages/auth/AuthPage`, `src/pages/home/HomePage`).
 */

import React from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { useLastLocation } from "react-router-last-location";
import HomePage from "../pages/home/HomePage";
import ErrorsPage from "../pages/errors/ErrorsPage";
import LogoutPage from "../pages/auth/Logout";
import { LayoutContextProvider } from "../../_metronic";
import Layout from "../../_metronic/layout/Layout";
import PasswordRecovery from "../pages/auth/PasswordRecovery";
import * as routerHelpers from "../router/RouterHelpers";
import AuthPage from "../pages/auth/AuthPage";
import CustomizedAlert from '../pages/home/Components/CustomizedAlert';
import GeneralLoading from '../pages/home/Components/GeneralLoading';

export const Routes = withRouter(({ history }) => {
  const lastLocation = useLastLocation();
  routerHelpers.saveLastLocation(lastLocation);
  const { isAuthorized, menuConfig, userLastLocation } = useSelector(
    ({ auth, urls, builder: { menuConfig } }) => ({
      menuConfig,
      isAuthorized: auth.user != null,
      userLastLocation: routerHelpers.getLastLocation()
    }),
    shallowEqual
  );

  return (
    /* Create `LayoutContext` from current `history` and `menuConfig`. */
    <GeneralLoading>
      <CustomizedAlert>
        <LayoutContextProvider history={history} menuConfig={menuConfig}>
          <Switch>
            <Route path="/passwordRecovery" component={PasswordRecovery} />
            {!isAuthorized ? (
              /* Render auth page when user at `/auth` and not authorized. */
              <AuthPage />
            ) : (
              /* Otherwise redirect to root page (`/`) */
              <Redirect from="/auth" to={userLastLocation} />
            )}
            
            <Route path="/error" component={ErrorsPage} />
            <Route path="/logout" component={LogoutPage} />

            {!isAuthorized ? (
              /* Redirect to `/auth` when user is not authorized */
              <Redirect to="/auth/login" />
            ) : (
              <Layout>
                <HomePage userLastLocation={userLastLocation} />
              </Layout>
            )}
          </Switch>
        </LayoutContextProvider>
      </CustomizedAlert>
    </GeneralLoading>
  );
});
