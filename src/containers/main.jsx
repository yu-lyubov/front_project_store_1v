import React, { useState } from 'react';
import { Redirect } from 'react-router';
import Header from '../components/Header';
import Menu from '../components/Menu';

const Main = ({ el }) => {
    const [openedMenu, setOpenedMenu] = useState(false);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if (!token || !user) {
        return <Redirect to="/login" />;
    }

    const toggleSidebar = () => {
        setOpenedMenu(!openedMenu);
    };

    if (user.role === el.role.admin || user.role === el.role.user) {
        return (
            <>
                {el.header && <Header toggleMenu={toggleSidebar} />}
                <div className="mainBlock">
                    {el.menu && <Menu openedMenu={openedMenu} toggleMenu={toggleSidebar} />}
                    {el.component}
                </div>
            </>
        );
    } else {
        return <Redirect to="/editUsers" />;
    }
};

export default Main;
