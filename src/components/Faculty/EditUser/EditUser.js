import React, { Component, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "./EditUser.css";
class EditUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			faculty_email: props.mail,
			faculty_contact: props.contact,
			faculty_password: "",
			saving: false
		};
	}
	changeState = type => ({ target: { value } }) => {
		this.setState({
			[type]: value
		});
	};
	render() {
		return (
			<Fragment>
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
						<TextField
							type="password"
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
