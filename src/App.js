import React, { Component, Fragment } from "react";
import Login from "./components/Login/Login";
import Default from "./components/Default/Default";
import Admin from "./components/Admin/Admin";
import Faculty from "./components/Faculty/Faculty";
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import TopBar from "./components/TopBar/TopBar";
import axios from "axios";
class App extends Component {
	constructor(props) {
		super(props);
		axios.defaults.baseURL = "/api";
	}
	render() {
		return (
			<div className="App">
				<BrowserRouter>
					<Fragment>
						<Route path="/" component={Default} exact />
						<Route path="/login" component={Login} exact />
						<Route
							path="/admin"
							component={() => {
								return (
									<Fragment>
										<TopBar />
										<Admin />
									</Fragment>
								);
							}}
							exact
						/>
						<Route
							path="/faculty"
							component={() => {
								return (
									<Fragment>
										<TopBar />
										<Faculty />
									</Fragment>
								);
							}}
							exact
						/>
					</Fragment>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
