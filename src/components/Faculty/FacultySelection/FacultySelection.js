import React, { Component, Fragment } from "react";
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import "./FacultySelection.css";
import RenderTable from "../../RenderTable/RenderTable";
import Snackbar from "@material-ui/core/Snackbar";
class FacultySelection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			morning: [],
			afternoon: [],
			allSelected: false,
			duration: 0,
			loading: false,
			morn_max: Math.max(0,props.data.slot_lims[0].morn_max-props.data.morn_selections.length),
			aft_max: Math.max(0, props.data.slot_lims[0].aft_max - props.data.aft_selections.length),
			error: false,
			success:false
		};
	}
	unmounted = false;
	componentWillUnmount() {
		this.unmounted = true;
	}
	tableHeads = ["Date", "Remaining Slots"];
	refetch = () => {
		!this.unmounted && this.setState({
			loading: true
		});
		axios
			.post("faculty/selection_info", {
				token: this.props.token
			})
			.then(data => {
				if (data.data.error) {
					!this.unmounted && this.setState({
						allSelected: true,
						loading: false
					});
				} else {
					!this.unmounted && this.setState({
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
		!this.unmounted && this.setState({
			[name]: value
		});
	};
	translateSlotData = obj => {
		let date = new Date(obj.date);
		let dateString =
			date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
		return [dateString, obj.remaining_slot];
	};
	rowClicked = duration => obj => {
		!this.unmounted && this.setState({
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
					let morning = this.state.morning;
					let afternoon = this.state.afternoon;
					let mIndex = -1;
					let aIndex = -1;
					morning.forEach((e, i) => {
						if (e.date === obj.date) {
							mIndex = i;
							return;
						}
					});
					afternoon.forEach((e, i) => {
						if (e.date === obj.date) {
							aIndex = i;
							return;
						}
					});
					if (mIndex !== -1) morning.splice(mIndex, 1);
					if (aIndex !== -1) afternoon.splice(aIndex, 1);
					!this.unmounted && this.setState({
						loading: false,
						morning: morning,
						afternoon: afternoon,
						morn_max: mMax,
						aft_max: aMax,
						success:true
					});
				} else {
					!this.unmounted && this.setState({
						loading: false,
						error: true
					});
					this.refetch();
				}
			});
	};
	handleClose = name => () => {
		!this.unmounted && this.setState({
			[name]: false
		});
	};
	render() {
		return (
			<Fragment>
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
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left"
					}}
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
