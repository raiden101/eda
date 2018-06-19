import React, { Component, Fragment } from "react";
import "./Login.css";
import LoginForm from "./LoginForm/LoginForm";
import { Route, Switch } from "react-router-dom";
class Login extends Component {
	componentDidMount() {
		localStorage.setItem("auth", "");
	}

	render() {
		return (
			<Fragment>
				<div className="login">
					<Switch>
						<Route path={this.props.match.url} exact>
							<LoginForm type="user" />
						</Route>
						<Route path={this.props.match.url + "/admin"}>
							<LoginForm type="admin" />
						</Route>
					</Switch>
				</div>
			</Fragment>
		);
	}
}
export default Login;
