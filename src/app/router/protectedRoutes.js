import Locations from '../pages/home/Locations/Locations';
import Assets from '../pages/home/Assets/Assets';
import Reports from '../pages/home/Reports/Reports';
import Users from '../pages/home/Users/Users';
import Employees from '../pages/home/Employees/Employees';
import Processes from '../pages/home/Processes/Processes';
import Settings from '../pages/home/Settings/Settings';
import Dashboard from '../pages/home/Dashboard';

export const protectedRoutes = [
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
  