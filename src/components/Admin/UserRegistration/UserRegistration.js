import React, { Component, Fragment } from "react";
import axios from "axios";
import "./UserRegistration.css";
import TextField from "@material-ui/core/TextField";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import UploadForm from '../../UploadForm/UploadForm';
class UserRegistration extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.token = props.token;
		this.state = {
			faculty_name: "",
			faculty_id: "",
			faculty_designation: 0,
			faculty_branch: 0,
			faculty_email: "",
			faculty_contact: "",
			saving: false,
			failureSnack: false,
			failureMessage: "",
			successSnack: false
		};
	}
	validate = () => {
		const {
			faculty_name: name,
			faculty_id: id,
			faculty_designation: des,
			faculty_branch: branch,
			faculty_email: email,
			faculty_contact: contact
		} = this.state;
		return (
			name === "" ||
			id === "" ||
			des === 0 ||
			branch === 0 ||
			email === "" ||
			contact === ""
		);
	};
	save = () => {
		this.setState({
			saving: true
		});
		if (this.validate())
			this.setState({
				saving: false,
				failureSnack: true,
				failureMessage: "Please Fill all the Fields"
			});
		else {
			const {
				faculty_name,
				faculty_id,
				faculty_designation,
				faculty_branch,
				faculty_email,
				faculty_contact
			} = this.state;
			let faculty_data = {
				fac_name: faculty_name,
				branch: faculty_branch,
				contact_no: faculty_contact,
				password: 1111,
				fac_des: faculty_designation,
				email: faculty_email,
				fac_id: faculty_id + ""
			};
			axios
				.post("/admin/new_faculty", {
					token: this.token,
					faculty_data: faculty_data
				})
				.then(data => {
					if (data.data.error) {
						this.setState({
							saving: false,
							failureSnack: true,
							failureMessage: data.data.error
						});
					} else {
						this.setState({
							saving: false,
							failureSnack: false,
							successSnack: true,
							faculty_name: "",
							faculty_id: "",
							faculty_designation: 0,
							faculty_branch: 0,
							faculty_email: "",
							faculty_contact: ""
						});
					}
				});
		}
	};
	changeState = type => ({ target: { value } }) => {
		this.setState({
			[type]: value
		});
	};
	changeDropdownState = ({ target: { name, value } }) => {
		this.setState({
			[name]: value
		});
	};
	handleClose = name => () => {
		this.setState({
			[name]: false
		});
	};
	render() {
		return (
			<Fragment>
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					open={this.state.failureSnack}
					autoHideDuration={3000}
					onClose={this.handleClose("failureSnack")}
					message={<span>{this.state.failureMessage}</span>}
				/>
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					open={!this.state.failureSnack && this.state.successSnack}
					autoHideDuration={3000}
					onClose={this.handleClose("successSnack")}
					message={
						<span>User added to the database successfully</span>
					}
				/>
				<div className="register-users">
					<div className="header">Register Users</div>
					<div className="input-space ihalf">
						<TextField
							type="text"
							value={this.state.faculty_name}
							label="Name"
							onChange={this.changeState("faculty_name")}
							fullWidth
						/>
					</div>
					<div className="input-space ihalf">
						<TextField
							type="number"
							label="Id"
							value={this.state.faculty_id}
							onChange={this.changeState("faculty_id")}
							fullWidth
						/>
					</div>
					<div className="input-space ihalf">
						<FormControl fullWidth>
							<InputLabel>Designation</InputLabel>
							<Select
								value={this.state.faculty_designation}
								onChange={this.changeDropdownState}
								inputProps={{ name: "faculty_designation" }}
							>
								<MenuItem value={0}>
									<i>Select Designation</i>
								</MenuItem>
								<MenuItem value={1}>Asst. Prof Gd I</MenuItem>
								<MenuItem value={2}>Asst. Prof Gd II</MenuItem>
								<MenuItem value={3}>Asst. Prof Gd III</MenuItem>
								<MenuItem value={4}>Asso. Prof.</MenuItem>
							</Select>
						</FormControl>
					</div>
					<div className="input-space ihalf">
						<FormControl fullWidth>
							<InputLabel>Branch</InputLabel>
							<Select
								value={this.state.faculty_branch}
								onChange={this.changeDropdownState}
								inputProps={{ name: "faculty_branch" }}
							>
								<MenuItem value={0}>
									<i>Select Branch</i>
								</MenuItem>
								<MenuItem value={"BTE"}>
									Bio Technology
								</MenuItem>
								<MenuItem value={"Civil Engg"}>Civil</MenuItem>
								<MenuItem value={"CSE"}>
									Computer Science
								</MenuItem>
								<MenuItem value={"ECE"}>
									Electronics & Communication
								</MenuItem>
								<MenuItem value={"EEE"}>
									Electricals & Electronics
								</MenuItem>
								<MenuItem value={"ISE"}>
									Information Science
								</MenuItem>
								<MenuItem value={"Mechanical Engg."}>
									Mechanical
								</MenuItem>
								<MenuItem value={"MCA"}>MCA</MenuItem>
								<MenuItem value={"Physics"}>Physics</MenuItem>
								<MenuItem value={"Chemistry"}>
									Chemistry
								</MenuItem>
								<MenuItem value={"Mathematics"}>
									Mathematics
								</MenuItem>
								<MenuItem value={"Humanities"}>
									Humanities
								</MenuItem>
							</Select>
						</FormControl>
					</div>
					<div className="input-space">
						<TextField
							type="email"
							label="email"
							value={this.state.faculty_email}
							onChange={this.changeState("faculty_email")}
							fullWidth
						/>
					</div>
					<div className="input-space">
						<TextField
							type="number"
							label="Contact No."
							value={this.state.faculty_contact}
							onChange={this.changeState("faculty_contact")}
							fullWidth
						/>
					</div>
					<div className="input-space">
						<Button
							color="primary"
							className="new-item save"
							variant="raised"
							onClick={this.save}
							disabled={this.state.saving}
						>
							{this.state.saving ? (
								"Saving"
							) : (
								<Fragment>
									Save <i className="fa fa-save" />
								</Fragment>
							)}
						</Button>
					</div>
				</div>
				<UploadForm
					actionRoute="admin/upload_faculties"
					filename="file_input"
					token={this.props.token}/>
			</Fragment>
		);
	}
}

export default UserRegistration;
