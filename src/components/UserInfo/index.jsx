import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userInfo.css';
import { withRouter } from 'react-router-dom';
import sendToServer from '../sendToServer';
import { isValidateName, isValidNumber } from '../../helpers/m';

class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: JSON.parse(localStorage.getItem('userInfo')) || '',
      userPassword: {
        password: '',
      },
      clientPassword: {
        password: '',
        password2: '',
      },
    };
    this.onChangeUser = this.onChangeUser.bind(this);
    this.onChangeClient = this.onChangeClient.bind(this);
    this.onChangeSelect = this.onChangeSelect.bind(this);
    this.onSaveData = this.onSaveData.bind(this);
    this.onSavePassword = this.onSavePassword.bind(this);
  }

  onChangeUser(e, type) {
    const { userInfo } = this.state;
    const { userPassword } = this.state;
    if (type === 'password') {
      userPassword[type] = e.target.value.trim();
      return this.setState({ userPassword: userPassword });
    }
    userInfo[type] = e.target.value.trim();
    this.setState({ userInfo: userInfo });
  }

  onChangeClient(e, type) {
    const { clientPassword } = this.state;
    clientPassword[type] = e.target.value.trim();
    this.setState({ clientPassword: clientPassword });
  }

  onChangeSelect(event) {
    const { userInfo } = this.state;
    const c = event.target.value;
    userInfo.gender = c;
    this.setState({ userInfo: userInfo });
  }

  onSaveData() {
    const { userInfo } = this.state;
    let putUserInServer = {
    name: userInfo.name,
    age: userInfo.age,
    gender: userInfo.gender,
    _id: userInfo._id,
    };
    if (isValidateName(userInfo?.name) && isValidNumber(userInfo?.age)) {
      sendToServer('changeUsers', 'PUT', true, putUserInServer)
      .then(() => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        alert('Данные сохранены!');
      })
    } else if (!(isValidateName(userInfo?.name)) && isValidNumber(userInfo?.age)) {
      return alert('Неправильно введено имя');
    } else if (isValidateName(userInfo?.name) && !(isValidNumber(userInfo?.age))) {
      return alert('Неправильно введен возраст');
    } else {
      alert('Неправильно введены данные');
    }
  }

  onSavePassword() {
    const { userInfo } = this.state;
    const { userPassword } = this.state;
    const { clientPassword } = this.state;

    let putUserInServer = {
      password: clientPassword.password,
      password2: userPassword.password,
      _id: userInfo._id,
    };
    if (this.matchPassword()) {
      sendToServer('changePassword', 'PUT', true, putUserInServer)
      .then(() => {
        userPassword.password = '';
        clientPassword.password = '';
        clientPassword.password2 = '';
        this.setState({ userPassword: userPassword, clientPassword: clientPassword });
        alert('Пароль успешно сохранен!');
      })
      .catch((e) => {
        alert(e);
      })
    } else {
      alert('Неверно написан новый пароль!');
    }
  }

  matchPassword() {
    const { clientPassword } = this.state;
    const ps1 = clientPassword.password;
    const ps2 = clientPassword.password2;
    if (ps1 && ps2 && ps1.length > 5 && ps1 === ps2) {
      return true;
    }
    return false;
  }

  render () {
    const { userInfo, clientPassword, userPassword } = this.state;
    const dangerName = isValidateName(userInfo?.name) ? '' : 'border-danger';
    const dangerAge = isValidNumber(userInfo?.age) ? '' : 'border-danger';
    const dangerNewPassword = clientPassword.password ? clientPassword.password.length > 5 ? '' : 'border-danger' : '';
    const dangerNewPassword2 = clientPassword.password2 ? this.matchPassword() ? '' : 'border-danger' : '';
    return (
    <div className='userInfoFormContainer bg-light'>
      <div className='innerUsersBlock border rounded-3'>
        <h3 className='text-center mb-3 h3Size'>Настройка профиля пользователя</h3>
        <h4 className='mb-3 text-center h4Size'>Общие данные</h4>
        <div className='totalInfo border-bottom'>
          <div className="form-group row totalInfoMargin">
            <label htmlFor="staticName" className="col-sm-2 col-form-label textSize">Имя:</label>
            <div className="col-sm-10">
              <input
                value={userInfo.name || ''}
                onChange={(e) => this.onChangeUser(e, 'name')}
                className={`form-control ${dangerName}`}
                id="staticName"
              />
            </div>
          </div>
        <div className="form-group row totalInfoMargin">
          <label htmlFor="staticAge" className="col-sm-2 col-form-label textSize">Возраст:</label>
          <div className="col-sm-10">
            <input
              value={userInfo.age || ''}
              onChange={(e) => this.onChangeUser(e, 'age')}
              className={`form-control ${dangerAge}`}
              id="staticAge"
            />
          </div>
        </div>
        <div className="form-group row totalInfoMargin lastMrg">
          <label className="col-sm-2 col-form-label textSize">Пол:</label>
          <div className="col-sm-10">
            <select
              onChange={this.onChangeSelect}
              value={userInfo.gender || ''}
            >
              <option
                value=''
                className="form-control"
              />
              <option
                value='woman'
                className="form-control"
              >
                Женский
              </option>
              <option
                value='man'
                className="form-control"
              >
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
          <h4 className='mt-4 mb-3 text-center h4Size'>Изменить пароль</h4>
          <div className='form-group row totalInfoMargin'>
          <label htmlFor="staticPassword" className='col-sm-2 col-form-label textSize'>Текущий пароль:</label>
            <div className="col-sm-10">
              <input
                type='password'
                value={userPassword.password}
                onChange={(e) => this.onChangeUser(e, 'password')}
                className="form-control"
                id="staticPassword"
              />
            </div>
          </div>
          <div className="form-group row totalInfoMargin">
            <label htmlFor="staticPassword1" className="col-sm-2 col-form-label textSize">Новый пароль:</label>
            <div className="col-sm-10">
              <input
                type='password'
                value={clientPassword.password}
                onChange={(e) => this.onChangeClient(e, 'password')}
                className={`form-control ${dangerNewPassword}`}
                id="staticPassword1"
                placeholder='Пароль должен содержать больше 5 знаков'
              />
            </div>
          </div>
          <div className="form-group row totalInfoMargin lastMrg">
          <label htmlFor="staticPassword2" className="col-sm-2 col-form-label textSize">Повторите пароль:</label>
            <div className="col-sm-10">
              <input
              type='password'
                value={clientPassword.password2}
                onChange={(e) => this.onChangeClient(e, 'password2')}
                className={`form-control ${dangerNewPassword2}`}
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