import React, { Component, Fragment } from "react";
import checkAuth from "../../checkAuth";
import { Redirect } from "react-router-dom";

class Default extends Component {
	state = {
		status: 2
	};
	refetch = () => {
		checkAuth()
			.then(data => {
				this.setState({
					...this.state,
					...data
				});
			})
			.catch(err => console.log);
	};
	componentDidMount() {
		this.refetch();
	}
	render() {
		let renderItem = <div className="loading">Loading...</div>;
		if (!this.state.status) {
			renderItem = <Redirect to="/login" />;
		} else if (this.state.status === 1) {
			if (this.state.admin === 1) {
				renderItem = <Redirect to="/admin" />;
			} else renderItem = <Redirect to="/faculty" />;
		}
		return <Fragment>{renderItem}</Fragment>;
	}
}
export default Default;
