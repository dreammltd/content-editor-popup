/* @flow */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import classes from './contentEditor.css';
import ParentEditorApi from '../../api/api';
import SingleTextItem from 'components/singleTextItem/singleTextItem';

class ContentEditorView extends React.Component {
	static propTypes = {
		textItems: PropTypes.object.isRequired
	};

	static contextTypes = {
		dispatch: PropTypes.any
	};

	componentDidMount() {
		const {dispatch} = this.context;
		ParentEditorApi.init(dispatch);
	}

	textItemChanged({key, value}) {
		ParentEditorApi.textItemChanged({key, value});
	}

	render() {
		const {textItems} = this.props;
		const textItemKeys = Object.keys(textItems);

		return (
			<div>
				<iframe id='contentframe' src='http://courses.dreamm.co.uk/roche/d1092/babel5to6/m1/index.html'
						className={classes.iframe} frameBorder={0}/>
				<div className={classes.editor}>
					{textItemKeys.map(key => <SingleTextItem
						key={key}
						textItemKey={key}
						textItemValue={textItems[key]}
						onChange={this.textItemChanged} />)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({textItems: state.textItems});
export default connect(mapStateToProps)(ContentEditorView);
