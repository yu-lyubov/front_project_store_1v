import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { ReactComponent as EditIcon } from '../../assets/icons/pencil-square.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icons/x-circle.svg';
import { ReactComponent as ConfirmIcon } from '../../assets/icons/check-circle.svg';
import sendToServer from '../sendToServer';
import { isAdmin } from '../../helpers/m';
import './menuStyle.css';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            oneCategory: {},
            text: '',
            display: {
                createCategory: false,
                button: true,
                changeCategory: false,
            },
            user: JSON.parse(localStorage.getItem('userInfo')) || '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.openAndCloseInput = this.openAndCloseInput.bind(this);
        this.editNameCategory = this.editNameCategory.bind(this);
        this.changeNameCategory = this.changeNameCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    componentDidMount() {
        this.getUserFromServer();
    }

    getUserFromServer() {
        sendToServer('allCategory', 'GET').then((value) => {
            this.setState({ categories: value });
        });
    }

    // Добавление категории

    handleSubmit(e) {
        e.preventDefault();
        const { oneCategory } = this.state;
        if (oneCategory.name.length === 0) {
            return;
        }
        sendToServer('newCategory', 'POST', oneCategory).then((value) => {
            this.setState((state) => ({
                categories: state.categories.concat(value),
                oneCategory: {},
            }));
            this.openAndCloseInput('closeInput');
        });
    }

    // Открыть инпуты, кнопку

    openAndCloseInput = (type, checkInput = true, item) => {
        const { oneCategory, display } = this.state;
        if (type === 'openInput') {
            display.createCategory = true;
            display.button = false;
            return this.setState({ display });
        }
        if (type === 'openCreateInput') {
            display.createCategory = false;
            display.changeCategory = true;
            display.button = false;
            return this.setState({ oneCategory: { ...item }, display });
        }
        if (type === 'closeInput') {
            if (oneCategory.name && checkInput)
                return this.setState({ oneCategory: (oneCategory.name = '') });
            display.createCategory = false;
            display.changeCategory = false;
            display.button = true;
            return this.setState({ oneCategory: {}, display });
        }
    };

    // Редактирование категории

    editNameCategory(e) {
        const { oneCategory } = this.state;
        oneCategory.name = e.target.value;
        this.setState({ oneCategory });
    }

    changeNameCategory() {
        const { categories, oneCategory } = this.state;
        if (oneCategory.name.length > 0) {
            sendToServer('changeNameCategory', 'PUT', oneCategory).then((value) => {
                categories.forEach((el) => {
                    if (el._id === value._id) {
                        el.name = value.name;
                    }
                });
                this.setState({ categories, oneCategory: {} });
                this.openAndCloseInput('closeInput');
            });
            return;
        }
        alert('Введите название категории');
    }

    // Удаление категории

    deleteCategory(item) {
        const { categories } = this.state;
        this.openAndCloseInput('closeInput');
        let answer = window.confirm('Удалить категорию?');
        if (answer) {
            sendToServer('deleteCategory', 'DELETE', item).then(() => {
                const index = categories.indexOf(item);
                if (index > -1) {
                    categories.splice(index, 1);
                }
                this.setState({ categories });
                return this.props.history.push('/category');
            });
        }
    }

    render() {
        const { openedMenu, toggleMenu } = this.props;
        const { user } = this.state;
        const { createCategory, changeCategory, button } = this.state.display;
        const { name } = this.state.oneCategory;
        return (
            <div className="menuFormContainer">
                <div className="mobileView">
                    <SwipeableDrawer
                        anchor="left"
                        open={openedMenu || false}
                        onClose={toggleMenu}
                        onOpen={toggleMenu}
                    >
                        <div className="menuBlock">
                            <ul className="list-group list-group-flush widthUlContener">
                                <h5 className="text-center m-0 py-3 border-bottom">Категории</h5>
                                {this.state.categories.map((item, idx) => (
                                    <div
                                        className="d-flex flex-row border-bottom"
                                        key={`${item.id}-${idx}`}
                                    >
                                        <Link
                                            onClick={toggleMenu}
                                            to={`/category/${item._id}`}
                                            className="list-group-item list-group-item-action border-0"
                                        >
                                            <li
                                                onClick={() =>
                                                    this.openAndCloseInput('closeInput', false)
                                                }
                                                className="sizeLi list-group-item-action"
                                            >
                                                {item.name}
                                            </li>
                                        </Link>
                                        {isAdmin(user) && (
                                            <div className="d-flex flex-column">
                                                <div
                                                    className="cursor m-1"
                                                    onClick={() =>
                                                        this.openAndCloseInput(
                                                            'openCreateInput',
                                                            false,
                                                            item,
                                                        )
                                                    }
                                                >
                                                    <EditIcon />
                                                </div>
                                                <div
                                                    className="cursor m-1"
                                                    onClick={() => this.deleteCategory(item)}
                                                >
                                                    <DeleteIcon />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {createCategory && (
                                    <div className="list-group-item">
                                        <input
                                            className="w-100"
                                            onChange={this.editNameCategory}
                                            value={name || ''}
                                        />
                                        <div className="d-flex justify-content-end">
                                            <div
                                                onClick={this.handleSubmit}
                                                className="cursor my-1"
                                            >
                                                <ConfirmIcon className="sizeButton" />
                                            </div>
                                            <div
                                                onClick={() => this.openAndCloseInput('closeInput')}
                                                className="cursor m-1"
                                            >
                                                <DeleteIcon className="sizeButton" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {changeCategory && (
                                    <div className="list-group-item border-0">
                                        <input
                                            className="w-100"
                                            onChange={this.editNameCategory}
                                            value={name || ''}
                                        />
                                        <div className="d-flex justify-content-end">
                                            <div
                                                onClick={this.changeNameCategory}
                                                className="cursor my-1"
                                            >
                                                <ConfirmIcon className="sizeButton" />
                                            </div>
                                            <div
                                                onClick={() => this.openAndCloseInput('closeInput')}
                                                className="cursor m-1"
                                            >
                                                <DeleteIcon className="sizeButton" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {isAdmin(user) && button && (
                                    <div className="d-flex justify-content-center">
                                        <button
                                            onClick={() => this.openAndCloseInput('openInput')}
                                            className="btn btn-outline-success btn-sm mt-3 p-1 w-75"
                                        >
                                            Добавить новую категорию
                                        </button>
                                    </div>
                                )}
                            </ul>
                        </div>
                    </SwipeableDrawer>
                </div>

                <div className="menuBlock border desktopView">
                    <ul className="list-group list-group-flush widthUlContener">
                        <h5 className="text-center m-0 py-3 border-bottom">Категории</h5>
                        {this.state.categories.map((item, idx) => (
                            <div
                                className="d-flex flex-row border-bottom"
                                key={`${item.id}-${idx}`}
                            >
                                <Link
                                    onClick={() => this.openAndCloseInput('closeInput', false)}
                                    to={`/category/${item._id}`}
                                    className="list-group-item list-group-item-action border-0 "
                                >
                                    <li className="sizeLi list-group-item-action">{item.name}</li>
                                </Link>
                                {isAdmin(user) && (
                                    <div className="d-flex flex-column">
                                        <div
                                            className="cursor m-1"
                                            onClick={() =>
                                                this.openAndCloseInput(
                                                    'openCreateInput',
                                                    false,
                                                    item,
                                                )
                                            }
                                        >
                                            <EditIcon />
                                        </div>
                                        <div
                                            className="cursor m-1"
                                            onClick={() => this.deleteCategory(item)}
                                        >
                                            <DeleteIcon />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {createCategory && (
                            <div className="list-group-item">
                                <input
                                    className="w-100"
                                    onChange={this.editNameCategory}
                                    value={name || ''}
                                />
                                <div className="d-flex justify-content-end">
                                    <div onClick={this.handleSubmit} className="cursor my-1">
                                        <ConfirmIcon className="sizeButton" />
                                    </div>
                                    <div
                                        onClick={() => this.openAndCloseInput('closeInput')}
                                        className="cursor m-1"
                                    >
                                        <DeleteIcon className="sizeButton" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {changeCategory && (
                            <div className="list-group-item border-0">
                                <input
                                    className="w-100"
                                    onChange={this.editNameCategory}
                                    value={name || ''}
                                />
                                <div className="d-flex justify-content-end">
                                    <div onClick={this.changeNameCategory} className="cursor my-1">
                                        <ConfirmIcon className="sizeButton" />
                                    </div>
                                    <div
                                        onClick={() => this.openAndCloseInput('closeInput')}
                                        className="cursor m-1"
                                    >
                                        <DeleteIcon className="sizeButton" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {isAdmin(user) && button && (
                            <div className="d-flex justify-content-center">
                                <button
                                    onClick={() => this.openAndCloseInput('openInput')}
                                    className="btn btn-outline-success btn-sm mt-3 p-1 w-75"
                                >
                                    Добавить новую категорию
                                </button>
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}

export default withRouter(Menu);
