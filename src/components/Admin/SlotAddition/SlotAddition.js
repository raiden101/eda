import React, { Component, Fragment } from "react";
import "./SlotAddition.css";
import TextField from "@material-ui/core/TextField";
import RenderTableSelectable from "../../RenderTable/RenderTableSelectable";

import Modal from "../../Modal/Modal";
import Panel from "../../Panel/Panel";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import UploadForm from "../../UploadForm/UploadForm";
import axios from "axios";
class SlotAddition extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.tableHeads = ["Date", "Session", "Total slots"];
		let date = new Date(
			new Date().getFullYear(),
			new Date().getMonth() + 1,
			new Date().getDate()
		);
		this.UTCEnabled = false;
		if (this.UTCEnabled) {
			date.setUTCHours(0);
			date.setUTCMinutes(0);
			date.setUTCSeconds(0);
			date.setUTCMilliseconds(0);
		}
		this.state = {
			incrementer: 1,
			saving: false,
			slots: [],
			snack: false,
			successRate: 0,
			rejected: false,
			tempSlotData: {
				slot_id: 1,
				date: date.toISOString(),
				session: "morning",
				total_slot: 1
			},
			validated: true
		};
	}
	translateSlotData = obj => {
		console.log(this.dashSeperatedDateString(obj.date));
		let date = new Date(obj.date);
		let dateString =
			date.getDate() +
			"/" +
			(date.getMonth() + 1) +
			"/" +
			date.getFullYear();
		return [dateString, obj.session, obj.total_slot];
	};

	removeElements = elements => {
		let slots = [...this.state.slots];
		elements.forEach(element => {
			let elIndex = -1;
			slots.forEach((slot, i) => {
				if (slot.slot_id === element) {
					elIndex = i;
					console.log("index", i);
					return;
				}
			});
			slots.splice(elIndex, 1);
		});
		this.setState({
			slots: slots
		});
	};

	findById = id => {
		let actualDuration = this.state.slots;
		let elIndex = -1;
		actualDuration.forEach((e, i) => {
			if (e.slot_id === id) {
				elIndex = i;
				return;
			}
		});
		return actualDuration[elIndex];
	};

	selectedAction = elements => {
		return (
			<Modal
				trigger={
					<IconButton>
						<i
							className="fa fa-trash"
							style={{ fontSize: "19px" }}
						/>
					</IconButton>
				}
				title={"Delete Slots"}
				content={
					<Fragment>
						Are you sure you want to delete these Slots ?
						<Panel
							title="See details"
							content={
								<Fragment>
									{elements.map((element, index) => {
										let date =
											this.findById(element) &&
											new Date(
												this.findById(element).date
											);
										let dateString =
											date &&
											date.getDate() +
												"/" +
												(date.getMonth() + 1) +
												"/" +
												date.getFullYear();
										return (
											<div
												className="cell-full"
												key={"cell" + index}
											>
												<div className="half">
													{dateString}
												</div>
												<div className="half">
													{element.session ===
													"morning"
														? "Morning"
														: "Afternoon"}
												</div>
											</div>
										);
									})}
								</Fragment>
							}
						/>
					</Fragment>
				}
				cancel={true}
				handleOk={() => this.removeElements(elements)}
			/>
		);
	};
	addSlot = () => {
		if (!this.state.validated) return false;
		let slots = [...this.state.slots],
			flag = 0;
		for (let i = 0; i < slots.length; ++i)
			if (
				this.state.tempSlotData.date === slots[i].date &&
				this.state.tempSlotData.session === slots[i].session
			) {
				flag = 1;
				break;
			}
		if (flag === 0) {
			let date = new Date(
				new Date().getFullYear(),
				new Date().getMonth() + 1,
				new Date().getDate()
			);
			if (this.UTCEnabled) {
				date.setUTCHours(0);
				date.setUTCMinutes(0);
				date.setUTCSeconds(0);
				date.setUTCMilliseconds(0);
			}
			slots.push(this.state.tempSlotData);
			this.setState(prevState => ({
				...this.state,
				incrementer: prevState.incrementer + 1,
				slots: slots,
				tempSlotData: {
					slot_id: prevState.incrementer + 1,
					date: date.toISOString(),
					session: "morning",
					total_slot: 1
				}
			}));
			return true;
		}
		return false;
	};
	saveSlots = () => {
		let slots = [...this.state.slots];
		this.setState({
			saving: true
		});
		axios
			.post("/admin/add_slots", {
				token: this.props.token,
				slots: slots
			})
			.then(data => {
				this.setState(prevState => {
					return {
						snack: true,
						successRate:
							prevState.slots.length - data.data.data.length,
						rejected: data.data.data.length !== 0,
						saving: false,
						slots: data.data.data
					};
				});
			});
	};
	dashSeperatedDateString = date => {
		let dateObj = new Date(date);
		let year = dateObj.getFullYear();
		let month = dateObj.getMonth() + 1;
		month.toString().length === 1 && (month = "0" + month);
		let dated = dateObj.getDate();
		dated.toString().length === 1 && (dated = "0" + dated);
		return year + "-" + month + "-" + dated;
	};
	changeTempDate = ({ target: { value: date } }) => {
		date = date.split("-");
		if (!(date[0].length && date[1].length && date[2].length)) return;
		let dateObj = new Date(date[0] * 1, date[1] * 1 - 1, date[2]);

		if (this.UTCEnabled) {
			dateObj.setUTCHours(0);
			dateObj.setUTCMinutes(0);
			dateObj.setUTCSeconds(0);
			dateObj.setUTCMilliseconds(0);
		}
		dateObj = dateObj.toISOString();
		this.setState({
			tempSlotData: {
				...this.state.tempSlotData,
				date: dateObj
			}
		});
	};
	changeTempDuration = ({ target: { value } }) => {
		this.setState({
			tempSlotData: {
				...this.state.tempSlotData,
				session: value
			}
		});
	};
	changeTempSlots = ({ target: { value } }) => {
		if (value <= 0) {
			this.setState({
				validated: false
			});
		} else {
			this.setState({
				validated: true
			});
		}
		this.setState(prevState => ({
			...prevState,
			tempSlotData: {
				...prevState.tempSlotData,
				total_slot: value
			}
		}));
	};
	handleClose = () => {
		this.setState({
			snack: false
		});
	};
	handleRejected = () => {
		this.setState({
			rejected: false
		});
	};
	render() {
		return (
			<Fragment>
				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left"
					}}
					open={this.state.snack}
					autoHideDuration={3000}
					onClose={this.handleClose}
					message={
						<span>{this.state.successRate} Items were Saved</span>
					}
				/>
				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left"
					}}
					open={!this.state.snack && this.state.rejected}
					autoHideDuration={6000}
					onClose={this.handleRejected}
					message={
						<span>
							Some Items were not added. Possibly duplicate
							already exists
						</span>
					}
				/>
				<div className="slot-addition">
					{this.state.slots.length > 0 && (
						<RenderTableSelectable
							data={this.state.slots}
							translate={this.translateSlotData}
							heads={this.tableHeads}
							onSelectConfirm={this.handleSelect}
							title={"Slots"}
							selectedAction={this.selectedAction}
							selectionId="slot_id"
						/>
					)}
					<Modal
						trigger={
							<Button
								color="primary"
								className="new-item"
								variant="raised"
							>
								Add slots <i className="fa fa-plus" />
							</Button>
						}
						title={"Create Slot"}
						content={
							<Fragment>
								<div className="input-field full">
									<TextField
										type="date"
										label="Date"
										defaultValue={this.dashSeperatedDateString(
											this.state.tempSlotData.date
										)}
										onChange={this.changeTempDate}
										InputLabelProps={{
											shrink: true
										}}
										fullWidth
									/>
								</div>

								<div className="input-field full">
									<FormControl fullWidth>
										<InputLabel>Session</InputLabel>
										<Select
											value={
												this.state.tempSlotData.session
											}
											onChange={this.changeTempDuration}
											inputProps={{
												name: "session"
											}}
										>
											<MenuItem value={"morning"}>
												Morning
											</MenuItem>
											<MenuItem value={"afternoon"}>
												Afternoon
											</MenuItem>
										</Select>
									</FormControl>
								</div>
								<div className="input-field full">
									<TextField
										type="number"
										defaultValue={
											this.state.tempSlotData.total_slot
										}
										label="Total Slots"
										onChange={this.changeTempSlots}
										error={!this.state.validated}
										fullWidth
									/>
								</div>
							</Fragment>
						}
						cancel={true}
						handleOk={this.addSlot}
					/>

					<Button
						color="primary"
						className="new-item save"
						variant="raised"
						onClick={this.saveSlots}
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
				<UploadForm
					actionRoute="admin/upload_slots"
					filename="slots_excel"
					token={this.props.token}
					placeholder="Upload Slot data"
				/>
			</Fragment>
		);
	}
}
export default SlotAddition;
