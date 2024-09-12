import React from 'react';
import { ROLES } from '../constants/role';
import Dashboard from '../pages/admin/Dashboard';
import ListProduct from '../pages/ListProduct';
import DetailProduct from '../pages/DetailProduct';
import MyCart from '../pages/MyCart';

const routes = [
  {
    path: '/',
    element: <Dashboard />,
    role: [ROLES.ADMIN],
  },
  {
    path: '/detail-product/:idProduct',
    element: <DetailProduct />,
    role: [ROLES.ADMIN, ROLES.USER],
  },
  {
    path: '/',
    element: <ListProduct />,
    role: [ROLES.USER],
  },
  {
    path: '/my-cart',
    element: <MyCart />,
    role: [ROLES.USER],
  },
];

export default routes;
