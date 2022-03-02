import React from 'react';
import { withRouter } from 'react-router-dom';
import { ReactComponent as ShopbagIcon } from '../../assets/icons/handbag.svg';
import './startShop.css';

class StartPageShop extends React.Component {
    render() {
        return (
            <div className="startShopFormContainer bg-light">
                <div className="startShopBlock bg-light">
                    <ShopbagIcon className="sizeBag" />
                    <h1>Выберите категорию</h1>
                </div>
            </div>
        );
    }
}

export default withRouter(StartPageShop);
