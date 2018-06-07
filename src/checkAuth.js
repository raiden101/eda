import axios from 'axios';
import safe from './safe';
export default () => {
    return new Promise(function (resolve, reject) {
        let auth = localStorage.getItem("auth");
        let { token } = safe(auth) && JSON.parse(auth);
        safe(auth) ? axios.post('/api/auth/isAuth', {
            token: token
        }).then((data) => resolve({
            ...data.data
        })) : resolve({
                status: 0,
                admin: 0
        });
    })
}