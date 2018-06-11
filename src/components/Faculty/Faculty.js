import React, { Component, Fragment } from "react";
import "./Faculty.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import FacultyHome from './FacultyHome/FacultyHome';
import FacultySelection from './FacultySelection/FacultySelection';
class Faculty extends Component {
	state = {
		activeTab: 0,
		data: 0,
		redirect:false
	};
	unmounted = false;
	constructor(props) {
		super(props);
		this.token = JSON.parse(localStorage.getItem("auth")).token;
		axios.interceptors.response.use(response => {
			response.data.error==="auth error" && !this.unmounted && this.setState({
				redirect: true
			});
			return response;
		})
	}
	handleChange = (event, value) => {
		!this.unmounted && this.setState({ activeTab: value });
	};
	componentWillMount() {
		axios.post('api/faculty', {
			token: this.token
		}).then((data) => {
			!this.unmounted && this.setState({
				data: data.data[0]
			});
		});
	}
	componentWillUnmount() {
		this.unmounted = true;
	}
	render() {
		let { activeTab } = this.state;
		let component = this.state.data ? <Fragment>
				<div className="header" style={{
					textTransform:"capitalize"
				}}>
					Welcome{" "}{this.state.data.fac_name.toLowerCase()}
				</div>
				<div className="paper-field">
					<AppBar position="static">
						<Tabs value={activeTab} onChange={this.handleChange}>
							<Tab label="Home" />
							<Tab label="Slot Selection" />
						</Tabs>
					</AppBar>
					{activeTab === 0 && <div className="tab-faculty">
					<FacultyHome data = {this.state.data} token={this.token}/>
					</div>}
					{activeTab === 1 && <div className="tab-faculty">
						<FacultySelection token={this.token} />
					</div>}
				</div>
		</Fragment> : <center>Loading Faculty Data...</center>;
		return <div className="faculty-component">
				{this.state.redirect && <Redirect to = "/"/>}
				{component}
			</div>;
	}
}
export default Faculty;
