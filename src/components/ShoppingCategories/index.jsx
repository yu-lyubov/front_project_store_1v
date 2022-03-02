import React from 'react';
import { withRouter } from 'react-router-dom';
import { ReactComponent as CartPlusIcon } from '../../assets/icons/cart-plus.svg';
import { ReactComponent as EditIcon } from '../../assets/icons/pencil-square.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icons/x-circle.svg';
import sendToServer from '../sendToServer';
import { isAdmin, isValidNumber, isValidNameProduct } from '../../helpers/m';
import './categoryStyle.css';

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
            user: JSON.parse(localStorage.getItem('userInfo')) || '',
        };
        this.openAndCloseModal = this.openAndCloseModal.bind(this);
        this.onChangeProduct = this.onChangeProduct.bind(this);
        this.addNewProduct = this.addNewProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.changeProductData = this.changeProductData.bind(this);
        this.onSelectFile = this.onSelectFile.bind(this);
        this.deteleImage = this.deteleImage.bind(this);
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.getUserFromServer(id);
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            const id = this.props.match.params.id;
            this.getUserFromServer(id);
            this.openAndCloseModal('categories');
        }
    }

    getUserFromServer(id) {
        sendToServer(`allProduct/${id}`, 'GET').then((value) => {
            this.setState({ allProduct: value });
        });
    }

    // Открытие категории, добавление и изменение продуктов.

    openAndCloseModal(type, item) {
        const { display } = this.state;
        if (type === 'categories') {
            display.categories = true;
            display.newProduct = false;
            display.editProduct = false;
            this.setState({ product: {}, display });
        }
        if (type === 'newProducts') {
            display.categories = false;
            display.newProduct = true;
            this.setState({ display });
        }
        if (type === 'editProducts') {
            display.editProduct = true;
            display.categories = false;
            this.setState({ product: { ...item }, display });
        }
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
        if (product.name && product.price && isValidNameProduct(product.name)) {
            if (isValidNumber(product?.price) && isValidNumber(product?.discountPrice)) {
                const formData = new FormData();

                for (const key in product) {
                    formData.append(key, product[key]);
                }

                sendToServer('newProduct', 'POST', formData).then((value) => {
                    allProduct.push(value);
                    this.setState({ allProduct });
                    this.openAndCloseModal('categories');
                });
                return;
            }
            return alert('Некорректно ведены параметры цены');
        }
        alert('Введите данные корректно');
    }

    // Удалить продукты

    deleteProduct(item) {
        const { allProduct } = this.state;
        let answer = window.confirm('Удалить товар?');
        if (answer) {
            sendToServer('deleteProduct', 'DELETE', item).then(() => {
                const index = allProduct.indexOf(item);
                if (index > -1) {
                    allProduct.splice(index, 1);
                }
                this.setState({ allProduct });
            });
        }
    }

    // Изменить данные продукты

    changeProductData() {
        const { product, allProduct } = this.state;
        allProduct.forEach((el) => {
            if (el._id === product._id) {
                product.imagePath = el.imagePath;
            }
        });
        if (product.name && product.price && isValidNameProduct(product.name)) {
            if (isValidNumber(product?.price) && isValidNumber(product?.discountPrice)) {
                const formData = new FormData();
                for (const key in product) {
                    formData.append(key, product[key]);
                }

                sendToServer('changeProduct', 'PUT', formData).then((value) => {
                    let newArr = [...new Set([...allProduct])];
                    newArr = newArr.map((el) => (el._id === value._id ? value : el));
                    this.setState({ allProduct: newArr });
                    this.openAndCloseModal('categories');
                });
                return;
            }
            return alert('Некорректно ведены параметры цены');
        }
        return alert('Введите данные корректно');
    }

    //

    deteleImage(value) {
        value.imagePath = null;
        delete value.image;
        this.setState({ product: value });
    }

    render() {
        const { user, product, display } = this.state;
        return (
            <div className="categoryFormContainer bg-light">
                {display.categories && (
                    <div className="categoryBlock bg-light">
                        {this.state.allProduct.map((item, idx) => (
                            <div
                                key={`${item.id}-${idx}`}
                                className="blockSize border rounded-3 bg-white blockProduct"
                            >
                                <div className="d-flex flex-column justify-content-between">
                                    <img
                                        src={item.imagePath || '/images/nophoto.jpg'}
                                        alt={item.name}
                                        className="pictureAndTextSize my-3"
                                    />

                                    <div className="heightNameAndPrice d-flex flex-column justify-content-between mb-3">
                                        <p className="m-0 pictureAndTextSize textWrap">
                                            {item.name}
                                        </p>

                                        {item.discountPrice ? (
                                            <div className="d-flex flex-column">
                                                <p className="m-0 withSale fs-5">{`${item.discountPrice} ₽`}</p>
                                                <p className="fs-6 sale mb-0">{`${item.price} ₽`}</p>
                                            </div>
                                        ) : (
                                            <div className="d-flex flex-column align-items-center">
                                                <p className="m-0 withoutSale fs-5 mb-3">{`${item.price} ₽`}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isAdmin(user) && (
                                    <div className="editHover">
                                        <div className="d-flex flex-column">
                                            <div
                                                className="cursor"
                                                onClick={() =>
                                                    this.openAndCloseModal('editProducts', item)
                                                }
                                            >
                                                <EditIcon />
                                            </div>
                                            <div
                                                className="cursor"
                                                onClick={() => this.deleteProduct(item)}
                                            >
                                                <DeleteIcon />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isAdmin(user) && (
                            <div className="d-flex blockSize border rounded-3 bg-white">
                                <div
                                    onClick={() => this.openAndCloseModal('newProducts')}
                                    className="addNewCategory cursor"
                                >
                                    <CartPlusIcon className="bottonSize" />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {display.editProduct && (
                    <div className="addNewCategory">
                        <div className="newCategoriesSize border rounded-3">
                            <div
                                className="d-flex flex-row-reverse pt-3 px-3 m-1"
                                onClick={() => this.openAndCloseModal('categories')}
                            >
                                <DeleteIcon className="cursor" />
                            </div>

                            <div className="px-5 pb-5">
                                <h4 className="text-center mt-2 mb-4">Изменить товар</h4>
                                <input
                                    value={product.name}
                                    onChange={(e) => this.onChangeProduct(e, 'name')}
                                    className={`form-control ${
                                        !isValidNameProduct(product?.name) ? 'border-danger' : ''
                                    }`}
                                    placeholder="Название товара"
                                />

                                <div className="d-flex flex-row-reverse">
                                    <p className="m-0">
                                        <small>
                                            {!!product.name ? `${product.name.length}` : '0'}/42
                                            символа
                                        </small>
                                    </p>
                                </div>

                                <div className="d-flex flex-row justify-content-between">
                                    <input
                                        value={product.price}
                                        onChange={(e) => this.onChangeProduct(e, 'price')}
                                        className={`form-control priceOfProductSize ${
                                            !isValidNumber(product?.price) ? 'border-danger' : ''
                                        }`}
                                        placeholder="Сумма товара"
                                    />
                                    <input
                                        value={product.discountPrice}
                                        onChange={(e) => this.onChangeProduct(e, 'discountPrice')}
                                        className={`form-control priceOfProductSize ${
                                            !isValidNumber(product?.discountPrice)
                                                ? 'border-danger'
                                                : ''
                                        }`}
                                        placeholder="Сумма со скидкой"
                                    />
                                </div>

                                {product.imagePath ? (
                                    <div className="fileInput">
                                        <img
                                            src={product.imagePath}
                                            alt={product.name}
                                            className="imagePreview"
                                        />
                                        <div
                                            className="fileBtnClose"
                                            onClick={() => this.deteleImage(product)}
                                        >
                                            <DeleteIcon />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="fileInput">
                                        <input
                                            type="file"
                                            onChange={(e) => this.onSelectFile(e)}
                                            className="form-control"
                                        />
                                    </div>
                                )}

                                <div className="d-flex justify-content-between">
                                    <button
                                        onClick={this.changeProductData}
                                        className="text-white bg-success form-control w-50"
                                    >
                                        Изменить
                                    </button>
                                    <button
                                        onClick={() => this.openAndCloseModal('categories')}
                                        className="text-white bg-success form-control w-50"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {display.newProduct && (
                    <div className="addNewCategory">
                        <div className="newCategoriesSize border rounded-3">
                            <div
                                className="d-flex flex-row-reverse pt-3 px-3 m-1"
                                onClick={() => this.openAndCloseModal('categories')}
                            >
                                <DeleteIcon className="cursor" />
                            </div>

                            <div className="px-5 pb-5">
                                <h4 className="text-center mt-2 mb-4">Добавить товар</h4>
                                <input
                                    value={product.name}
                                    onChange={(e) => this.onChangeProduct(e, 'name')}
                                    className={`form-control ${
                                        !isValidNameProduct(product?.name) ? 'border-danger' : ''
                                    }`}
                                    placeholder="Название товара"
                                />

                                <div className="d-flex flex-row-reverse">
                                    <p className="m-0">
                                        <small>
                                            {!!product.name ? `${product.name.length}` : '0'}/42
                                            символа
                                        </small>
                                    </p>
                                </div>

                                <div className="d-flex flex-row justify-content-between">
                                    <input
                                        value={product.price}
                                        onChange={(e) => this.onChangeProduct(e, 'price')}
                                        className={`form-control priceOfProductSize ${
                                            !isValidNumber(product?.price) ? 'border-danger' : ''
                                        }`}
                                        placeholder="Сумма товара"
                                    />
                                    <input
                                        value={product.discountPrice}
                                        onChange={(e) => this.onChangeProduct(e, 'discountPrice')}
                                        className={`form-control priceOfProductSize ${
                                            !isValidNumber(product?.discountPrice)
                                                ? 'border-danger'
                                                : ''
                                        }`}
                                        placeholder="Сумма со скидкой"
                                    />
                                </div>

                                {product.image ? (
                                    <div className="fileInput">
                                        <img
                                            src={product.image}
                                            alt={product.image.name || ''}
                                            className="imagePreview"
                                        />
                                        <div
                                            className="fileBtnClose"
                                            onClick={() => this.deteleImage(product)}
                                        >
                                            <DeleteIcon />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="fileInput">
                                        <input
                                            type="file"
                                            onChange={(e) => this.onSelectFile(e)}
                                            className="form-control"
                                        />
                                    </div>
                                )}

                                <div className="d-flex justify-content-between">
                                    <button
                                        onClick={this.addNewProduct}
                                        className="text-white bg-success form-control w-50"
                                    >
                                        Добавить
                                    </button>
                                    <button
                                        onClick={() => this.openAndCloseModal('categories')}
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

export default withRouter(ShoppingCategories);
