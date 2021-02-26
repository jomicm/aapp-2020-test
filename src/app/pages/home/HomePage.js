import React, { Suspense, lazy } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import Builder from './Builder';
import Dashboard from './Dashboard';
import DocsPage from './docs/DocsPage';
import { filterObject } from '../../../_metronic/utils/utils';
import { LayoutSplashScreen } from '../../../_metronic';
// AApp 2020 Modules
import Locations from './Locations/Locations';
import Assets from './Assets/Assets';
import Reports from './Reports/Reports';
import Users from './Users/Users';
import Employees from './Employees/Employees';
import Processes from './Processes/Processes';
import Settings from './Settings/Settings';
import Messages from './Messages/Messages';
import Help from './Help/Help';

const protectedRoutes = [
  {
    name: 'assets',
    path: '/assets',
    component: Assets,
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    component: Dashboard,
  },
  {
    name: 'employees',
    path: '/employees',
    component: Employees,
  },
  {
    name: 'locations',
    path: '/locations',
    component: Locations,
  },
  {
    name: 'processes',
    path: '/processes',
    component: Processes,
  },
  {
    name: 'help',
    path: '/help',
    component: Messages,
  },
  {
    name: 'reports',
    path: '/reports',
    component: Reports,
  },
  {
    name: 'settings',
    path: '/settings',
    component: Settings,
  },
  {
    name: 'users',
    path: '/users',
    component: Users,
  },
];

function HomePage({ user }) {
  const userRoutes = Object.keys(filterObject(user.profilePermissions, (element) => element.length > 1))
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        /* Redirect from root URL to /dashboard. */
        {<Redirect exact from='/' to='/dashboard' />}
        {
          protectedRoutes.map(({ name, path, component }) => (
            userRoutes.includes(name) && (
              <Route path={path} component={component} />
            )
          ))
        }
        <Route path='/messages' component={Messages} />
        <Route path='/help' component={Help} />
        <Redirect to='/error/error-v1' />
      </Switch>
    </Suspense>
  );
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps)(HomePage);
