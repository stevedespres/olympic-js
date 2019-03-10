import axios from 'axios';
const headers = {
  'Content-Type': 'application/json'
}
const burl = "http://localhost:8080"

export default {
  login: function (send) {
    return axios.post(burl + '/user/login', send, { headers: headers })
  },
  signup: function (send) {
    return axios.post(burl + '/user/signup', send, { headers: headers })
  },
  isAuth: function () {
    return (localStorage.getItem('token') !== null);
  },
  logout: function () {
    localStorage.clear();
  },
  createGame: function (send) {
    return axios.post(burl + '/game/create', send, { headers: headers })
  },
  checkGame: function (send) {
    return axios.post(burl + '/game/check', send, { headers: headers })
  },
  joingame: function (send) {
    return axios.post(burl + '/game/join', send, { headers: headers })
  },
  getStats: function (send) {
    return axios.post(burl + '/user/stats', send, { headers: headers })
  }
}
