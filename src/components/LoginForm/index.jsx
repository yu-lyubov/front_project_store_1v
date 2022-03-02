import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import sendToServer from '../sendToServer';
import './loginForm.css';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        };
        this.onChangeUser = this.onChangeUser.bind(this);
        this.singIn = this.singIn.bind(this);
    }

    onChangeUser(e, type) {
        const { user } = this.state;
        user[type] = e.target.value.trim();
        this.setState({ user });
    }

    singIn() {
        const { user } = this.state;
        sendToServer('login', 'POST', user)
            .then((value) => {
                localStorage.setItem('token', value.token);
                localStorage.setItem('userInfo', JSON.stringify(value.user));
                return this.props.history.push('/editUsers');
            })
            .catch((err) => {
                alert(err);
                this.setState({ user: {} });
            });
    }

    render() {
        const { login, password } = this.state.user;
        return (
            <div className="loginFormContainer bg-light">
                <div className="innerLoginBlock border rounded-3 p-5 bg-white">
                    <h4 className="mb-4 text-center">Вход</h4>
                    <input
                        value={login || ''}
                        onChange={(e) => this.onChangeUser(e, 'login')}
                        className={`form-control mb-3`}
                        placeholder="Введите логин"
                    />
                    <input
                        type="password"
                        value={password || ''}
                        onChange={(e) => this.onChangeUser(e, 'password')}
                        className="form-control mb-3"
                        placeholder="Введите пароль"
                    />
                    <button
                        onClick={this.singIn}
                        className={`text-white bg-success form-control`}
                        disabled={!login || !password}
                    >
                        Войти
                    </button>
                    <p className="mt-3">
                        Если вы еще не зарегистрированы,{' '}
                        <Link to="/registration">нажмите сюда</Link>
                    </p>
                </div>
            </div>
        );
    }
}

export default withRouter(LoginForm);
