import React, { Component, Fragment } from "react";
import RenderTable from "../../RenderTable/RenderTable";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import "./Reports.css";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Logo from "./logo.png";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
class Reports extends Component {
	state = {
		dates: [],
		currentDate: "",
		session: "morn",
		users: [],
		morn_dates: [],
		aft_dates: [],
		loading: true
	};
	constructor(props) {
		super(props);
		this.props = props;
		this.tableHeads = [
			"Id",
			"Name",
			"Designation",
			"Department",
			"Room no",
			"Signature"
		];
	}
	unmounted = false;
	componentWillUnmount() {
		this.unmounted = true;
	}
	translateSlotData = obj => {
		return [
			obj.fac_id,
			obj.fac_name,
			obj.fac_des.replace(/GD/g, ""),
			obj.branch.replace(/anical/g, "."),
			" ",
			" "
		];
	};
	changeDropdown = ({ target: { name, value } }) => {
		!this.unmounted &&
			this.setState({
				[name]: value,
				loading: true
			});
		let session = this.state.session;
		let date = this.state.currentDate;
		if (name === "session") session = value;
		if (name === "currentDate") date = value;
		!this.unmounted &&
			this.setState({
				dates: this.state[session + "_dates"]
			});
		let sessionString = session === "morn" ? "morning" : "afternoon";
		axios
			.post("/admin/slot_info", {
				token: this.props.token,
				session: sessionString,
				date: date
			})
			.then(data => {
				if (this.unmounted || data.data.error) return;
				data = data.data.data;
				let users = [];
				data.forEach((e, i) => {
					users.push(e.fac_info[0]);
				});
				!this.unmounted &&
					this.setState({
						users: users,
						loading: false
					});
			});
	};
	dateToString = date => {
		let d = new Date(date);
		return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
	};
	downloadPdf = () => {
		if (this.state.loading) return;
		let rows;
		rows = this.state.users.map((element, i) => {
			return [i + 1].concat(this.translateSlotData(element));
		});
		let sessionString =
			this.state.session === "morn" ? "Morning" : "Afternoon";
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
								text:"Powered by Finite Loop"
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
							width: "50%",
							margin: [0, 0, 0, 20],
							alignment: "center",
							text: {
								bold: true,
								text:
									"Date : " +
									this.dateToString(this.state.currentDate)
							}
						},
						{
							width: "50%",
							margin: [0, 0, 0, 20],
							alignment: "center",
							text: {
								bold: true,
								text: "Session : " + sessionString
							}
						}
					]
				},
				{
					table: {
						headerRows: 1,
						widths: [
							"7.5%",
							"7.5%",
							"15%",
							"20%",
							"20%",
							"15%",
							"15%"
						],

						body: [["sl no"].concat(...this.tableHeads), ...rows]
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
	componentDidMount() {
		axios
			.post("/admin/get_exam_dates", {
				token: this.props.token
			})
			.then(data => {
				data = data.data.data;
				!this.unmounted &&
					this.setState({
						morn_dates: data.morn_dates,
						aft_dates: data.aft_dates,
						dates: data.morn_dates,
						currentDate:
							data.morn_dates.length && data.morn_dates[0].date
					});
				data && data.morn_dates.length > 0
					? axios
							.post("/admin/slot_info", {
								token: this.props.token,
								session: "morning",
								date: data.morn_dates[0].date
							})
							.then(data => {
								data = data.data.data;
								let users = [];
								data.forEach((e, i) => {
									users.push(e.fac_info[0]);
								});
								!this.unmounted &&
									this.setState({
										users: users,
										loading: false
									});
							})
					: !this.unmounted &&
					  this.setState({
							loading: false
					  });
			});
	}
	render() {
		return (
			<Fragment>
				{!this.state.loading &&
					!!(
						this.state.morn_dates.length +
						this.state.aft_dates.length
					) && (
						<div className="controls">
							<div className="quarter">
								<FormControl className="dropdown">
									<InputLabel>Date</InputLabel>
									<Select
										value={this.state.currentDate}
										onChange={this.changeDropdown}
										inputProps={{
											name: "currentDate"
										}}
									>
										{this.state.dates.map(
											(element, index) => {
												return (
													<MenuItem
														value={element.date}
														key={"menu" + index}
													>
														{this.dateToString(
															element.date
														)}
													</MenuItem>
												);
											}
										)}
									</Select>
								</FormControl>
							</div>
							<div className="quarter">
								<FormControl className="dropdown">
									<InputLabel>Session</InputLabel>
									<Select
										value={this.state.session}
										onChange={this.changeDropdown}
										inputProps={{
											name: "session"
										}}
									>
										<MenuItem value="morn">
											Morning
										</MenuItem>
										<MenuItem value="aft">
											Afternoon
										</MenuItem>
									</Select>
								</FormControl>
							</div>
						</div>
					)}
				{this.state.users.length > 0 ? (
					<RenderTable
						data={this.state.users}
						translate={this.translateSlotData}
						heads={this.tableHeads}
					/>
				) : (
					<div className="loading">
						{this.state.loading ? "Loading..." : "No Data here : /"}
					</div>
				)}
				{!this.state.loading &&
					!!(
						this.state.morn_dates.length + this.state.dates.length
					) && (
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
export default Reports;
