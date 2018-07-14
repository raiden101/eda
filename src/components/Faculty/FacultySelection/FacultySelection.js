import React, { Component, Fragment } from "react";
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import "./FacultySelection.css";
import RenderTable from "../../RenderTable/RenderTable";
import Snackbar from "@material-ui/core/Snackbar";
import ModalUntriggered from "../../Modal/ModalUntriggered";
class FacultySelection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			morning: [],
			afternoon: [],
			allSelected: false,
			duration: 0,
			loading: false,
			morn_max: Math.max(0,props.data.slot_lims[0].morn_max-props.data.morn_selected_slots.length),
			aft_max: Math.max(0, props.data.slot_lims[0].aft_max - props.data.aft_selected_slots.length),
			error: false,
			success: false,
			selectConfirm: false,
			msg: null
		};
	}
	unmounted = false;
	componentWillUnmount() {
		this.unmounted = true;
	}
	tableHeads = ["Date", "Remaining Slots"];
	refetch = () => {
		!this.unmounted &&
			this.setState({
				loading: true
			});
		axios
			.post("faculty/selection_info", {
				token: this.props.token
			})
			.then(data => {
				if (data.data.error) {
					!this.unmounted &&
						this.setState({
							allSelected: true,
							loading: false
						});
				} else {
					!this.unmounted &&
						this.setState({
							morning: data.data.data[0],
							afternoon: data.data.data[1],
							allSelected: false,
							loading: false
						});
				}
			});
	};
	componentDidMount() {
		this.refetch();
	}
	changeDropdown = ({ target: { name, value } }) => {
		!this.unmounted &&
			this.setState({
				[name]: value
			});
	};
	translateSlotData = obj => {
		let date = new Date(obj.date);
		let dateString =
			date.getDate() +
			"/" +
			(date.getMonth() + 1) +
			"/" +
			date.getFullYear();
		return [dateString, obj.remaining_slot];
	};
	obj = null;
	handleOk = () => {
		let obj = this.obj;
		let duration = this.duration;
		!this.unmounted &&
			this.setState({
				loading: true
			});
		axios
			.post("faculty/reserve_slot", {
				token: this.props.token,
				selected: {
					date: obj.date,
					session: duration
				}
			})
			.then(data => {
				if (!data.data.error) {
					let mMax = this.state.morn_max;
					let aMax = this.state.aft_max;
					if (duration[0] === "m") --mMax;
					else --aMax;
					!this.unmounted &&
						this.setState({
							loading: false,
							morn_max: mMax,
							aft_max: aMax,
							success: true
						});
					this.refetch();
				} else {
					!this.unmounted &&
						this.setState({
							loading: false,
							error: true
						});
					this.refetch();
				}
			});
		return true;
	};
	rowClicked = duration => obj => {
		this.obj = obj;
		this.duration = duration;
		!this.unmounted &&
			this.setState({
				selectConfirm: true,
				msg: [duration, obj]
			});
	};
	handleClose = name => () => {
		!this.unmounted &&
			this.setState({
				[name]: false
			});
	};
	toggleSelect = () => {
		this.setState({
			selectConfirm: false
		});
	};
	render() {
		let date = new Date(this.state.msg && this.state.msg[1].date);
		let dateString =
			date.getDate() +
			"/" +
			(date.getMonth() + 1) +
			"/" +
			date.getFullYear();
		return (
			<Fragment>
				{this.state.selectConfirm && (
					<ModalUntriggered
						content={
							<div>
								Are you sure you want to select this duration?
								<br />
								<div className="cell-full">
									<div className="half">{dateString}</div>
									<div className="half">
										{this.state.msg[0]}
									</div>
								</div>
							</div>
						}
						title="Select Confirmation"
						handleOk={this.handleOk}
						sendStatus={this.toggleSelect}
						cancel={true}
					/>
				)}
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					open={this.state.error}
					autoHideDuration={3000}
					onClose={this.handleClose("error")}
					message={
						<span>
							The selected couldnt be saved , possibly because
							another user has already selected it
						</span>
					}
				/>
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					open={!this.state.error && this.state.success}
					autoHideDuration={3000}
					onClose={this.handleClose("success")}
					message={<span>The date was selected successfully</span>}
				/>
				<div className="padd">
					{this.state.allSelected ? (
						<div className="loading">
							You have selected the maximum slots.
						</div>
					) : (
						<Fragment>
							<div className="controls">
								<FormControl>
									<InputLabel>Duration</InputLabel>
									<Select
										value={this.state.duration}
										onChange={this.changeDropdown}
										inputProps={{ name: "duration" }}
									>
										<MenuItem value={0}>Morning</MenuItem>
										<MenuItem value={1}>Afternoon</MenuItem>
									</Select>
								</FormControl>
								<p className="right">
									Click on the slot you want to select.
								</p>
							</div>
							{!this.state.duration ? (
								this.state.morning.length > 0 &&
								!this.state.loading &&
								!!this.state.morn_max ? (
									<RenderTable
										heads={this.tableHeads}
										translate={this.translateSlotData}
										data={this.state.morning}
										onRowClick={this.rowClicked("morning")}
										paginationEnabled={true}
									/>
								) : this.state.loading ? (
									<div className="loading">Loading...</div>
								) : (
									<div className="loading">
										No Morning Slots left
									</div>
								)
							) : this.state.afternoon.length > 0 &&
							!this.state.loading &&
							!!this.state.aft_max ? (
								<RenderTable
									heads={this.tableHeads}
									translate={this.translateSlotData}
									data={this.state.afternoon}
									onRowClick={this.rowClicked("afternoon")}
									paginationEnabled={true}
								/>
							) : this.state.loading ? (
								<div className="loading">Loading...</div>
							) : (
								<div className="loading">
									No Afternoon Slots left
								</div>
							)}
						</Fragment>
					)}
				</div>
			</Fragment>
		);
	}
}
export default FacultySelection;
