import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Logout = React.lazy(() => import('./views/Logout'));
const Wall = React.lazy(() => import('./views/Wall'));
const Doc = React.lazy(() => import('./views/Doc'));
const Reservation = React.lazy(() => import('./views/Reservation'));
const Billet = React.lazy(() => import('./views/Billet'));
const Foundandlost = React.lazy(() => import('./views/Foundandlost'));
const Warning = React.lazy(() => import('./views/Warning'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/logout', name: 'Logout', component: Logout },
  { path: '/wall', name: 'Wall', component: Wall },
  { path: '/doc', name: 'Doc', component: Doc },
  { path: '/reservations', name: 'Reservations', component: Reservation },
  { path: '/billets', name: 'Billet', component: Billet },
  { path: '/foundandlost', name: 'Foundandlost', component: Foundandlost },
  { path: '/warnings', name: 'Warning', component: Warning },
  
  
];

export default routes;
