import Messages from '../pages/home/Messages/Messages';
import Help from '../pages/home/Help/Help';


export const nonProtectedRoutes = [
    {
      name: 'messages',
      path: '/messages',
      component: Messages,
    },
    {
      name: 'help',
      path: '/help',
      component: Help,
    },
  ];