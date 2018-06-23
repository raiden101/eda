import React, { Component, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import PasswordField from "material-ui-password-field";
import "./EditUser.css";
import axios from "axios";
class EditUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			faculty_email: props.data.email,
			faculty_contact: props.data.contact_no,
			faculty_password: "",
			saving: false,
			snack: false,
			msg: ""
		};
	}
	unmounted = false;
	componentWillUnmount() {
		this.unmounted = true;
	}
	changeState = type => ({ target: { value } }) => {
		!this.unmounted && this.setState({ [type]: value });
	};
	handleClose = name => () => {
		!this.unmounted && this.setState({ [name]: false });
	};
	save = () => {
		!this.unmounted && this.setState({ saving: true });
		axios
			.post("faculty/update_info", {
				token: this.props.token,
				fac_data: {
					fac_name: this.props.data.fac_name,
					email: this.state.faculty_email,
					contact_no: this.state.faculty_contact,
					password: this.state.faculty_password
				}
			})
			.then(data => {
				!this.unmounted &&
					this.setState({
						saving: false,
						snack: true,
						msg: data.data.error || data.data.data
					});
			});
	};
	render() {
		return (
			<Fragment>
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					open={this.state.snack}
					autoHideDuration={3000}
					onClose={this.handleClose("snack")}
					message={<span>{this.state.msg || "Error!"}</span>}
				/>
				<div className="edit-user">
					<li>
						If you dont want to change the info just leave the field
						empty.
					</li>
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
							label="Contact"
							value={this.state.faculty_contact}
							onChange={this.changeState("faculty_contact")}
							fullWidth
						/>
					</div>
					<div className="input-space">
						<PasswordField
							placeholder="new password"
							label="new password"
							value={this.state.faculty_password}
							onChange={this.changeState("faculty_password")}
							fullWidth
						/>
					</div>
					<Button
						color="primary"
						variant="raised"
						onClick={this.save}
						className="new-item save"
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
			</Fragment>
		);
	}
}

export default EditUser;
