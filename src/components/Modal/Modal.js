import React, { Component,Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Modal extends Component{
    state = {
        open:false
    }
    toggleClose = () => {
        this.setState(prevState => ({
            open:!prevState.open
        }))
    }
    render() {
        return (
            <Fragment>
                <span onClick={this.toggleClose} style={{
                    cursor:'pointer'
                }}> { this.props.trigger }</span>
                <Dialog
                    open={this.state.open}
                    onClose={this.toggleClose}>
                    <DialogTitle>{this.props.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{this.props.content}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.toggleClose} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}
export default Modal;