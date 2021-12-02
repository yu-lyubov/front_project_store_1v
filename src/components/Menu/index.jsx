import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './menuStyle.css';
import {ReactComponent as EditIcon} from '../../assets/icons/pencil-square.svg';
import {ReactComponent as DeleteIcon} from '../../assets/icons/x-circle.svg';
import {ReactComponent as ConfirmIcon} from '../../assets/icons/check-circle.svg';
import sendToServer from '../sendToServer';
import { Link, withRouter } from 'react-router-dom';
import { isAdmin } from '../../helpers/m';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      oneCategory: {},
      text: '',
      display: {
        createNewCategory: false,
        button: true,
        changeAndDeleteCategory: false,
      },
      userInfo: JSON.parse(localStorage.getItem('userInfo')) || '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openButton = this.openButton.bind(this);
    this.addNewCategory = this.addNewCategory.bind(this);
    this.openDisplayEditCategory = this.openDisplayEditCategory.bind(this);
    this.editNameOneCategory = this.editNameOneCategory.bind(this);
    this.saveNewNameForCategory = this.saveNewNameForCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  componentDidMount() {
    this.getUserFromServer();  
  }

  getUserFromServer() {
    sendToServer('allCategory', 'GET', true)
    .then((value) => {
      this.setState({ categories: value })
    })
  }

  // Добавление категории

  handleSubmit(e) {
    e.preventDefault();
    const { oneCategory } = this.state;
    if (oneCategory.name.length === 0) {
      return;
    }
    const newItem = {
      name: oneCategory.name,
    };
    sendToServer('newCategory', 'POST', true, newItem)
    .then((value) => {
      this.setState(state => ({
        categories: state.categories.concat(value),
        oneCategory: {},
      }))
      this.openButton();
    })
  }

  // Открыть инпуты, кнопку

  openButton() {
    const { oneCategory, display } = this.state;
    if (!!oneCategory.name) {
      oneCategory.name = '';
      this.setState({ oneCategory });
    } else {
      display.createNewCategory = false;
      display.changeAndDeleteCategory = false;
      display.button = true;
      this.setState({ display, oneCategory: {} });
    }
  }

  addNewCategory() {
    const { display } = this.state;
    display.createNewCategory = true;
    display.button = false;
    this.setState({ display });
  }

  openDisplayEditCategory(item) {
    const { display } = this.state;
    display.createNewCategory = false;
    display.changeAndDeleteCategory = true;
    display.button = false;
    this.setState({ oneCategory: {...item}, display });
  }

  // Редактирование категории

  editNameOneCategory(e) {
    const { oneCategory } = this.state;
    oneCategory.name = e.target.value;
    this.setState({ oneCategory });
  }

  saveNewNameForCategory() {
    const { categories, oneCategory } = this.state;

    if (oneCategory.name.length > 0) {
      sendToServer('changeNameCategory', 'PUT', true, oneCategory)
      .then((value) => {
        categories.forEach((el) => {
          if (el._id === value._id) {
            el.name = value.name;
          }
        })
        this.setState({ categories, oneCategory: {} });
        this.openButton();
      })
    } else {
      alert('Введите название категории');
    }
  }

  // Удаление категории

  deleteCategory(item) {
    const { categories } = this.state;
    this.openButton();
    let answer = window.confirm('Удалить категорию?');
    if (answer) {
      sendToServer('deleteCategory', 'DELETE', true, item)
      .then(() => {
        const index = categories.indexOf(item);
        if (index > -1) {
          categories.splice(index, 1);
        }
        this.setState({ categories });
        return this.props.history.push("/category");
      })
    }
  }

  render () {
    const { display, oneCategory, userInfo } = this.state;
    return (
      <div className='menuFormContainer'>
        <div className='d-flex align-items-stretch'>
          <div className='categoryBlock border'>
            <ul className='list-group list-group-flush widthUlContener'>
              <h5 className='text-center m-0 py-3 border-bottom'>Категории</h5>

              {this.state.categories.map((item, idx) => (
                <div
                  className='d-flex flex-row'
                  key={`${item.id}-${idx}`}
                >
                  <Link to={`/category/${item._id}`} className='list-group-item list-group-item-action border-0 border-bottom'>
                  <li
                    className='sizeLi d-flex justify-content-between align-items-center list-group-item-action border-0'
                  >
                    {item.name}
                    
                    {isAdmin(userInfo) && 
                      <div className='hoverEdit'>
                        <div className='d-flex flex-column'>
                          <div
                            className='cursor m-1'
                            onClick={() => this.openDisplayEditCategory(item)}
                          >
                            <EditIcon />
                          </div>
                          <div
                            className='cursor m-1'
                            onClick={() => this.deleteCategory(item)}
                          >
                            <DeleteIcon />
                          </div>
                        </div>
                      </div>
                    }

                  </li>
                  </Link>
                </div>
              ))}


              {display.createNewCategory && 
                <div className='list-group-item'>
                  <input
                    className='w-100'
                    onChange={this.editNameOneCategory}
                    value={oneCategory.name}
                  />
                  <div className='d-flex justify-content-end'>
                    <div
                      onClick={this.handleSubmit}
                      className='cursor my-1'
                    >
                      <ConfirmIcon className='sizeButton' />
                    </div>
                    <div
                      onClick={this.openButton}
                      className='cursor m-1'
                    >
                      <DeleteIcon className='sizeButton' />
                    </div>
                  </div>
                </div>
              }



              {display.changeAndDeleteCategory && 
              <div className='list-group-item border-0'>
                <input
                  className='w-100'
                  onChange={this.editNameOneCategory}
                  value={oneCategory.name || ''}
                />
                <div className='d-flex justify-content-end'>
                  <div
                    onClick={this.saveNewNameForCategory}
                    className='cursor my-1'
                  >
                    <ConfirmIcon className='sizeButton' />
                  </div>
                  <div
                    onClick={this.openButton}
                    className='cursor m-1'
                  >
                    <DeleteIcon className='sizeButton' />
                  </div>
                </div>
              </div>}



              {isAdmin(userInfo) && display.button && 
                <div className='d-flex justify-content-center'>
                  <button 
                    onClick={this.addNewCategory}
                    className="btn btn-outline-success btn-sm mt-3 p-1 w-75"
                  >
                    Добавить новую категорию
                  </button>
                </div> 
              }

            </ul>
          </div>
        </div>
      </div> 
    )
  }
}

export default withRouter(Menu);
