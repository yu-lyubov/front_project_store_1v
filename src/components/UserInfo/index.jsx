import React from 'react';
import { withRouter } from 'react-router-dom';
import sendToServer from '../sendToServer';
import { isValidateName, isValidNumber, passwordMatch } from '../../helpers/m';
import './userInfo.css';

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('userInfo')) || '',
            currentPassword: {},
            newPassword: {},
        };
        this.onChangeUser = this.onChangeUser.bind(this);
        this.onChangeSelect = this.onChangeSelect.bind(this);
        this.onSaveData = this.onSaveData.bind(this);
        this.onSavePassword = this.onSavePassword.bind(this);
    }

    onChangeUser(e, type) {
        const { user, currentPassword, newPassword } = this.state;
        if (type === 'password') {
            currentPassword[type] = e.target.value.trim();
            return this.setState({ currentPassword });
        }
        if (type === 'passwordTwo' || type === 'passwordTwo2') {
            newPassword[type] = e.target.value.trim();
            return this.setState({ newPassword });
        }
        user[type] = e.target.value.trim();
        this.setState({ user });
    }

    onChangeSelect(event) {
        const { user } = this.state;
        user.gender = event.target.value;
        this.setState({ user });
    }

    onSaveData() {
        const { user } = this.state;
        if (!isValidateName(user?.name)) return alert('Неправильно введено имя');
        if (!isValidNumber(user?.age)) return alert('Неправильно введен возраст');
        if (isValidateName(user?.name) && isValidNumber(user?.age)) {
            sendToServer('changeUsers', 'PUT', user).then(() => {
                localStorage.setItem('userInfo', JSON.stringify(user));
                alert('Данные сохранены!');
            });
            return;
        }
        return alert('Неправильно введены данные');
    }

    onSavePassword() {
        const { user, currentPassword, newPassword } = this.state;
        let putUserInServer = {
            password: newPassword.passwordTwo,
            password2: currentPassword.password,
            _id: user._id,
        };
        if (passwordMatch(newPassword.passwordTwo, newPassword.passwordTwo2)) {
            sendToServer('changePassword', 'PUT', putUserInServer)
                .then(() => {
                    this.setState({ currentPassword: {}, newPassword: {} });
                    alert('Пароль успешно сохранен!');
                })
                .catch((err) => {
                    alert(err);
                });
            return;
        }
        return alert('Неверно написан новый пароль!');
    }

    render() {
        const { name, age, gender } = this.state.user;
        const { password } = this.state.currentPassword;
        const { passwordTwo, passwordTwo2 } = this.state.newPassword;
        return (
            <div className="userInfoFormContainer bg-light">
                <div className="innerUsersBlock border rounded-3">
                    <h3 className="text-center mb-3 h3Size">Настройка профиля пользователя</h3>
                    <h4 className="mb-3 text-center h4Size">Общие данные</h4>
                    <div className="totalInfo border-bottom">
                        <div className="form-group row totalInfoMargin">
                            <label
                                htmlFor="staticName"
                                className="col-sm-2 col-form-label textSize"
                            >
                                Имя:
                            </label>
                            <div className="col-sm-10">
                                <input
                                    value={name || ''}
                                    onChange={(e) => this.onChangeUser(e, 'name')}
                                    className={`form-control ${
                                        isValidateName(name) ? '' : 'border-danger'
                                    }`}
                                    id="staticName"
                                />
                            </div>
                        </div>
                        <div className="form-group row totalInfoMargin">
                            <label htmlFor="staticAge" className="col-sm-2 col-form-label textSize">
                                Возраст:
                            </label>
                            <div className="col-sm-10">
                                <input
                                    value={age || ''}
                                    onChange={(e) => this.onChangeUser(e, 'age')}
                                    className={`form-control ${
                                        isValidNumber(age) ? '' : 'border-danger'
                                    }`}
                                    id="staticAge"
                                />
                            </div>
                        </div>
                        <div className="form-group row totalInfoMargin lastMrg">
                            <label className="col-sm-2 col-form-label textSize">Пол:</label>
                            <div className="col-sm-10">
                                <select onChange={this.onChangeSelect} value={gender || ''}>
                                    <option value="" className="form-control" />
                                    <option value="woman" className="form-control">
                                        Женский
                                    </option>
                                    <option value="man" className="form-control">
                                        Мужской
                                    </option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={this.onSaveData}
                            className={`bg-success form-control text-white btn btn-secondary`}
                        >
                            Сохранить
                        </button>
                    </div>

                    <div>
                        <h4 className="mt-4 mb-3 text-center h4Size">Изменить пароль</h4>
                        <div className="form-group row totalInfoMargin">
                            <label
                                htmlFor="staticPassword"
                                className="col-sm-2 col-form-label textSize"
                            >
                                Текущий пароль:
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="password"
                                    value={password || ''}
                                    onChange={(e) => this.onChangeUser(e, 'password')}
                                    className="form-control"
                                    id="staticPassword"
                                />
                            </div>
                        </div>
                        <div className="form-group row totalInfoMargin">
                            <label
                                htmlFor="staticPassword1"
                                className="col-sm-2 col-form-label textSize"
                            >
                                Новый пароль:
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="password"
                                    value={passwordTwo || ''}
                                    onChange={(e) => this.onChangeUser(e, 'passwordTwo')}
                                    className={`form-control ${
                                        !passwordTwo || passwordTwo.length > 5
                                            ? ''
                                            : 'border-danger'
                                    }`}
                                    id="staticPassword1"
                                    placeholder="Пароль должен содержать больше 5 знаков"
                                />
                            </div>
                        </div>
                        <div className="form-group row totalInfoMargin lastMrg">
                            <label
                                htmlFor="staticPassword2"
                                className="col-sm-2 col-form-label textSize"
                            >
                                Повторите пароль:
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="password"
                                    value={passwordTwo2 || ''}
                                    onChange={(e) => this.onChangeUser(e, 'passwordTwo2')}
                                    className={`form-control ${
                                        !passwordTwo2 || passwordMatch(passwordTwo, passwordTwo2)
                                            ? ''
                                            : 'border-danger'
                                    }`}
                                    id="staticPassword2"
                                />
                            </div>
                        </div>
                        <button
                            onClick={this.onSavePassword}
                            className={`bg-success form-control text-white btn btn-secondary`}
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(UserInfo);
