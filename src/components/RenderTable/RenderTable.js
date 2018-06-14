import React, { Component } from "react";
import "./RenderTable.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
class RenderTable extends Component {
	state = {
		page: 0,
		rows: 5
	};
	paginationEnabled = true;
	constructor(props) {
		super(props);
		if (props.paginationEnabled === undefined)
			this.paginationEnabled = props.data.length > 5;
		else if (props.paginationEnabled === false)
			this.paginationEnabled = false;
	}
	componentWillMount() {
		if (this.paginationEnabled === false)
			this.setState({
				rows: this.props.data.length
			});
	}
	changePage = (event, page) => {
		this.setState({
			page
		});
	};
	changeRows = event => {
		this.setState({
			rows: event.target.value
		});
	};
	render() {
		let rows = this.paginationEnabled ? this.state.rows : this.props.data.length;
		return (
			<div className="rendered-table">
				<Table>
					<TableHead>
						<TableRow>
							{this.props.heads.map((element, index) => {
								return (
									<TableCell key={"head" + index}>
										{element}
									</TableCell>
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{this.props.data
							.slice(
								this.state.page * rows,
								this.state.page * rows +
									rows
							)
							.map((element, index) => {
								return (
									<TableRow
										className="row-hover"
										key={"row-" + index}
										onClick={
											()=>{this.props.onRowClick && this.props.onRowClick(element)}
										}
									>
										{this.props
											.translate(element)
											.map((el, i) => {
												return (
													<TableCell
														key={"cell-" + i}
													>
														{el}
													</TableCell>
												);
											})}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
				{this.paginationEnabled && (
					<TablePagination
						component="div"
						count={this.props.data.length}
						rowsPerPage={rows}
						page={this.state.page}
						onChangePage={this.changePage}
						onChangeRowsPerPage={this.changeRows}
					/>
				)}
			</div>
		);
	}
}
export default RenderTable;
