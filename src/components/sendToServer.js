// const API_URL = `http://127.0.0.1:4000/api/`;
const API_URL = `/api/`;

export const sendToServer = (url, method, getToken, state) => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');

    let obj = {
      method: method,
      headers: {}
    };

    if (getToken) {
      obj.headers.Authorization = token;
    }

    if (state instanceof FormData) {
      obj.body = state;
    } else if (state) {
      obj.body = JSON.stringify(state);
      obj.headers['Content-Type'] = 'application/json; charset=utf-8'
    }

    fetch(API_URL + url, obj)
    .then((res) => {
      if (res.status === 200 || res.status === 201) {
        res = res.json();
        return resolve(res);
      }
      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
      }
      throw res;
    })
    .catch((err) => {
      err.text().then((errorMessage) => {
        const messageObject = JSON.parse(errorMessage);
        reject(messageObject.message || '');
      });
    })       
  })
};

export default sendToServer;
