import React from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './startShop.css';
import {ReactComponent as ShopbagIcon} from '../../assets/icons/handbag.svg';

class StartPageShop extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render () {
    return (
      <div className='startShopFormContainer bg-light'>
        <div className='startShopBlock bg-light'>
          <ShopbagIcon className='sizeBag'/>
          <h1>Выберите категорию</h1>
        </div>
      </div>
    )
  }
}

export default withRouter(StartPageShop);