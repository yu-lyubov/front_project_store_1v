import React from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './categoryStyle.css';
import {ReactComponent as CartPlusIcon} from '../../assets/icons/cart-plus.svg';
import {ReactComponent as EditIcon} from '../../assets/icons/pencil-square.svg';
import {ReactComponent as DeleteIcon} from '../../assets/icons/x-circle.svg';
import sendToServer from '../sendToServer';
import { isAdmin, isValidNumber } from '../../helpers/m';

class ShoppingCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allProduct: [],
      product: {},
      display: {
        categories: true,
        newProduct: false,
        editProduct: false,
      },
      userInfo: JSON.parse(localStorage.getItem('userInfo')) || '',
    };
    this.onChangeProduct = this.onChangeProduct.bind(this);
    this.openCategories = this.openCategories.bind(this);
    this.openNewProduct = this.openNewProduct.bind(this);
    this.addNewProduct = this.addNewProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.changeProductData = this.changeProductData.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.getUserFromServer(id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const id = this.props.match.params.id;
      this.getUserFromServer(id);
    }
  }

  getUserFromServer(id) {
    sendToServer(`allProduct/${id}`, 'GET', true)
    .then((value) => {
      this.setState({ allProduct: value });
    })
    .catch((e) => {
      console.log(e);
    }) 
  }

  // Открытие категории, добавление и изменение продуктов.

  openCategories() {
    const { display } = this.state;
    display.categories = true;
    display.newProduct = false;
    display.editProduct = false;
    this.setState({ product: {}, display });
  }

  openNewProduct() {
    const { display } = this.state;
    display.categories = false;
    display.newProduct = true;
    this.setState({ display });
  }

  openDisplayEditProduct(item) {
    const { display } = this.state;
    display.editProduct = true;
    display.categories = false;
    this.setState({ product: {...item}, display });
  }

  // Добавление новых продуктов

  onChangeProduct(e, type) {
    const { product } = this.state;
    product[type] = e.target.value;
    this.setState({ product });
  }

  onSelectFile(e) {
    const { product } = this.state;
    product.image = e.target.files[0];
    this.setState({ product });
  }

  addNewProduct() {
    const { allProduct, product } = this.state;
    product.id = this.props.match.params.id;
    if (product.name && product.price && this.isValidStringLength()) {
      if (isValidNumber(product?.price) && isValidNumber(product?.discountPrice)) {
        const formData  = new FormData()

        for(const key in product) {
          formData.append(key, product[key]);
        }

        sendToServer('newProduct', 'POST', true, formData)
        .then((value) => {
          allProduct.push(value);
          this.openCategories();
          this.setState({ allProduct });
        })
      } else {
        alert('Некорректно ведены параметры цены');
      }
    } else {
      alert('Введите данные корректно');
    }
  }

  // Удалить продукты

  deleteProduct(item) {
    const { allProduct } = this.state;
    let answer = window.confirm('Удалить товар?');
    if (answer) {
      sendToServer('deleteProduct', 'DELETE', true, item)
      .then(() => {
        const index = allProduct.indexOf(item);
        if (index > -1) {
          allProduct.splice(index, 1);
        }
        this.setState({ allProduct });
      })
    }
  }

  // Изменить данные продукты

  changeProductData() {
    const { product, allProduct } = this.state;
    if (product.name && product.price && this.isValidStringLength()) {
      if (isValidNumber(product?.price) && isValidNumber(product?.discountPrice)) {
        sendToServer('changeProduct', 'PUT', true, product)
        .then((value) => {
          let newArr = [...new Set([...allProduct])];
          newArr = newArr.map((el) => (el._id === value._id ? value : el));
          this.setState({ allProduct: newArr });
          this.openCategories();
        })
      } else {
        alert('Некорректно ведены параметры цены');
      }
    } else {
      alert('Введите данные корректно');
    }
  }

  // 

  isValidStringLength () {
    const { product } = this.state;
    if (!product.name || (!!product.name && product.name.length <= 42)) {
      return true;
    }
    return false;
  }

  render () {
    const { userInfo, product, display } = this.state;
    // console.log(allProduct);
    const error = {
      price: !isValidNumber(product?.price),
      discount: !isValidNumber(product?.discountPrice),
      name: !this.isValidStringLength(),
    };
    // console.log(this.props.history.push(`${this.props.match.url}/sdfsdfdsfsdf}`));
    return (
      <div className='categoryFormContainer bg-light'>

        {display.categories && 
          <div className='categoryBlock bg-light'>
            
            {this.state.allProduct.map((item, idx) => (
              <div
                className='blockSize border rounded-3 bg-white blockProduct'
                key={`${item.id}-${idx}`}
              >
                <div className='d-flex flex-column justify-content-between'>

                  <img
                    src={item.imagePath || '/images/nophoto.jpg'}
                    alt={item.name}
                    className='pictureAndTextSize my-3'
                  />

                  <div className='heightNameAndPrice d-flex flex-column justify-content-between mb-3'>
                    <p className='m-0 pictureAndTextSize textWrap'>{item.name}</p>

                    {item.discountPrice ? (
                      <div className='d-flex flex-column align-items-center'>
                        <p className='m-0 withSale fs-5'>{`${item.discountPrice} ₽`}</p>
                        <p className='fs-6 sale mb-0'>{`${item.price} ₽`}</p>
                      </div>
                    ) : (
                      <div className='d-flex flex-column align-items-center'>
                        <p className='m-0 withoutSale fs-5 mb-3'>{`${item.price} ₽`}</p>

                      </div>
                    )}
                  </div>

                </div>
                {isAdmin(userInfo) &&
                  <div className='editHover'>
                    <div className='d-flex flex-column'>
                      <div
                        className='cursor'
                        onClick={() => this.openDisplayEditProduct(item)}
                      >
                        <EditIcon />
                      </div>
                      <div
                        className='cursor'
                        onClick={() => this.deleteProduct(item)}
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                  </div>
                }

              </div>
            ))}
            
            {isAdmin(userInfo) &&
              <div className='d-flex blockSize border rounded-3 bg-white'>
                <div 
                  onClick={this.openNewProduct}
                  className='addNewCategory cursor'
                >
                  <CartPlusIcon
                    className='bottonSize'
                  />
                </div>
              </div>
            }

          </div>
        }
        


        {display.editProduct &&
          <div className='addNewCategory'>
            <div className='newCategoriesSize border rounded-3 bg-white'>
              <div 
                className='d-flex flex-row-reverse pt-3 px-3 m-1'
                onClick={this.openCategories}
              >
                <DeleteIcon className='cursor' />
              </div>

              <div className='px-5 pb-5'>
                <h4 className='text-center mt-2 mb-4'>Изменить товар</h4>
                <input
                  value={product.name}
                  onChange={(e) => this.onChangeProduct(e, 'name')}
                  className={`form-control ${error.name ? 'border-danger' : ''}`}
                  placeholder='Название товара'
                />

                <div className='d-flex flex-row-reverse'>
                  <p className='m-0'>
                    <small>
                      {!!product.name ? `${product.name.length}` : '0'}/42 символа
                    </small>
                  </p>
                </div>

                <div className='d-flex flex-row justify-content-between'>
                  <input
                    value={product.price}
                    onChange={(e) => this.onChangeProduct(e, 'price')}
                    className={`form-control mb-3 priceOfProductSize ${error.price ? 'border-danger' : ''}`}
                    placeholder='Сумма товара'
                  />
                  <input
                    value={product.discountPrice}
                    onChange={(e) => this.onChangeProduct(e, 'discountPrice')}
                    className={`form-control mb-3 priceOfProductSize ${error.discount ? 'border-danger' : ''}`}
                    placeholder='Сумма со скидкой'
                  />
                </div>

                <input
                  type='file'
                  className='form-control mb-3'
                />

                <div className='d-flex justify-content-center'>
                  <button
                    onClick={this.changeProductData}
                    className='text-white bg-success form-control w-50 mx-1'
                  >
                    Изменить
                  </button>
                  <button
                    onClick={this.openCategories}
                    className='text-white bg-success form-control w-50 mx-1'
                  >
                    Отмена
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        }



        {display.newProduct &&
          <div className='addNewCategory'>
            <div className='newCategoriesSize border rounded-3 bg-white'>

              <div 
                className='d-flex flex-row-reverse pt-3 px-3 m-1'
                onClick={this.openCategories}
              >
                <DeleteIcon className='cursor' />
              </div>

              <div className='px-5 pb-5'>
                <h4 className='text-center mt-2 mb-4'>Добавить товар</h4>
                <input
                  value={product.name}
                  onChange={(e) => this.onChangeProduct(e, 'name')}
                  className={`form-control ${error.name ? 'border-danger' : ''}`}
                  placeholder='Название товара'
                />
                
                <div className='d-flex flex-row-reverse'>
                  <p className='m-0'>
                    <small>
                      {!!product.name ? `${product.name.length}` : '0'}/42 символа
                    </small>
                  </p>
                </div>

                <div className='d-flex flex-row justify-content-between'>
                  <input
                    value={product.price}
                    onChange={(e) => this.onChangeProduct(e, 'price')}
                    className={`form-control mb-3 priceOfProductSize ${error.price ? 'border-danger' : ''}`}
                    placeholder='Сумма товара'
                  />
                  <input
                    value={product.discountPrice}
                    onChange={(e) => this.onChangeProduct(e, 'discountPrice')}
                    className={`form-control mb-3 priceOfProductSize ${error.discount ? 'border-danger' : ''}`}
                    placeholder='Сумма со скидкой'
                  />
                </div>

                <input
                  type='file'
                  onChange={(e) => this.onSelectFile(e)}
                  id='filechooser'
                  className='form-control mb-3'
                />

                <div className='d-flex justify-content-center'>
                  <button
                    onClick={this.addNewProduct}
                    className='text-white bg-success form-control w-50 mx-1'
                  >
                    Добавить
                  </button>
                  <button
                    onClick={this.openCategories}
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
    )
  }
}

export default withRouter(ShoppingCategories);