import React, {PropTypes} from 'react';

import classes from './layout.css';

function CoreLayout({children}) {
	return (
		<div className={classes.container}>
			{children}
		</div>
	);
}

CoreLayout.propTypes = {
	children: PropTypes.element
};

export default CoreLayout;
