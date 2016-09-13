/* @flow */
import React from 'react';
import classes from './home.css';

export default class HomeView extends React.Component {

	render() {
		return (
			<div>
				<iframe src='http://courses.dreamm.co.uk/roche/d1092/babel5to6/m1/index.html'
						className={classes.iframe} frameBorder={0}/>
				<div className={classes.editor}>
					Editor
				</div>
			</div>
		);
	}
}




