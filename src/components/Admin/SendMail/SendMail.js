import React, { Component, Fragment } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import "./SendMail.css";
import RenderTable from "../../RenderTable/RenderTable";
import { Button, Snackbar } from "@material-ui/core";
import Modal from "../../Modal/Modal";
class SendMail extends Component {
	state = {
		sendPending: true,
		sendToNonPending: true,
		pending: [],
		nonpending: [],
		loading: false,
		mail:
			"<h3>Dear prof. {username}</h3>\n" +
			"<p>We have processed your request for the exam duty and \n" +
			"following are your selections.For further query or for \n" +
			"any kind of changes, contact ...</p>\n",
		sending: false,
		sent: false,
		status: ""
	};
	unmounted = false;
	tableHeads = ["name", "id", "email"];
	check = ({ target: { name } }) => {
		!this.unmounted &&
			this.setState(prevState => ({ [name]: !prevState[name] }));
	};
	componentDidMount() {
		!this.unmounted && this.setState({ loading: true });
		axios
			.post("/admin/get_all_faculties", {
				token: this.props.token,
				pending: "true",
				fields: ["fac_name", "fac_id", "email"]
			})
			.then(data => {
				let pending = [];
				let nonpending = [];
				data.data.data.forEach(e => {
					if (e.pending === true) pending.push(e);
					else nonpending.push(e);
				});
				!this.unmounted &&
					this.setState({
						pending: pending,
						nonpending: nonpending,
						loading: false
					});
			});
	}
	componentWillUnmount() {
		this.unmounted = true;
	}
	translateSlotData(obj) {
		return [obj.fac_name, obj.fac_id, obj.email];
	}
	changeMailBody = ({ target: { value } }) => {
		!this.unmounted && this.setState({ mail: value });
	};
	sendMail = () => {
		!this.unmounted && this.setState({ sending: true });
		let users = [];
		this.state.sendToNonPending && users.push(...this.state.nonpending);
		this.state.sendPending && users.push(...this.state.pending);
		axios
			.post("admin/send_mails", {
				token: this.props.token,
				faculties: users,
				mail: this.state.mail
			})
			.then(data => {
				if (data.data.data.rejected_mails.length > 0) {
					!this.unmounted && this.setState({
							sent: true,
							status:
								data.data.data
									.rejected_mails.length +
								" mails were'nt sent"
						});
				} else {
					!this.unmounted && this.setState({
							sent: true,
							status:
								"The mails were sent successfully"
						});
				}
			});
	};
	handleClose = (name) => () => {
		!this.unmounted && this.setState({ [name]: false });
	};
	render() {
		let mailBody = (
			<textarea
				className="mail-text"
				onChange={this.changeMailBody}
				value={this.state.mail}
				autoCorrect={"false"}
			/>
		);
		let users = [];
		this.state.sendToNonPending && users.push(...this.state.nonpending);
		this.state.sendPending && users.push(...this.state.pending);
		return (
			<Fragment>
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					open={this.state.sending}
					autoHideDuration={3000}
					onClose={this.handleClose('sending')}
					message={<span>Sending...</span>}
				/>
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					open={!this.state.sending && this.state.sent}
					autoHideDuration={3000}
					onClose={this.handleClose('sent')}
					message={<span>{this.state.status}</span>}
				/>
				<div className="controls">
					<div>
						<div className="checkbox-area">
							<Checkbox
								checked={this.state.sendPending}
								inputProps={{ name: "sendPending" }}
								onChange={this.check}
							/>
							Send to Pending
						</div>
						<div className="checkbox-area">
							<Checkbox
								checked={this.state.sendToNonPending}
								inputProps={{ name: "sendToNonPending" }}
								onChange={this.check}
							/>
							Send to Non Pending
						</div>
						<div className="checkbox-area">
							<Modal
								trigger={
									<Button
										onClick={this.showEdit}
										className="button-with-icon"
										color="primary"
										variant="raised"
									>
										Edit Mail<i className="fa fa-edit" />
									</Button>
								}
								title={"Edit Mail Body"}
								content={mailBody}
							/>
						</div>
						<div className="checkbox-area">
							<Button
								className="button-with-icon"
								color="secondary"
								variant="raised"
								onClick={this.sendMail}
								disabled={this.state.loading || !users.length}
							>
								Send<i className="fa fa-paper-plane" />
							</Button>
						</div>
					</div>
				</div>
				{users.length > 0 ? (
					<RenderTable
						heads={this.tableHeads}
						data={users}
						translate={this.translateSlotData}
						title={"Send Mail"}
						paginationEnabled={true}
					/>
				) : (
					<div className="loading">
						{this.state.loading ? "Loading..." : "No users"}
					</div>
				)}
			</Fragment>
		);
	}
}
export default SendMail;
