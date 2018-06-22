import React, { Component, Fragment } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import RenderTable from "../../RenderTable/RenderTable";
import Modal from "../../Modal/Modal";
import "./SelectedSlots.css";
class SelectedSlots extends Component {
	state = {
		duration: 0,
		table: {
			morning: [],
			afternoon: []
		},
		loading:false
	};

	constructor(props) {
		super(props);
		this.tableHeads = [
			"Date",
			"Total slots",
			"Remaining Slots",
			"Selected Members"
		];
		this.unmounted = false;
	}

	changeDuration = ({ target: { name, value } }) => {
		!this.unmounted &&
			this.setState({
				...this.state,
				[name]: value
			});
	};
	translateSlotData(obj) {
		let date = new Date(obj.date);
		let dateString =
			date.getDate() +
			"/" +
			(date.getMonth() + 1) +
			"/" +
			date.getFullYear();
		return [
			dateString,
			obj.total_slot,
			obj.remaining_slot,
			<Modal
				trigger={
					<Fragment>
						see details (
						<span className="fake-link">
							{obj.selected_members.length}
						</span>)
					</Fragment>
				}
				title={"Selected members"}
				content={obj.selected_members.map((element, index) => {
					return (
						<span className="wid-10 cell" key={"selected" + index}>
							{element}
						</span>
					);
				})}
			/>
		];
	}
	componentDidMount() {
		this.setState({
			loading: true
		});
		axios
			.post("admin/", {
				token: this.props.token
			})
			.then(data => {
				data = data.data;
				!this.unmounted &&
					this.setState({
						loading: false,
						table: {
							morning: data.data[0],
							afternoon: data.data[1]
						}
					});
			});
	}
	componentWillUnmount() {
		this.unmounted = true;
	}
	render() {
		return (
			<Fragment>
				{!this.state.loading &&
					!!(
						this.state.table.morning.length ||
						this.state.table.afternoon.length
					) && (
						<div className="controls">
							<FormControl className="select-duration">
								<InputLabel>Duration</InputLabel>
								<Select
									value={this.state.duration}
									onChange={this.changeDuration}
									inputProps={{
										name: "duration"
									}}
								>
									<MenuItem value={0}>Morning</MenuItem>
									<MenuItem value={1}>Afternoon</MenuItem>
								</Select>
							</FormControl>
						</div>
					)}
				{this.state.table.morning.length ||
				this.state.table.afternoon.length ? (
					this.state.duration ? (
						!!this.state.table.afternoon.length ? (
							<RenderTable
								data={this.state.table.afternoon}
								translate={this.translateSlotData}
								heads={this.tableHeads}
							/>
						) : (
							<div className="loading">No afternoon slots</div>
						)
					) : !!this.state.table.morning.length ? (
						<RenderTable
							data={this.state.table.morning}
							translate={this.translateSlotData}
							heads={this.tableHeads}
						/>
					) : (
						<div className="loading">No morning slots</div>
					)
				) : (
					<div className="loading">
						{this.state.loading ? "Loading.." : "No data here"}
					</div>
				)}
			</Fragment>
		);
	}
}
export default SelectedSlots;
