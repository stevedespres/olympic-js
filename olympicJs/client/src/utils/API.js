import axios from 'axios';
const headers = {
    'Content-Type': 'application/json'
}
const burl = "http://localhost:8080"

export default {
    login : function(login,password) {
        return axios.post(burl + '/user/login',{
            'login' : login,
            'password' : password
        },{
            headers: headers
        })
    },
    signup : function(send){
        return axios.post(burl + '/user/signup',send,{headers: headers})
    },

    isAuth : function() {
        return (localStorage.getItem('token') !== null);
    },
    logout : function() {
        localStorage.clear();
    }
}