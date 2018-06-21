import React, { Component } from "react";
import "./UploadForm.css";
import axios from 'axios';
class UploadForm extends Component {
    state = {
        filename: 0,
        file:null
    }
    changeData = ({ target: { files } }) => {
        this.setState({
            filename: files[0].name,
            file:files[0]
        });
    }
    submit = (e) => {
        e.preventDefault();
        if (!!this.state.filename) {
            let formdata = new FormData();
            formdata.append("token", this.props.token);
            formdata.append('files', this.state.file);
            let config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            axios.post(this.props.actionRoute, 
                formdata
            , config)
                .then(__ => {
                    console.log(__);
                });
        }
    }
    render() {
        console.log(!!this.state.filename)
		return (
			<div className="upload-wrapper">
                <form onSubmit = {this.submit}>
					<label className="custom-file" htmlFor="fileme">
                        <span className="ocher">
                            <h4 className="fake-header">{!!!this.state.filename ? "Upload User Data":this.state.filename}</h4>
                        </span>
                        <input onChange={this.changeData} type="file" id="fileme"/>
                    </label>
                    {!!this.state.filename && <button className="submit-file" type="submit">
                        <i className="fa fa-check"></i>
                    </button>}
				</form>
			</div>
		);
	}
}
export default UploadForm;
