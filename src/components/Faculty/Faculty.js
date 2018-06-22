import React, { Component, Fragment } from "react";
import "./Faculty.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import FacultyHome from './FacultyHome/FacultyHome';
import FacultySelection from './FacultySelection/FacultySelection';
import EditUser from './EditUser/EditUser';
class Faculty extends Component {
	state = {
		activeTab: 0,
		data: 0,
		redirect: false
	};
	unmounted = false;
	constructor(props) {
		super(props);
		let local = localStorage.getItem("auth")
		this.token = local? JSON.parse(local).token:0;
		axios.interceptors.response.use(response => {
			response.data.error === "auth error" &&
				!this.unmounted &&
				this.setState({
					redirect: true
				});
			return response;
		});
		axios.defaults.baseURL = "api";
	}
	handleChange = (event, value) => {
		!this.unmounted && this.setState({ activeTab: value });
	};
	componentDidMount() {
		axios
			.post("/faculty", {
				token: this.token
			})
			.then(data => {
				!this.unmounted &&
					this.setState({
						data: data.data[0]
					});
			});
	}
	componentWillUnmount() {
		this.unmounted = true;
	}
	setData = (data) => {
		!this.unmounted && this.setState({
			data: data
		});
	}
	render() {
		let { activeTab } = this.state;
		let component = this.state.data ? <Fragment>
				<div className="header" style={{ textTransform: "capitalize" }}>
					Welcome {this.state.data.fac_name.toLowerCase()}
				</div>
				<div className="paper-field">
					<AppBar position="static">
						<Tabs value={activeTab} onChange={this.handleChange}>
							<Tab label="Home" />
							<Tab label="Slot Selection" />
							<Tab label="Change info" />
						</Tabs>
					</AppBar>
					{activeTab === 0 && <div className="tab-faculty">
							<FacultyHome token={this.token} setData={this.setData} />
						</div>}
					{activeTab === 1 && <div className="tab-faculty">
							<FacultySelection token={this.token} data={this.state.data} />
						</div>}
					{activeTab === 2 && <div className="tab-faculty">
							<EditUser token={this.token} data={this.state.data} />
						</div>}
				</div>
			</Fragment> : <center>Loading Faculty Data...</center>;
		return (
			<div className="faculty-component">
				{this.state.redirect && <Redirect to="/" />}
				{component}
			</div>
		);
	}
}
export default Faculty;
