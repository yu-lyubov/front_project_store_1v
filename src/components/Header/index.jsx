import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './header.css';
import { Link, withRouter } from 'react-router-dom';
import sendToServer from '../sendToServer.js';
import { isAdmin } from '../../helpers/m';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: JSON.parse(localStorage.getItem('userInfo')) || '',
    }
    this.onLogOut = this.onLogOut.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('userInfo');
    if (token && !user) {
      this.getUserFromServer();
    }
      
  }
    
  getUserFromServer() {
    sendToServer('me', 'GET', true)
    .then((value) => {
      localStorage.setItem('userInfo', JSON.stringify(value));
    })
  }

  onLogOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    return this.props.history.push("/login");
  }

  render () {      
    const { userInfo } = this.state;
    return (
      <div className='d-flex justify-content-center border'>
        <div className='innerHeadersBlock'>
          <div className="py-2 dataBlock">
            
              <div className='d-flex flex-row justify-content-between align-items-center flWidth'>
                <Link to='/category' className='link-dark linkBtn'>Shop</Link>
                <Link to='/editUsers' className='link-dark linkBtn'>User profile</Link>
                {isAdmin(userInfo) && (
                <>
                  <Link to='/homes' className='link-dark linkBtn'>Edit houses</Link>
                  <Link to='/users' className='link-dark linkBtn'>Users</Link>
                </>
                )}

              </div>

              
            <div className='d-flex flex-row justify-content-between align-items-center flWidth2'>
              <p className='mb-0 linkBtn'>{userInfo ? userInfo.name : ''}</p>
              <button
                onClick={this.onLogOut}
                className={`form-control-sm border btn-light btnSize`}
              >
                Log off
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Header);