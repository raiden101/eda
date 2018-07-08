import React, { Component, Fragment } from "react";
import RenderTable from "../../RenderTable/RenderTable";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import "./PendingFaculty.css";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Logo from "./logo.png";
import { Button, Snackbar } from "@material-ui/core";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class PendingFaculty extends Component {
	state = {
		designation: 1,
		users: [],
		loading: true,
		msg: "",
		snack: false
	};
	constructor(props) {
		super(props);
		this.unmounted = false;
		this.props = props;
		this.tableHeads = ["Id", "Name", "No. of Slots Selected"];
	}
	translateSlotData = obj => {
		return [obj.fac_id, obj.fac_name, obj.tot_count];
	};
	componentWillUnmount() {
		this.unmounted = true;
	}
	componentDidMount() {
		this.setState({
			loading: true
		});
		axios
			.post("/admin/pending_faculty", {
				token: this.props.token,
				designation: 1
			})
			.then(data => {
				!this.unmounted &&
					this.setState({
						users: data.data.data,
						loading: false
					});
			});
	}
	changeDropdown = ({ target: { name, value } }) => {
		!this.unmounted &&
			this.setState({
				[name]: value,
				loading: true
			});
		axios
			.post("/admin/pending_faculty", {
				token: this.props.token,
				designation: value
			})
			.then(data => {
				!this.unmounted &&
					this.setState({
						users: data.data.data,
						loading: false
					});
			});
	};
	getDesignation = index => {
		switch (index) {
			case 1:
				return "Asst. Prof. GD 1";
			case 2:
				return "Asst. Prof. GD 2";
			case 3:
				return "Asst. Prof. GD 3";
			case 4:
				return "Asso. Prof.";
			default:
				return;
		}
	};
	downloadPdf = () => {
		if (this.state.loading) return;
		let rows;
		rows = this.state.users.map((element, i) => {
			return [i + 1].concat(this.translateSlotData(element));
		});
		rows = [["sl no."].concat(this.tableHeads)].concat(rows).map(e => {
			return e.map(ee => {
				return {
					text: {
						alignment: "center",
						text: ee
					}
				};
			});
		});
		let docDefinition = {
			footer: function(currentPage, pageCount) {
				return {
					columns: [
						{
							margin: [0, 10, 30, 0],
							alignment: "center",
							text: {
								color: "#777",
								bold: true,
								text: "Powered by Finite Loop"
							}
						},
						{
							margin: [0, 10, 30, 0],
							alignment: "right",
							text: {
								color: "#777",
								bold: true,
								text:
									"page " +
									currentPage.toString() +
									" / " +
									pageCount
							}
						}
					]
				};
			},
			content: [
				{
					image: Logo,
					width: 90,
					height: 60,
					style: "icentered"
				},
				{
					columns: [
						{
							width: "100%",
							margin: [0, 0, 0, 30],
							alignment: "center",
							text: {
								bold: true,
								text:
									"Designation : " +
									this.getDesignation(
										this.state.designation
									) +
									" with no or less duties."
							}
						}
					]
				},
				{
					table: {
						headerRows: 0,
						widths: ["20%", "20%", "40%", "20%"],
						body: [...rows]
					}
				}
			],
			styles: {
				icentered: {
					alignment: "center"
				}
			}
		};
		pdfMake.createPdf(docDefinition).print();
	};
	allocate = () => {
		this.setState({
			loading: true
		});
		axios
			.post("/admin/auto_allocation", {
				token: this.props.token
			})
			.then(data => {
				if (data.error)
					this.setState({
						snack: true,
						msg: "Auto allocation couldn't be done",
						loading: false
					});
				else {
					axios
						.post("/admin/pending_faculty", {
							token: this.props.token,
							designation: 1
						})
						.then(data => {
							!this.unmounted &&
								this.setState({
									msg: "Auto allocation done successfully",
									snack: true,
									users: data.data.data,
									loading: false
								});
						});
				}
			});
	};
	handleClose = name => () => {
		!this.unmounted && this.setState({ [name]: false });
	};
	render() {
		return (
			<Fragment>
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					open={this.state.snack}
					autoHideDuration={3000}
					onClose={this.handleClose("msg")}
					message={<span>{this.state.msg}</span>}
				/>
				<div className="controls">
					<div>
						<FormControl className="dropdown padded-dropdown">
							<InputLabel>Designation</InputLabel>
							<Select
								value={this.state.designation}
								onChange={this.changeDropdown}
								inputProps={{ name: "designation" }}
							>
								<MenuItem value={1}>Asst. Prof. GD 1</MenuItem>
								<MenuItem value={2}>Asst. Prof. GD 2</MenuItem>
								<MenuItem value={3}>Asst. Prof. GD 3</MenuItem>
								<MenuItem value={4}>Asso. Prof.</MenuItem>
							</Select>
						</FormControl>
						<Button
							variant="raised"
							color="primary"
							onClick={this.allocate}
						>
							Auto-allocate
						</Button>
					</div>
				</div>
				{this.state.users.length > 0 && !this.state.loading ? (
					<RenderTable
						data={this.state.users}
						translate={this.translateSlotData}
						heads={this.tableHeads}
					/>
				) : (
					<div className="loading">
						{this.state.loading
							? "Loading..."
							: "No users here : /"}
					</div>
				)}
				{!this.state.loading && (
					<div className="downloads">
						<div
							className="full fake-link"
							onClick={this.downloadPdf}
						>
							Download this document
						</div>
					</div>
				)}
			</Fragment>
		);
	}
}
export default PendingFaculty;
