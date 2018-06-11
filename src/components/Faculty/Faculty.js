import React, { Component, Fragment } from "react";
import "./Faculty.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios from 'axios';
import FacultyHome from './FacultyHome/FacultyHome';
import FacultySelection from './FacultySelection/FacultySelection';
class Faculty extends Component {
	state = {
		activeTab: 0,
		data: 0
	};
	constructor(props) {
		super(props);
		this.token = JSON.parse(localStorage.getItem("auth")).token;
	}
	handleChange = (event, value) => {
		this.setState({
			activeTab: value
		});
	};
	componentWillMount() {
		axios.post('api/faculty', {
			token: this.token
		}).then((data) => {
			// console.log(data.data);
			this.setState({
				data: data.data[0]
			});
		});
	}
	render() {
		let { activeTab } = this.state;
		let component = this.state.data ? <Fragment>
				<div className="header">
					<h4 style={ { margin: "6px 0px", textTransform: "capitalize" } }
					>Welcome { this.state.data.fac_name.toLowerCase() }</h4>
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
				{component}
			</div>;
	}
}
export default Faculty;
