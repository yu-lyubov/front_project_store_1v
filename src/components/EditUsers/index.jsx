import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './editUser.css';
import sendToServer from '../sendToServer';
import {ReactComponent as EditIcon} from '../../assets/icons/pencil-square.svg';
import {ReactComponent as DeleteIcon} from '../../assets/icons/x-circle.svg';
import {ReactComponent as AddIcon} from '../../assets/icons/person-plus.svg';
import { validateEmail, isValidateName, isValidNumber } from '../../helpers/m';

class EditUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      newUser: {},
      numberOfUsers: 10,
      arrPages: [],
      pages: '',
      page: 1,
      display: {
        listOfUsers: true,
        newUsers: false,
        changeUsers: false,
      }
    };
    this.openListIfUsers = this.openListIfUsers.bind(this);
    this.openAddUsers = this.openAddUsers.bind(this);
    this.openChangeUser = this.openChangeUser.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.addNewUser = this.addNewUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.changeDataUser = this.changeDataUser.bind(this);
    this.onChangeNumberOfUsers = this.onChangeNumberOfUsers.bind(this);
    this.onChangePagonation = this.onChangePagonation.bind(this);
  }

  componentDidMount() {
    this.getUserFromServer();
  }

  getUserFromServer() {
    const { numberOfUsers, page } = this.state;
    sendToServer(`allUsers?perPage=${numberOfUsers}&page=${page}`, 'GET')
    .then((value) => {
      const arr = this.range(1, value.pages)
      this.setState({ allUsers: value.users, arrPages: arr, pages: value.pages});
    })
    .catch((e) => {
      console.log(e);
    }) 
  }

  range(from, to, step = 1) {
    let i = from;
    const range = [];
  
    while (i <= to) {
      range.push(i);
      i += step;
    }
  
    return range;
  }

  // Открыть инпуты, кнопку

  openListIfUsers() {
    const { display } = this.state;
    display.listOfUsers = true;
    display.newUsers = false;
    display.changeUsers = false;
    this.setState({ display, newUser: {} });
  }

  openAddUsers() {
    const { display } = this.state;
    display.listOfUsers = false;
    display.newUsers = true;
    this.setState({ display });
  }

  openChangeUser(item) {
    const { display } = this.state;
    display.listOfUsers = false;
    display.changeUsers = true;
    this.setState({ display, newUser: {...item} });
  }

  // Добавить нового пользователя

  onChangeUser(e, type) {
    const { newUser } = this.state;
    newUser[type] = e.target.value;
    this.setState({ newUser });
  }

  addNewUser() {
    const { newUser, allUsers } = this.state;
    if (!newUser.role) {
      newUser.role = 'user';
    }
    if (newUser.login && validateEmail(newUser) && newUser.password.length > 5 && isValidateName(newUser?.name) && isValidNumber(newUser?.age)) {
      sendToServer('newUser', 'POST', false, newUser)
      .then((value) => {
        allUsers.push(value);
        this.setState({ allUsers, newUser: {} });
        this.openListIfUsers();
      })
    } else {
      alert('Данные введены некорректно!');
    }
  }

  // Удаление пользователя

  deleteUser(item) {
    const { allUsers } = this.state;
    let answer = window.confirm('Удалить пользователя?');
    if(answer) {
      sendToServer('deleteUser', 'DELETE', false, item)
      .then(() => {
        const index = allUsers.indexOf(item);
        if (index > -1) {
          allUsers.splice(index, 1);
        }
        this.setState({ allUsers });
      })
    }
  }

  // Изменить данные пользователя

  changeDataUser() {
    const { newUser, allUsers } = this.state;
    if (newUser.login && validateEmail(newUser) && isValidateName(newUser?.name) && isValidNumber(newUser?.age)) {
      if (this.isValidatePassword()) {
        if (newUser.password1 && newUser.password2) {
          newUser.password = newUser.password1;
          delete newUser.password1;
          delete newUser.password2;
        }
        sendToServer('changeUser', 'PUT', false, newUser)
        .then((value) => {
          let newArr = [...new Set([...allUsers])];
          newArr = newArr.map((el) => (el._id === value._id ? value : el));
          this.setState({ allUsers: newArr });
          this.openListIfUsers();
        })
      } else {
        return alert('Некорректно введены пароли');
      }
    } else {
      return alert('Некорректно введены данные');
    }
  }

  // 

  isValidatePassword() {
    const { newUser } = this.state;
    if (!(newUser.password1 && newUser.password2) || (newUser.password1 > 5 && newUser.password2 > 5 && newUser.password1 === newUser.password2)) {
      return true;
    } else {
      return false;
    }
  }

  onChangeNumberOfUsers(e) {
    this.setState({ numberOfUsers: Number(e.target.value), page: 1 });
    sendToServer(`allUsers?perPage=${Number(e.target.value)}&page=${1}`, 'GET')
    .then((value) => {
      const arr = this.range(1, value.pages)
      this.setState({ allUsers: value.users, arrPages: arr, pages: value.pages});
    })
  }

  onChangePagonation(item) {
    const { page, pages, numberOfUsers } = this.state;
    console.log(item, page, pages)

    let num = 0;
    if (item === 'Next') {
      num = page + 1;
    } else if (item === 'Previous') {
      num = page - 1;
    } else {
      num = item;
    }

    if (page !== num && num > 0 && num <= pages) {
      sendToServer(`allUsers?perPage=${numberOfUsers}&page=${num}`, 'GET')
      .then((value) => {
        this.setState({ allUsers: value.users, page: num });
      })
    }
  }


  render () {
    const { display, newUser, numberOfUsers } = this.state;
    // console.log(numberOfUsers);
    const error = {
      email: validateEmail(newUser),
      name: isValidateName(newUser?.name),
      age: isValidNumber(newUser?.age),
    }
    return (
      <div className='tableFormContainer bg-light'>


        {display.listOfUsers && 
          <div className='tableBlock bg-light'>
            <div className='sizeBox border rounded-3 px-5 pb-5 pt-4 mt-5 bg-white'>

              <div className='d-flex justify-content-end'>
                <button 
                  onClick={this.openAddUsers}
                  className="btn btn-outline-success btn-sm sizeAddUser p-0 d-flex justify-content-center align-items-center"
                >
                  <AddIcon className='mx-1' />
                  Add user
                </button>
              </div> 

              <table className=''>
                <caption className='pt-0 text-dark'>A list of users</caption>
                <thead>
                  <tr className='bg-light'>
                    <th>Role</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>

                {this.state.allUsers.map((item, idx) => (
                  <tbody key={`${item.id}-${idx}`}>
                    <tr>
                      <td>{item.role}</td>
                      <td>{item.name}</td>
                      <td>{item.age}</td>
                      <td>{item.gender}</td>
                      <td>
                        <div className='d-flex justify-content-around'>
                          <EditIcon
                            onClick={() => this.openChangeUser(item)}
                            className='cursor'
                          />
                          <DeleteIcon
                            onClick={() => this.deleteUser(item)}
                            className='cursor'
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
                
              </table>
              
              <div className='d-flex justify-content-center'>
                <p className='m-0 mt-2'>{this.state.page}/{this.state.pages}</p>
              </div>

              <div className='d-flex justify-content-between mt-1'>

                <ul className='pagination pagination-sm cursor m-0'>
                  <li className='page-item' >
                    <div className='page-link disabled text-muted' onClick={() => this.onChangePagonation('Previous')}>
                      Previous
                    </div>
                  </li>
                  {this.state.arrPages.map((item, idx) => (
                    <li className='page-item' key={`${item.id}-${idx}`}>
                      <div className='page-link text-dark' onClick={() => this.onChangePagonation(item)}>
                        {item}
                      </div>
                    </li>
                  ))}
                  <li className='page-item'>
                    <div className='page-link text-dark' onClick={() => this.onChangePagonation('Next')}>
                      Next
                    </div>
                  </li>
                </ul>

                <div className='quantityPageSelect'>
                  <select
                    className='form-select form-select-sm'
                    onChange={(e) => this.onChangeNumberOfUsers(e)}
                    value={`${numberOfUsers}`}
                  >
                    <option
                      value='10'
                      className="form-control"
                    >
                      10
                    </option>
                    <option
                      value='20'
                      className="form-control"
                    >
                      20
                    </option>
                  </select>
                </div>
                
              </div>

            </div>
          </div>
        }
        
        {display.newUsers && 
          <div className='addNewUser bg-light'>
            <div className='newUserSize border rounded-3 bg-white'>
              <div 
                className='d-flex flex-row-reverse pt-3 px-3 m-1'
                onClick={this.openListIfUsers}
              >
                <DeleteIcon className='cursor' />
              </div>

              <div className='px-5 pb-5'>
                <h4 className='text-center mt-2 mb-4'>Добавить пользователя</h4>
            
                <div className="form-group row mb-3">
                  <label htmlFor="staticName" className="col-sm-2 col-form-label">Логин:</label>
                  <div className="col-sm-10">
                    <input
                      value={newUser.login || ''}
                      onChange={(e) => this.onChangeUser(e, 'login')}
                      className={`form-control`}
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label htmlFor="staticName" className="col-sm-2 col-form-label">Email:</label>
                  <div className="col-sm-10">
                    <input
                      value={newUser.email || ''}
                      onChange={(e) => this.onChangeUser(e, 'email')}
                      className={`form-control ${error.email ? '' : 'border-danger'}`}
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label htmlFor="staticName" className="col-sm-2 col-form-label">Пароль:</label>
                  <div className="col-sm-10">
                    <input
                      type="password"
                      value={newUser.password || ''}
                      onChange={(e) => this.onChangeUser(e, 'password')}
                      className={`form-control ${newUser.password ? newUser.password.length > 5  ? '' : 'border-danger' : ''}`}
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label htmlFor="staticName" className="col-sm-2 col-form-label">Имя:</label>
                  <div className="col-sm-10">
                    <input
                      value={newUser.name || ''}
                      onChange={(e) => this.onChangeUser(e, 'name')}
                      className={`form-control ${error.name ? '' : 'border-danger'}`}
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label htmlFor="staticAge" className="col-sm-2 col-form-label">Возраст:</label>
                  <div className="col-sm-10">
                    <input
                      value={newUser.age || ''}
                      onChange={(e) => this.onChangeUser(e, 'age')}
                      className={`form-control ${error.age ? '' : 'border-danger'}`}
                    />
                  </div>
                </div> 

                <div className='d-flex justify-content-between sizeDivSelect'>
                  <div className="form-group row mb-3 sizeSelect1 d-flex justify-content-between">
                    <label className="col-sm-2 col-form-label sizeLabel px-0">Пол:</label>
                    <div className="col-sm-10 p-0 sizeOption">
                      <select
                        className='form-select'
                        onChange={(e) => this.onChangeUser(e, 'gender')}
                        value={newUser.gender || ''}
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

                  <div className="form-group row mb-3 sizeSelect2 d-flex justify-content-between">
                    <label className="col-sm-2 col-form-label sizeLabel">Роль:</label>
                    <div className="col-sm-10 p-0 sizeOption">
                      <select
                        className='form-select'
                        onChange={(e) => this.onChangeUser(e, 'role')}
                        value={newUser.role || ''}
                      >
                        <option
                          value='user'
                          className="form-control"
                        >
                          User
                        </option>
                        <option
                          value='admin'
                          className="form-control"
                        >
                          Admin
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className='d-flex justify-content-center'>
                  <button
                    onClick={this.addNewUser}
                    className='text-white bg-success form-control w-50 mx-1'
                  >
                    Добавить
                  </button>
                  <button
                    onClick={this.openListIfUsers}
                    className='text-white bg-success form-control w-50 mx-1'
                  >
                    Отмена
                  </button>
                </div>
              
              </div>
            </div>
          </div>
        }



        {display.changeUsers && 
          <div className='addNewUser bg-light'>
            <div className='newUserSize border rounded-3 bg-white'>
              <div 
                className='d-flex flex-row-reverse pt-3 px-3 m-1'
                onClick={this.openListIfUsers}
              >
                <DeleteIcon className='cursor' />
              </div>

              <div className='px-5 pb-5'>
                <h4 className='text-center mt-2 mb-4'>Изменить пользователя</h4>
            
                <div className="form-group row mb-3">
                  <label htmlFor="staticName" className="col-sm-2 col-form-label">Логин:</label>
                  <div className="col-sm-10">
                    <input
                      value={newUser.login || ''}
                      onChange={(e) => this.onChangeUser(e, 'login')}
                      className={`form-control`}
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label htmlFor="staticName" className="col-sm-2 col-form-label">Email:</label>
                  <div className="col-sm-10">
                    <input
                      value={newUser.email || ''}
                      onChange={(e) => this.onChangeUser(e, 'email')}
                      className={`form-control ${error.email ? '' : 'border-danger'}`}
                    />
                  </div>
                </div>
                <div className="form-group row mb-1">
                  <label htmlFor="staticName" className="col-sm-2 col-form-label">Пароль:</label>
                  <div className="col-sm-10">
                    <input
                      type="password"
                      value={newUser.password1 || ''}
                      onChange={(e) => this.onChangeUser(e, 'password1')}
                      className={`form-control ${newUser.password ? newUser.password.length > 5  ? '' : 'border-danger' : ''}`}
                    />
                  </div>
                </div>
                <div className="form-group row mb-2">
                  <label htmlFor="staticName" className="col-sm-2 col-form-label">Повторите пароль:</label>
                  <div className="col-sm-10">
                    <input
                      type="password"
                      value={newUser.password2 || ''}
                      onChange={(e) => this.onChangeUser(e, 'password2')}
                      className={`mt-3 form-control ${newUser.password ? newUser.password.length > 5  ? '' : 'border-danger' : ''}`}
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label htmlFor="staticName" className="col-sm-2 col-form-label">Имя:</label>
                  <div className="col-sm-10">
                    <input
                      value={newUser.name || ''}
                      onChange={(e) => this.onChangeUser(e, 'name')}
                      className={`form-control ${error.name ? '' : 'border-danger'}`}
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label htmlFor="staticAge" className="col-sm-2 col-form-label">Возраст:</label>
                  <div className="col-sm-10">
                    <input
                      value={newUser.age || ''}
                      onChange={(e) => this.onChangeUser(e, 'age')}
                      className={`form-control ${error.age ? '' : 'border-danger'}`}
                    />
                  </div>
                </div> 

                <div className='d-flex justify-content-around sizeDivSelect'>
                  <div className="form-group row mb-3 sizeSelect1 d-flex justify-content-between">
                    <label className="col-sm-2 col-form-label sizeLabel px-0">Пол:</label>
                    <div className="col-sm-10 p-0 sizeOption">
                      <select
                        className='form-select '
                        onChange={(e) => this.onChangeUser(e, 'gender')}
                        value={newUser.gender || ''}
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

                  <div className="form-group row mb-3 sizeSelect2 d-flex justify-content-between">
                    <label className="col-sm-2 col-form-label sizeLabel">Роль:</label>
                    <div className="col-sm-10 p-0 sizeOption">
                      <select
                        className='form-select'
                        onChange={(e) => this.onChangeUser(e, 'role')}
                        value={newUser.role || ''}
                      >
                        <option
                          value='user'
                          className="form-control"
                        >
                          User
                        </option>
                        <option
                          value='admin'
                          className="form-control"
                        >
                          Admin
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className='d-flex justify-content-center'>
                  <button
                    onClick={this.changeDataUser}
                    className='text-white bg-success form-control w-50 mx-1'
                  >
                    Изменить
                  </button>
                  <button
                    onClick={this.openListIfUsers}
                    className='text-white bg-success form-control w-50 mx-1'
                  >
                    Отмена
                  </button>
                </div>
              
              </div>
            </div>
          </div>
        }


      </div>
    );
  }
}

export default EditUsers;