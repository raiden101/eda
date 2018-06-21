import React, { Component, Fragment } from "react";
import checkAuth from "../../checkAuth";
import { Redirect } from "react-router-dom";
import AdminComponent from "./AdminComponent/AdminComponent";
import axios from "axios";

class Admin extends Component {
	state = {
		redirect: 2
	};
	constructor(props) {
		super(props);
		this.unmounted = false;
		axios.interceptors.response.use(response => {
			if (response.data.error === "auth error") {
				!this.unmounted &&
					this.setState({
						redirect: 1
					});
			}
			return response;
		});
	}
	componentWillUnmount() {
		this.unmounted = true;
	}
	componentDidMount() {
		checkAuth().then(data => {
			if (data.admin !== 1)
				this.setState({
					...this.state,
					redirect: 1
				});
			else
				this.setState({
					...this.state,
					redirect: 0
				});
		});
	}
	render() {
		let renderItem = null;
		if (this.state.redirect === 2) renderItem = <div className = "loading">Loading...</div>;
		else if (this.state.redirect === 1) renderItem = <Redirect to="/" />;
		let realComponent = <AdminComponent />;
		return (
			<Fragment>
				{renderItem}
				{!this.state.redirect && realComponent}
			</Fragment>
		);
	}
}
export default Admin;
