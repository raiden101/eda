import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';
export default () => {
	return <div className="not-found table">
			<div className="table-cell">
				<div className="not-found-header">404</div>
				Navigate your way back to <Link to="/">Home</Link>
			</div>
		</div>;
}