import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { filterObject } from '../../../_metronic/utils/utils';
import { LayoutSplashScreen } from '../../../_metronic';
// AApp 2020 Modules
import { protectedRoutes } from '../../router/protectedRoutes';
import { nonProtectedRoutes } from '../../router/nonProtectedRoutes';

function HomePage({ user }) {
  // if (!user || !user.profilePermissions) {
  //   return (
  //     <Suspense fallback={<LayoutSplashScreen />}>
  //     <Switch>
  //       <Redirect to='/auth/login' />
  //     </Switch>
  //   </Suspense>
  //   );
  // }
  debugger

  const userRoutes = Object.keys(filterObject(user?.profilePermissions, (element) => element.length > 1));
  if (!userRoutes) {
    return <Redirect to='/auth/login' />
  }
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {/* Redirect from root URL to /dashboard. */}
        <Redirect exact from='/' to='/dashboard' />
        {
          protectedRoutes.map(({ name, path, component }) => (
            userRoutes.includes(name) && (
              <Route path={path} component={component} />
            )
          ))
        }
        {
          nonProtectedRoutes.map(({ path, component }) => (
            <Route path={path} component={component} />
          ))
        }
        {/* <Redirect to='/error/error-v1' /> */}
        <Redirect to='/logout' />
      </Switch>
    </Suspense>
  );
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps)(HomePage);
