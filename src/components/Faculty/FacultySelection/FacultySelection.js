import React, { Component, Fragment } from "react";
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import "./FacultySelection.css";
import RenderTable from "../../RenderTable/RenderTable";
class FacultySelection extends Component {
	state = {
		morning: [],
		afternoon: [],
		allSelected: false,
		duration: 0,
		loading: false
	};
	tableHeads = ["Date", "Remaining Slots"];
	componentWillMount() {
		this.setState({
			loading: true
		});
		axios
			.post("selection_info", {
				token: this.props.token
			})
			.then(data => {
				if (data.data.error) {
					this.setState({
						allSelected: true,
						loading: false
					});
				} else {
					this.setState({
						morning: data.data.data[0],
						afternoon: data.data.data[1],
						allSelected: false,
						loading: false
					});
				}
			});
	}
	changeDropdown = ({ target: { name, value } }) => {
		this.setState({
			[name]: value
		});
	};
    translateSlotData = obj => {
        let date = new Date(obj.date);
        let dateString = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
		return [dateString, obj.remaining_slot];
	};
	rowClicked = duration => obj => {
        this.setState({
            loading: true
        });
        axios.post('reserve_slot', {
            token: this.props.token,
            selected: {
                date: obj.date,
                session:duration
            }
        }).then(data => {
            this.setState({
                loading: false
            });
            console.log(data.data);
        })
	};
	render() {
		return (
			<Fragment>
				<div className="padd">
					{this.state.allSelected ? (
                        <div className="loading">You have selected the maximum slots.</div>
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
								this.state.morning.length > 0 ? (
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
                                    <div className="loading">No Morning Slots left</div>
								)
							) : this.state.afternoon.length > 0 ? (
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
                                <div className="loading">No Afternoon Slots left</div>
							)}
						</Fragment>
					)}
				</div>
			</Fragment>
		);
	}
}
export default FacultySelection;
