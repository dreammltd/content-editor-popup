import React, {PropTypes} from 'react';

import classes from './layout.css';

function CoreLayout({children}) {
	return (
		<div className={classes.container}>
			<div className={classes.view}>
				{children}
			</div>
		</div>
	);
}

CoreLayout.propTypes = {
	children: PropTypes.element
};

export default CoreLayout;
