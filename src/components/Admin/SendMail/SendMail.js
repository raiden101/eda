import React, { Component, Fragment } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import "./SendMail.css";
import RenderTable from "../../RenderTable/RenderTable";
class SendMail extends Component {
	state = {
		sendPending: true,
		sendToNonPending: true,
		users: [],
		pending: [],
        nonpending: [],
        loading:false
	};
	unmounted = false;
	tableHeads = ["name", "id", "email"];
	check = ({ target: { name } }) => {
		!this.unmounted &&
			this.setState(prevState => ({ [name]: !prevState[name] }));
	};
    componentDidMount() {
        this.setState({
            loading: true
        });
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
                        loading:false
					});
			});
	}
	componentWillUnmount() {
		this.unmounted = true;
	}
	translateSlotData(obj) {
		return [obj.fac_name, obj.fac_id, obj.email];
	}
	render() {
		let users = [];
		this.state.sendToNonPending && users.push(...this.state.nonpending);
		this.state.sendPending && users.push(...this.state.pending);
		return (
			<Fragment>
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
					</div>
				</div>
				{users.length > 0 ?<RenderTable
					heads={this.tableHeads}
					data={users}
					translate={this.translateSlotData}
					title={"Send Mail"}
					paginationEnabled={true}
                /> : <div className="loading">{this.state.loading ? "Loading..." : "No users"}</div>}
			</Fragment>
		);
	}
}
export default SendMail;
