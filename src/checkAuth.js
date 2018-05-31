import axios from 'axios';
import safe from './safe';
export default () => {
    return new Promise(function (resolve, reject) {
        let auth = localStorage.getItem("auth");
        let { token } = safe(auth) && JSON.parse(auth);
        auth ? axios.post('http://localhost:5000/api/isAuth', {
            token: token
        }).then((data) => resolve({
            status: data.data,
            admin: data.admin
        })) : resolve({
                status: 0,
                admin: 0
        });
    })
}