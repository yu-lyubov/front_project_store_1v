import React from 'react';
import Registration from '../Registration';
import LoginForm from '../LoginForm';
import UserInfo from '../UserInfo';
import MainBlock from '../MainBlock';
import ShoppingCategories from '../ShoppingCategories';
import StartPageShop from '../StartPageShop';
import EditUsers from '../EditUsers';

export const ROUTES = [
  {
    url: '/registration',
    component: <Registration />,
  },
  {
    url: '/login',
    component: <LoginForm />,
  },    
  {
    url: '/editUsers',
    component: <UserInfo />,
    header: true,
    private: true,
    role: {
      user: 'user',
      admin: 'admin',
    },
  },
  {
    url: '/homes',
    component: <MainBlock />,
    header: true,
    private: true,
    role: {
      admin: 'admin',
    },
  },
  {
    url: '/category/:id',
    component: <ShoppingCategories />,
    header: true,
    menu: true,
    private: true,
    role: {
      user: 'user',
      admin: 'admin',
    },
  },
  {
    url: '/category',
    component: <StartPageShop />,
    header: true,
    menu: true,
    private: true,
    role: {
      user: 'user',
      admin: 'admin',
    },
  },
  {
    url: '/users',
    component: <EditUsers />,
    header: true,
    private: true,
    role: {
      admin: 'admin',
    },
  },
]

export default ROUTES;