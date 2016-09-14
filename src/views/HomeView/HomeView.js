/* @flow */
import React, {PropTypes} from 'react';
import classes from './home.css';
import ParentEditorApi from '../../api/api';

export default class HomeView extends React.Component {

	static contextTypes = {
		dispatch: PropTypes.any
	};

	componentDidMount() {
		const {dispatch} = this.context;
		ParentEditorApi.init(dispatch);
	}

	render() {
		return (
			<div>
				<iframe id='contentframe' src='http://courses.dreamm.co.uk/roche/d1092/babel5to6/m1/index.html'
						className={classes.iframe} frameBorder={0} />
				<div className={classes.editor}>
					Editor
				</div>
			</div>
		);
	}
}




