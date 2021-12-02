import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './registration.css';
import { Link, withRouter } from "react-router-dom";
import sendToServer from '../sendToServer';
import { validateEmail, isValidateName, isValidNumber } from '../../helpers/m';

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        login: '',
        email: '',
        password: '',
        password2: '',
        name: '',
        age: '',
      },
    };
    this.onChangeUser = this.onChangeUser.bind(this);
    this.onSaveData = this.onSaveData.bind(this);
  }

  matchPassword() {
    const { user } = this.state;
    const ps1 = user.password; 
    const ps2 = user.password2;
    if (ps1 && ps2 && ps1.length > 5 && ps1 === ps2) {
      return true;
    }
    return false;
  }

  onChangeUser(e, type) {
    const { user } = this.state;
    user[type] = e.target.value.trim();
    this.setState({ user: user });
  }

  onSaveData() {
    const { user } = this.state;
    if (user.login && validateEmail(user) && this.matchPassword()) {
      delete user.password2;
      sendToServer('auth', 'POST', false, user);
      return this.props.history.push("/login");
    } 
    alert('Введены неверные значения!');
  }


  render () { 
    const { user } = this.state;
    const successLogin = user.login.length > 1 ? 'border-success' : '';
    const successEmail = user.email ? validateEmail(user) ? 'border-success' : 'border-danger' : '';
    const successPassword = user.password ? user.password.length > 5 ? 'border-success' : 'border-danger' : '';
    const successPassword2 = user.password && user.password2 ? this.matchPassword() ? 'border-success' : 'border-danger' : '';
    const dangerName = isValidateName(user?.name) ? '' : 'border-danger';
    const dangerAge = isValidNumber(user?.age) ? '' : 'border-danger';
    return (
      <div className='registrationContainer bg-light'>
        <div className='marginBlock'>
          <div className='innerRegistrationBlock border rounded-3 p-5 bg-white'>
            <h4 className='mb-4 text-center'>Регистрация</h4>
            <input 
              value={user.login}
              onChange={(e) => this.onChangeUser(e, 'login')}
              className={`form-control mb-3 ${successLogin}`}
              placeholder='Введите логин*'
            />
            
            <input 
              value={user.email}
              onChange={(e) => this.onChangeUser(e, 'email')}
              className={`form-control mb-3 ${successEmail}`}
              placeholder='Введите Email*'
            />
            
            <input 
              type="password"
              autoComplete="off"
              value={user.password}
              onChange={(e) => this.onChangeUser(e, 'password')}
              className={`form-control mb-3 ${successPassword}`} 
              placeholder='Введите пароль**'
            />
            
            <input 
              type='password'
              autoComplete="off"
              value={user.password2}
              onChange={(e) => this.onChangeUser(e, 'password2')}
              className={`form-control mb-3 ${successPassword2}`} 
              placeholder='Повторите пароль*'
            />
            
            <input 
              value={user.name} 
              onChange={(e) => this.onChangeUser(e, 'name')}
              className={`form-control mb-3 ${dangerName}`}
              placeholder='Введите имя'
            />

            <input 
              value={user.age} 
              onChange={(e) => this.onChangeUser(e, 'age')}
              className={`form-control mb-1 ${dangerAge}`}
              placeholder='Введите возраст'
            />
            <p className='mb-0'><small>* - поле, обязательное для ввода</small></p>
            <p><small>** - пароль должен содержать больше 5 знаков</small></p>

            <button
              onClick={this.onSaveData}
              className='text-white bg-success form-control'
            >
              Зарегистрироваться
            </button>

            <p className='mt-3'>Если вы уже зарегистрированы, <Link to='/login'>нажмите сюда</Link></p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Registration);