import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

class ModalUntriggered extends Component {
	toggleClose = () => {
        this.props.sendStatus();
		return true;
	};
	render() {
		return (
				<Dialog open={true} onClose={this.toggleClose}>
					<DialogTitle>{this.props.title}</DialogTitle>
					<DialogContent className="dull-text">
						{this.props.content}
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => {
								if (this.props.handleOk)
									this.props.handleOk() && this.toggleClose();
								else this.toggleClose();
							}}
							color="primary"
						>
							Ok
						</Button>
						{this.props.cancel && (
							<Button onClick={this.toggleClose} color="default">
								Cancel
							</Button>
						)}
					</DialogActions>
				</Dialog>
		);
	}
}
export default ModalUntriggered;
