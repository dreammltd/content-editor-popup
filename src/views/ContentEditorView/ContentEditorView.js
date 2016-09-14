/* @flow */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import classes from './contentEditor.css';
import ParentEditorApi from '../../api/api';

class ContentEditorView extends React.Component {

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

export default connect(state => ({textItems: state.textItems}))(ContentEditorView);
