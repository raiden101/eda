import React, { Fragment, Component } from "react";
import Panel from "../../Panel/Panel";
import RenderTable from '../../RenderTable/RenderTable';
import "./FacultyHome.css";
import axios from 'axios';
export default class FacultyHome extends Component {
    state = {
        data:0
    }
    unmounted = false;
    componentDidMount() {
        axios
            .post("faculty/", {
                token: this.props.token
            })
            .then(data => {
                !this.unmounted && this.props.setData(data.data[0]);
                !this.unmounted &&
                    this.setState({
                        data: data.data[0]
                    });
            });
    }
    componentWillUnmount() {
        this.unmounted = true;
    }
    translateSlotData = (obj) => {
        let date = new Date(obj.date);
        return [
            date.getDate() + "/" + (date.getMonth() + 1)+ "/" + date.getFullYear(),
            obj.session
        ];
    }
    render() {
        if (!this.state.data) return <div className="loading">Loading...</div>;
        let morning = this.state.data.morn_selected_slots.map((element) => {
            return { date: element, session: "Morning" };
        });
        let afternoon = this.state.data.aft_selected_slots.map((element) => {
            return {
                date: element,
                session: 'Afternoon'
            }
        });
        let tableHeads = [
            "Date",
            "Session"
        ];
        let total = [...morning, ...afternoon];
        let items = (
            <Fragment>
                <div className="mini-header" style={{
                    "marginLeft": "20px",
                    textAlign: "center"
                }}>
                    Selected Slots
            </div>
                <div className="faculty_table">
                    <RenderTable
                        data={total}
                        heads={tableHeads}
                        translate={this.translateSlotData}
                        paginationEnabled={false}
                    />
                </div>
            </Fragment>
        );
        return <Fragment>
				<Panel title={<span className="mini-header fake-link black">
							Some Information
                        </span>} 
                        content={<Fragment>
							<li className="instructions">
								Select a Maximum of{" "}
								{this.state.data.slot_lims[0].minimum}{" "}
								slot per Day.
							</li>
							<li className="instructions">
								Select a total of {this.state.data.slot_lims[0].morn_max + this.state.data.slot_lims[0].aft_max} slots. With {this.state.data.slot_lims[0].morn_max} from Morning and {this.state.data.slot_lims[0].aft_max} from Afternoon.
							</li>
						</Fragment>} />
				{total.length > 0 && items}
			</Fragment>;
        }
    }