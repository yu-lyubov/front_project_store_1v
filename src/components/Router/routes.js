import React from 'react';
import Registration from '../Registration';
import LoginForm from '../LoginForm';
import UserInfo from '../UserInfo';
import MainBlock from '../MainBlock';
import ShoppingCategories from '../ShoppingCategories';
import StartPageShop from '../StartPageShop';
import EditUsers from '../EditUsers';

const everybody = {
    user: 'user',
    admin: 'admin',
};

const onlyAdmin = {
    admin: 'admin',
};

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
        role: everybody,
    },
    {
        url: '/homes',
        component: <MainBlock />,
        header: true,
        private: true,
        role: onlyAdmin,
    },
    {
        url: '/category/:id',
        component: <ShoppingCategories />,
        header: true,
        menu: true,
        private: true,
        role: everybody,
    },
    {
        url: '/category',
        component: <StartPageShop />,
        header: true,
        menu: true,
        private: true,
        role: everybody,
    },
    {
        url: '/users',
        component: <EditUsers />,
        header: true,
        private: true,
        role: onlyAdmin,
    },
];

export default ROUTES;
