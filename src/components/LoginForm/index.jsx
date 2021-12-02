import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './loginForm.css';
import { Link, withRouter } from 'react-router-dom'; 
import sendToServer from '../sendToServer';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {
        login: '',
        password: '',
      },
    }
    this.onChangeUser = this.onChangeUser.bind(this);
    this.singIn = this.singIn.bind(this);
  }

  onChangeUser(e, type) {
    const { client } = this.state;
    client[type] = e.target.value.trim();
    this.setState({ client: client });
  }

  singIn() {
    const { client } = this.state;
    sendToServer('login', 'POST', false, client)
    .then((value) => {
      localStorage.setItem('token', value.token);
      localStorage.setItem('userInfo', JSON.stringify(value.user));
      return this.props.history.push("/editUsers");
    })
    .catch((err) => {
      alert(err);
      client.login = '';
      client.password = '';
      this.setState({ client: client });
    })        
  }


  render () {
    const { client } = this.state;
    const disabled = client.login ? client.password ? '' : 'disabled' : 'disabled';
    return (
      <div className='loginFormContainer bg-light'>
        <div className='d-flex justify-content-center'>
          <div className='innerLoginBlock w-25 border rounded-3 p-5 bg-white'>
            <h4 className='mb-4 text-center'>Вход</h4>
            <input
              value={client.login}
              onChange={(e) => this.onChangeUser(e, 'login')}
              className={`form-control mb-3`}
              placeholder='Введите логин'
            />

            <input
              type="password"
              autoComplete="off"
              value={client.password}
              onChange={(e) => this.onChangeUser(e, 'password')}
              className='form-control mb-3'
              placeholder='Введите пароль' 
            />

            <button 
              onClick={this.singIn}
              className={`bg-success form-control text-white btn btn-secondary btn-lg ${disabled}`}
            >
              Войти
            </button>
            
            <p className='mt-3'>Если вы еще не зарегистрированы, <Link to='/registration'>нажмите сюда</Link></p>
          </div>
        </div>
      </div>
    );
  }

}

export default withRouter(LoginForm);