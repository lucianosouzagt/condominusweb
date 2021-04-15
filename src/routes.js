import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Logout = React.lazy(() => import('./views/Logout'));
const Wall = React.lazy(() => import('./views/Wall'));
const Doc = React.lazy(() => import('./views/Doc'));
const Reservation = React.lazy(() => import('./views/Reservation'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/logout', name: 'Logout', component: Logout },
  { path: '/wall', name: 'Wall', component: Wall },
  { path: '/doc', name: 'Doc', component: Doc },
  { path: '/reservations', name: 'Reservations', component: Reservation },
  
  
];

export default routes;
