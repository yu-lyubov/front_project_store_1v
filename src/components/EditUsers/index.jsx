import React from 'react';
import sendToServer from '../sendToServer';
import { ReactComponent as EditIcon } from '../../assets/icons/pencil-square.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icons/x-circle.svg';
import { ReactComponent as AddIcon } from '../../assets/icons/person-plus.svg';
import { validateEmail, isValidateName, isValidNumber, passwordMatch } from '../../helpers/m';
import './editUser.css';

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
            },
        };
        this.openAndCloseModal = this.openAndCloseModal.bind(this);
        this.onChangeUser = this.onChangeUser.bind(this);
        this.addNewUser = this.addNewUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.changeDataUser = this.changeDataUser.bind(this);
        this.onChangeNumberOfUsers = this.onChangeNumberOfUsers.bind(this);
        this.onChangePagination = this.onChangePagination.bind(this);
    }

    componentDidMount() {
        this.getUserFromServer();
    }

    getUserFromServer() {
        const { numberOfUsers, page } = this.state;
        sendToServer(`allUsers?perPage=${numberOfUsers}&page=${page}`, 'GET').then((value) => {
            const arr = this.range(1, value.pages);
            this.setState({ allUsers: value.users, arrPages: arr, pages: value.pages });
        });
    }

    range(from, to, step = 1) {
        const range = [];
        while (from <= to) {
            range.push(from);
            from += step;
        }
        return range;
    }

    // Открыть инпуты, кнопку

    openAndCloseModal(type, item) {
        const { display } = this.state;
        if (type === 'listOfUsers') {
            display.listOfUsers = true;
            display.newUsers = false;
            display.changeUsers = false;
            this.setState({ display, newUser: {} });
        }
        if (type === 'addUsers') {
            display.listOfUsers = false;
            display.newUsers = true;
            this.setState({ display });
        }
        if (type === 'changeUsers') {
            display.listOfUsers = false;
            display.changeUsers = true;
            this.setState({ display, newUser: { ...item } });
        }
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
        if (
            newUser.login &&
            validateEmail(newUser) &&
            newUser.password.length > 5 &&
            isValidateName(newUser?.name) &&
            isValidNumber(newUser?.age)
        ) {
            sendToServer('newUser', 'POST', newUser).then((value) => {
                allUsers.push(value);
                this.setState({ allUsers, newUser: {} });
                this.openAndCloseModal('listOfUsers');
            });
            return;
        }
        return alert('Данные введены некорректно!');
    }

    // Удаление пользователя

    deleteUser(item) {
        const { allUsers } = this.state;
        let answer = window.confirm('Удалить пользователя?');
        if (answer) {
            sendToServer('deleteUser', 'DELETE', item).then(() => {
                const index = allUsers.indexOf(item);
                if (index > -1) {
                    allUsers.splice(index, 1);
                }
                this.setState({ allUsers });
            });
        }
    }

    // Изменить данные пользователя

    changeDataUser() {
        const { newUser, allUsers } = this.state;
        if (
            newUser.login &&
            validateEmail(newUser) &&
            isValidateName(newUser?.name) &&
            isValidNumber(newUser?.age)
        ) {
            if (passwordMatch(newUser.password1, newUser.password2)) {
                if (newUser.password1 && newUser.password2) {
                    newUser.password = newUser.password1;
                    delete newUser.password1;
                    delete newUser.password2;
                }
                sendToServer('changeUser', 'PUT', newUser).then((value) => {
                    let newArr = [...new Set([...allUsers])];
                    newArr = newArr.map((el) => (el._id === value._id ? value : el));
                    this.setState({ allUsers: newArr });
                    this.openAndCloseModal('listOfUsers');
                });
                return;
            }
            return alert('Некорректно введены пароли');
        }
        return alert('Некорректно введены данные');
    }

    //

    onChangeNumberOfUsers(e) {
        this.setState({ numberOfUsers: Number(e.target.value), page: 1 });
        sendToServer(`allUsers?perPage=${Number(e.target.value)}&page=${1}`, 'GET').then(
            (value) => {
                const arr = this.range(1, value.pages);
                this.setState({ allUsers: value.users, arrPages: arr, pages: value.pages });
            },
        );
    }

    onChangePagination(item) {
        const { page, pages, numberOfUsers } = this.state;
        let num = item;
        if (item === 'Next') {
            num = page + 1;
        }
        if (item === 'Previous') {
            num = page - 1;
        }
        if (page !== num && num > 0 && num <= pages) {
            sendToServer(`allUsers?perPage=${numberOfUsers}&page=${num}`, 'GET').then((value) => {
                this.setState({ allUsers: value.users, page: num });
            });
        }
    }

    render() {
        const { display, newUser, numberOfUsers } = this.state;
        return (
            <div className="tableFormContainer bg-light">
                {display.listOfUsers && (
                    <div className="tableBlock bg-light">
                        <div className="sizeBox border rounded-3">
                            <div className="d-flex justify-content-end">
                                <button
                                    onClick={() => this.openAndCloseModal('addUsers')}
                                    className="btn btn-outline-success btn-sm sizeAddUser p-0 d-flex justify-content-center align-items-center"
                                >
                                    <AddIcon className="mx-1" />
                                    Add user
                                </button>
                            </div>

                            <table className="sizeTable table-bordered">
                                <caption className="pt-0 text-dark text-center">
                                    A list of users
                                </caption>
                                <thead>
                                    <tr className="bg-light">
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
                                                <div className="d-flex justify-content-around">
                                                    <EditIcon
                                                        onClick={() =>
                                                            this.openAndCloseModal(
                                                                'changeUsers',
                                                                item,
                                                            )
                                                        }
                                                        className="cursor"
                                                    />
                                                    <DeleteIcon
                                                        onClick={() => this.deleteUser(item)}
                                                        className="cursor"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>

                            <div className="d-flex justify-content-center">
                                <p className="m-0 mt-2 sizeTable">
                                    {this.state.page}/{this.state.pages}
                                </p>
                            </div>

                            <div className="d-flex justify-content-between mt-1">
                                <ul className="pagination cursor m-0">
                                    <div
                                        className="paginationBtn selectSz PrevBrdRad"
                                        onClick={() => this.onChangePagination('Previous')}
                                    >
                                        Previous
                                    </div>
                                    {this.state.arrPages.map((item, idx) => (
                                        <div
                                            className="paginationBtn selectSz brdPgn"
                                            key={`${item.id}-${idx}`}
                                            onClick={() => this.onChangePagination(item)}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                    <div
                                        className="paginationBtn selectSz NextBrdRad"
                                        onClick={() => this.onChangePagination('Next')}
                                    >
                                        Next
                                    </div>
                                </ul>

                                <div className="quantityPageSelect">
                                    <select
                                        className="form-select form-select-sm selectSz"
                                        onChange={(e) => this.onChangeNumberOfUsers(e)}
                                        value={`${numberOfUsers}`}
                                    >
                                        <option value="10" className="form-control">
                                            10
                                        </option>
                                        <option value="20" className="form-control">
                                            20
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {display.newUsers && (
                    <div className="addNewUser bg-light">
                        <div className="newUserSize border rounded-3">
                            <div
                                className="d-flex flex-row-reverse pt-3 px-3 m-1"
                                onClick={() => this.openAndCloseModal('listOfUsers')}
                            >
                                <DeleteIcon className="cursor" />
                            </div>
                            <div className="px-5 pb-5">
                                <h4 className="text-center mt-2 mb-4">Добавить пользователя</h4>
                                <div className="form-group row editUserMrg">
                                    <label
                                        htmlFor="staticLogin"
                                        className="col-sm-2 col-form-label"
                                    >
                                        Логин:
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            value={newUser.login || ''}
                                            onChange={(e) => this.onChangeUser(e, 'login')}
                                            className={`form-control`}
                                            id="staticLogin"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row editUserMrg">
                                    <label
                                        htmlFor="staticEmail"
                                        className="col-sm-2 col-form-label"
                                    >
                                        Email:
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            value={newUser.email || ''}
                                            onChange={(e) => this.onChangeUser(e, 'email')}
                                            className={`form-control ${
                                                validateEmail(newUser.email) ? '' : 'border-danger'
                                            }`}
                                            id="staticEmail"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row editUserMrg">
                                    <label
                                        htmlFor="staticPassword"
                                        className="col-sm-2 col-form-label"
                                    >
                                        Пароль:
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            type="password"
                                            value={newUser.password || ''}
                                            onChange={(e) => this.onChangeUser(e, 'password')}
                                            className={`form-control ${
                                                newUser.password
                                                    ? newUser.password.length > 5
                                                        ? ''
                                                        : 'border-danger'
                                                    : ''
                                            }`}
                                            id="staticPassword"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row editUserMrg">
                                    <label htmlFor="staticName" className="col-sm-2 col-form-label">
                                        Имя:
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            value={newUser.name || ''}
                                            onChange={(e) => this.onChangeUser(e, 'name')}
                                            className={`form-control ${
                                                isValidateName(newUser?.name) ? '' : 'border-danger'
                                            }`}
                                            id="staticName"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row editUserMrg">
                                    <label htmlFor="staticAge" className="col-sm-2 col-form-label">
                                        Возраст:
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            value={newUser.age || ''}
                                            onChange={(e) => this.onChangeUser(e, 'age')}
                                            className={`form-control ${
                                                isValidNumber(newUser?.age) ? '' : 'border-danger'
                                            }`}
                                            id="staticAge"
                                        />
                                    </div>
                                </div>

                                <div className="sizeDivSelect">
                                    <div className="form-group sizeSelect1">
                                        <label className="col-sm-2 sizeLabel">Пол:</label>
                                        <div className="col-sm-10 sizeOption">
                                            <select
                                                className="form-select"
                                                onChange={(e) => this.onChangeUser(e, 'gender')}
                                                value={newUser.gender || ''}
                                            >
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
                                    <div className="form-group sizeSelect1">
                                        <label className="col-sm-2 sizeLabel">Роль:</label>
                                        <div className="col-sm-10 sizeOption">
                                            <select
                                                className="form-select"
                                                onChange={(e) => this.onChangeUser(e, 'role')}
                                                value={newUser.role || ''}
                                            >
                                                <option value="user" className="form-control">
                                                    User
                                                </option>
                                                <option value="admin" className="form-control">
                                                    Admin
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button
                                        onClick={this.addNewUser}
                                        className="text-white bg-success form-control w-50"
                                    >
                                        Добавить
                                    </button>
                                    <button
                                        onClick={() => this.openAndCloseModal('listOfUsers')}
                                        className="text-white bg-success form-control w-50"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {display.changeUsers && (
                    <div className="addNewUser bg-light">
                        <div className="newUserSize border rounded-3">
                            <div
                                className="d-flex flex-row-reverse pt-3 px-3 m-1"
                                onClick={() => this.openAndCloseModal('listOfUsers')}
                            >
                                <DeleteIcon className="cursor" />
                            </div>
                            <div className="px-5 pb-5">
                                <h4 className="text-center mt-2 mb-4">Изменить пользователя</h4>
                                <div className="form-group row editUserMrg">
                                    <label
                                        htmlFor="staticLogin"
                                        className="col-sm-2 col-form-label"
                                    >
                                        Логин:
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            value={newUser.login || ''}
                                            onChange={(e) => this.onChangeUser(e, 'login')}
                                            className={`form-control`}
                                            id="staticLogin"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row editUserMrg">
                                    <label
                                        htmlFor="staticEmail"
                                        className="col-sm-2 col-form-label"
                                    >
                                        Email:
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            value={newUser.email || ''}
                                            onChange={(e) => this.onChangeUser(e, 'email')}
                                            className={`form-control ${
                                                validateEmail(newUser.email) ? '' : 'border-danger'
                                            }`}
                                            id="staticEmail"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row editUserMrg">
                                    <label
                                        htmlFor="staticPassword"
                                        className="col-sm-2 col-form-label"
                                    >
                                        Пароль:
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            type="password"
                                            value={newUser.password1 || ''}
                                            onChange={(e) => this.onChangeUser(e, 'password1')}
                                            className={`form-control ${
                                                newUser.password
                                                    ? newUser.password.length > 5
                                                        ? ''
                                                        : 'border-danger'
                                                    : ''
                                            }`}
                                            id="staticPassword"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row editUserMrg">
                                    <label
                                        htmlFor="staticPassword2"
                                        className="col-sm-2 col-form-label"
                                    >
                                        Повторите пароль:
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            type="password"
                                            value={newUser.password2 || ''}
                                            onChange={(e) => this.onChangeUser(e, 'password2')}
                                            className={`form-control ${
                                                newUser.password
                                                    ? newUser.password.length > 5
                                                        ? ''
                                                        : 'border-danger'
                                                    : ''
                                            }`}
                                            id="staticPassword2"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row editUserMrg">
                                    <label htmlFor="staticName" className="col-sm-2 col-form-label">
                                        Имя:
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            value={newUser.name || ''}
                                            onChange={(e) => this.onChangeUser(e, 'name')}
                                            className={`form-control ${
                                                isValidateName(newUser?.name) ? '' : 'border-danger'
                                            }`}
                                            id="staticName"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row editUserMrg">
                                    <label htmlFor="staticAge" className="col-sm-2 col-form-label">
                                        Возраст:
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            value={newUser.age || ''}
                                            onChange={(e) => this.onChangeUser(e, 'age')}
                                            className={`form-control ${
                                                isValidNumber(newUser?.age) ? '' : 'border-danger'
                                            }`}
                                            id="staticAge"
                                        />
                                    </div>
                                </div>
                                <div className="sizeDivSelect">
                                    <div className="form-group sizeSelect1">
                                        <label className="col-sm-2 sizeLabel">Пол:</label>
                                        <div className="col-sm-10 sizeOption">
                                            <select
                                                className="form-select "
                                                onChange={(e) => this.onChangeUser(e, 'gender')}
                                                value={newUser.gender || ''}
                                            >
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

                                    <div className="form-group sizeSelect1">
                                        <label className="col-sm-2 sizeLabel">Роль:</label>
                                        <div className="col-sm-10 sizeOption">
                                            <select
                                                className="form-select"
                                                onChange={(e) => this.onChangeUser(e, 'role')}
                                                value={newUser.role || ''}
                                            >
                                                <option value="user" className="form-control">
                                                    User
                                                </option>
                                                <option value="admin" className="form-control">
                                                    Admin
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button
                                        onClick={this.changeDataUser}
                                        className="text-white bg-success form-control w-50"
                                    >
                                        Изменить
                                    </button>
                                    <button
                                        onClick={() => this.openAndCloseModal('listOfUsers')}
                                        className="text-white bg-success form-control w-50"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default EditUsers;
