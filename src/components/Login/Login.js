import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import './Login.css';
import setAuth from '../../setAuth';
class Login extends Component {
    state = {
        username: '',
        password: '',
        errors: false,
        usernameError: false,
        errorDetail: [],
        submitting:false
    };
    submit = () => {
        this.setState({
            ...this.state,
            submitting: true
        });
        setTimeout(() => {
            this.setState({
                ...this.state,
                submitting: false
            })
        },2000)
        if (false/*!this.state.errors*/) {
            this.setState({
                ...this.state,
                submitting: true
            });
            axios.post('http://localhost:5000/api/auth/login', {
                username: this.state.username,
                password:this.state.password
            }).then((data) => {
                if (data.error.length > 0) {
                    console.log("errors present")
                }
                else {
                    setAuth({
                        token: data.token
                    })
                }
                // this.setState({
                //     ...this.state,
                //     submitting:false
                // })
            })
        }
    }
    handleChange = (type) => {
        return (event) => {
            this.setState({
                    ...this.state,
                    [type]: event.target.value,
                    errorDetail: [],
                    usernameError:false,
                    errors:false
                }
            );
            if (type === 'username') {
                if (/[$-/:-?{-~!"^_`\\#@[\]]/g.test(event.target.value)) {
                    this.setState({
                        ...this.state,
                        [type]: event.target.value,
                        errors: true,
                        usernameError: true,
                        errorDetail: ['username is invalid']
                    })
                }
            }
        }
    }
    render() {
        let errorList = this.state.errorDetail.map((element, index) => {
            return <li className="error-item" key={"error" + index}>
                {element}
            </li>
        });
        let errors = this.state.errors ?
            <div className="errors">
                {errorList}
            </div> : null;
        return (
            <div className="login">
                <h3>Login</h3>
                <form onSubmit={(e)=>{e.preventDefault()}}>
                    <div className = "input-field">
                        <TextField
                            value={this.state.username}
                            onChange={this.handleChange('username')}
                            label="userId"
                            fullWidth
                            error={this.state.usernameError}
                        />
                    </div>

                    <div className="input-field">
                        <TextField
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                            label="password"
                            type="password"
                            fullWidth
                            error={this.state.passwordError}
                        />
                    </div>
                    {errors}
                    <div className="input-field t-r-padd">
                        <Button
                            variant="raised"
                            color="primary"
                            onClick={this.submit}
                            disabled={this.state.submitting}>
                            {this.state.submitting?"submitting":"submit"}
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
}
export default Login;