import React from 'react';
import home from '../../home.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import './mainBlock.css'

class MainBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHome: home[0],
      homes: home,
      selectedRoom: home[0].rooms[0],
    };
    this.onSelectHome = this.onSelectHome.bind(this);
    this.onSaveEditHome = this.onSaveEditHome.bind(this);
    this.onChangeHomeName = this.onChangeHomeName.bind(this);
    this.onSelectRoom = this.onSelectRoom.bind(this);
    this.onChangeRoomName = this.onChangeRoomName.bind(this);
    this.onSaveEditRoom = this.onSaveEditRoom.bind(this);
  }

  searchHome(id) {
    const mass = this.state.homes;
    let obj = {};
    mass.forEach((el) => {
      if (el._id === id) {
        obj = el;
      }
    })
    return obj;
  }

  onSelectHome(event) {
    let d = this.searchHome(event.target.value);
    d = JSON.parse(JSON.stringify(d));
    let c = d.rooms;
    this.setState({ selectedHome: d || {}, selectedRoom: c[0] });
  }

  searchRoom(id) {
   let mass = this.state.selectedHome; 
   let roomArr = [];
   let obj = {};
   for (let i = 0; i < 2; i++) {
    roomArr.push(mass.rooms[i]);
   }
   roomArr.forEach((el) => {
     if (el.id === id) {
       obj = el;
     }
   });
   return obj;
  }

  onSelectRoom(event) {
    let d = this.searchRoom(event.target.value);
    d = JSON.parse(JSON.stringify(d));
    this.setState({ selectedRoom: d });
  }

  onChangeHomeName(e) {
    let { selectedHome } = this.state;
    selectedHome = JSON.parse(JSON.stringify(selectedHome));
    selectedHome.homeName = e.target.value;
    this.setState({ selectedHome });
  }

  onChangeRoomName(e) {
    let { selectedRoom } = this.state;
    selectedRoom = JSON.parse(JSON.stringify(selectedRoom));
    selectedRoom.roomName = e.target.value;
    this.setState({ selectedRoom });
  }

  onSaveEditHome() {
    const id = this.state.selectedHome._id;
    const mass = this.state.homes;
    let name = this.state.selectedHome.homeName;
    name = name.trim();
    mass.forEach((el) => {
      if (el._id === id) {
        el.homeName = name;
      }
    })
    this.setState({ homes: mass });
  }

  onSaveEditRoom() {
    let mass = this.state.homes;
    const id = this.state.selectedHome._id;
    const selRoom = this.state.selectedRoom;
    const selHome = this.state.selectedHome;
    let name = this.state.selectedRoom.roomName;
    name = name.trim();
    for (let i = 0; i < selHome.rooms.length; i++) {
      if (selHome.rooms[i].id === selRoom.id) {
        selHome.rooms[i].roomName = name;
      }
    }

    let ar = [];
    mass.forEach((el) => {
      if (el._id === id) {
        return ar.push(selHome);
      }
      ar.push(el);
    })
    
    this.setState({ homes: ar });
  }

  render () {
    const { selectedHome, selectedRoom } = this.state;
    const text = selectedHome.homeName || '';
    const textRoom = selectedRoom.roomName || '';
    const danger = text.length < 1 ? 'border-danger' : '';
    const disabled = text.length < 1 ? 'disabled' : '';
    const dangerRoom = textRoom.length < 1 ? 'border-danger' : '';
    const disabledRoom = textRoom.length < 1 ? 'disabled' : '';
    return (
      <div className='MainBlockFormContainer bg-light'>
        <div className='innerMainBlockBlock border rounded-3'>
          <div className='pb-2 border-bottom'>
            <h3 className='h3Size'>Home</h3>
            <select
              onChange={this.onSelectHome}
              className="form-select mb-3 w-50 text-center"
            >
              {this.state.homes.map(item => (
                <option value={item._id} key={item._id}>
                  {item.homeName}
                </option>
              ))}
            </select>
            <h3 className='h3Size'>Edit home</h3>
            <div className='input-group mb-3 w-100'>
              <input
                value={text}
                onChange={this.onChangeHomeName}
                className={`form-control ${danger}`}
                placeholder="HouseNames"
              />
              <div className="input-group-append">
                <button
                  onClick={this.onSaveEditHome}
                  className={`btn btn-outline-secondary bg-success text-white ${disabled}`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className='mt-4 h3Size'>Room</h3>
            <select
              onChange={this.onSelectRoom}
              className="form-select mb-3 w-50 text-center"
            >
              {selectedHome.rooms.map(item => (
                <option value={item.id} key={item.id}>
                  {item.roomName}
                </option>
              ))}
            </select>
            <h3 className='h3Size'>Edit room</h3>
            <div className='input-group mb-3 w-100'>
              <input
                value={textRoom}
                onChange={this.onChangeRoomName}
                className={`form-control ${dangerRoom}`}
                placeholder="HouseNames"
              />
              <div className="input-group-append">
                <button
                  onClick={this.onSaveEditRoom}
                  className={`btn btn-outline-secondary bg-success text-white ${disabledRoom}`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MainBlock);