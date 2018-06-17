import React from "react";
import "./NotFound.css";
import { Link } from "react-router-dom";
export default () => {
	return (
		<div className="not-found">
			<div className="not-found-header">404 === Lost</div>
			Navigate your way back to <Link to="/">Home</Link>
		</div>
	);
};
