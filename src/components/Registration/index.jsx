import React from 'react';
import { Link, withRouter } from "react-router-dom";
import sendToServer from '../sendToServer';
import { validateEmail, isValidateName, isValidNumber, passwordMatch } from '../../helpers/m';
import './registration.css';

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
    this.onChangeUser = this.onChangeUser.bind(this);
    this.onSaveData = this.onSaveData.bind(this);
  }

  onChangeUser(e, type) {
    const { user } = this.state;
    user[type] = e.target.value.trim();
    this.setState({ user });
  }

  onSaveData() {
    const { user } = this.state;
    if (user.login && validateEmail(user.email) && passwordMatch(user.password, user.password2)) {
      delete user.password2;
      sendToServer('auth', 'POST', user)
          .then(() => {
            return this.props.history.push("/login");
          })
          .catch((err) => {
            return alert(err);
          });
    } else {
      alert('Введены неверные значения!');
    }
  }

  render () { 
    const { login, email, password, password2, name, age } = this.state.user;
    console.log('user', this.state.user);
    return (
      <div className='registrationContainer bg-light'>
        <div className='innerRegistrationBlock border rounded-3 p-5 bg-white'>
          <h4 className='mb-4 text-center'>Регистрация</h4>
          <input
            value={login || ''}
            onChange={(e) => this.onChangeUser(e, 'login')}
            className={`form-control mb-3 ${login && login.length > 1 ? 'border-success' : ''}`}
            placeholder='Введите логин*'
          />

          <input
            value={email || ''}
            onChange={(e) => this.onChangeUser(e, 'email')}
            className={`form-control mb-3 ${email ? 'border-success' : ''} ${validateEmail(email) ? '' : 'border-danger'}`}
            placeholder='Введите Email*'
          />

          <input
            type="password"
            value={password || ''}
            onChange={(e) => this.onChangeUser(e, 'password')}
            className={`form-control mb-3 ${password &&  password.length > 5 ? 'border-success' : ''}`}
            placeholder='Введите пароль**'
          />

          <input
            type='password'
            value={password2 || ''}
            onChange={(e) => this.onChangeUser(e, 'password2')}
            className={`form-control mb-3 ${password && password2 ? 'border-success' : ''} ${passwordMatch(password, password2) ? '' : 'border-danger'}`}
            placeholder='Повторите пароль*'
          />

          <input
            value={name || ''}
            onChange={(e) => this.onChangeUser(e, 'name')}
            className={`form-control mb-3 ${isValidateName(name) ? '' : 'border-danger'}`}
            placeholder='Введите имя'
          />

          <input
            value={age || ''}
            onChange={(e) => this.onChangeUser(e, 'age')}
            className={`form-control mb-1 ${isValidNumber(age) ? '' : 'border-danger'}`}
            placeholder='Введите возраст'
          />
          <p className='mb-0'>
            <small>* - поле, обязательное для ввода</small>
          </p>
          <p>
            <small>** - пароль должен содержать больше 5 знаков</small>
          </p>

          <button
            onClick={this.onSaveData}
            className='text-white bg-success form-control'
          >
            Зарегистрироваться
          </button>

          <p className='mt-3'>
            Если вы уже зарегистрированы, <Link to='/login'>нажмите сюда</Link>
          </p>
        </div>
      </div>
    );
  }
}

export default withRouter(Registration);