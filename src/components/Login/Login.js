import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import "./Login.css";
import setAuth from "../../setAuth";
class Login extends Component {
	state = {
		username: "",
		password: "",
		errors: false,
		usernameError: false,
		errorDetail: [],
		submitting: false,
		admin: 0
	};
	renderItem = null;
	changeAdmin = val => {
		this.setState({
			...this.state,
			admin: val
		});
	};
	submit = () => {
		this.setState({
			...this.state,
			submitting: true
		});
		axios
			.post("/auth/login", {
				user_data: {
					username: this.state.username,
					password: this.state.password,
					admin: this.state.admin
				}
			})
			.then(data => {
				data = data.data;
				if (data.error.length > 0) {
					this.setState({
						errors: true,
						errorDetail: data.error
					});
				} else {
					setAuth({
						token: data.data
					});
					this.renderItem = <Redirect to="/" />;
				}
				this.setState({
					...this.state,
					submitting: false
				});
			});
	};
	handleChange = type => {
		return event => {
			this.setState({
				...this.state,
				[type]: event.target.value,
				errorDetail: [],
				usernameError: false,
				errors: false
			});
			if (type === "username") {
				if (/[$-/:-?{-~!"^_`\\#@[\]]/g.test(event.target.value)) {
					this.setState({
						...this.state,
						[type]: event.target.value,
						errors: true,
						usernameError: true,
						errorDetail: ["username is invalid"]
					});
				}
			}
		};
	};
	render() {
		let errorList = this.state.errorDetail.map((element, index) => {
			return (
				<li className="error-item" key={"error" + index}>
					{element}
				</li>
			);
		});
		let errors = this.state.errors ? (
			<div className="errors">{errorList}</div>
		) : null;
		return (
			<Fragment>
				{this.renderItem}
				<div className="login">
					<div className="tabs">
						<div
							className={
								"tab" + (!this.state.admin ? " active" : "")
							}
							onClick={() => this.changeAdmin(0)}
						>
							User
						</div>
						<div
							className={
								"tab" + (this.state.admin ? " active" : "")
							}
							onClick={() => this.changeAdmin(1)}
						>
							Admin
						</div>
					</div>
					<form
						onSubmit={e => {
							e.preventDefault();
						}}
					>
						<div className="input-field">
							<TextField
								value={this.state.username}
								onChange={this.handleChange("username")}
								label="userId"
								fullWidth
								error={this.state.usernameError}
							/>
						</div>

						<div className="input-field">
							<TextField
								value={this.state.password}
								onChange={this.handleChange("password")}
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
								disabled={this.state.submitting}
							>
								{this.state.submitting
									? "submitting"
									: "submit"}
							</Button>
						</div>
					</form>
				</div>
			</Fragment>
		);
	}
}
export default Login;
