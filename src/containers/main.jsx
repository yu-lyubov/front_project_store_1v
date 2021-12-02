import React from 'react';
import { Redirect } from 'react-router';
import Header from '../components/Header';
import Menu from '../components/Menu';

const Main = ({ el }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('userInfo'));

  if (!token || !user) {
    return <Redirect to="/login" />
  }

  if (user.role === el.role.admin) {
    return (
      <>
        {el.header && <Header />}
        <div className='mainBlock'>
          {el.menu && <Menu />}
          {el.component}
        </div>
      </>
    )
  } else if (user.role === el.role.user) {
    return (
      <>
        {el.header && <Header />}
        <div className='mainBlock'>
          {el.menu && <Menu />}
          {el.component}
        </div>
      </>
    )
  } else {
    return <Redirect to="/editUsers" />
  }

};

export default Main;
