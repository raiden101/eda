import React, { Component } from "react";
import "./Panel.css";
class Panel extends Component {
	state = {
		open: false
	};
	toggleExpand = () => {
		this.setState(prevState => ({
			open: !prevState.open
		}));
	};
	render() {
		return (
			<div className="panel">
				<div className="panel-title" onClick={this.toggleExpand}>
					{this.props.title}{" "}
					<i
						className={
							"fa fa-angle-" + (this.state.open ? "up" : "down")
						}
					/>
				</div>
				{this.state.open === true && (
					<div className="panel-details">{this.props.content}</div>
				)}
			</div>
		);
	}
}
export default Panel;
