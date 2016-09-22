/* @flow */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import classes from './contentEditor.css';
import ParentEditorApi from '../../api/api';
import SingleTextItem from 'components/singleTextItem/singleTextItem';

import _ from 'lodash';

class ContentEditorView extends React.Component {
	static propTypes = {
		textItems: PropTypes.object.isRequired
	};

	static keySuffixesToIgnore = ['transcripttext'];

	static contextTypes = {
		dispatch: PropTypes.any
	};

	constructor(props) {
		super(props);
		this.state = {height: window.innerHeight};
	}

	componentWillMount() {
		this.resizeListener = _.debounce(this.windowResize.bind(this), 200);
		window.addEventListener('resize', this.resizeListener);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeListener);
	}

	componentDidMount() {
		const {dispatch} = this.context;
		ParentEditorApi.init({dispatch, onSelectTextItem: this.onSelectTextItem});
	}

	onSelectTextItem = (key) => {
		// find the input with the key id
		const input = document.getElementById(`input-${key}`);
		// can be missing if we're not rendering input, e.g. transcripts
		if (!input) {
			return;
		}
		// scroll to view
		this.refs.editor.scrollTop = input.offsetTop - 200;

		input.focus();
	};

	clickHighlightMode = (event) => {
		ParentEditorApi.startHighlightMode();
	};

	clickSave = (event) => {
		//ParentEditorApi.startHighlightMode();
	};

	windowResize() {
		const {innerHeight: height} = window;
		this.setState({height});
	}

	textItemChanged({key, value}) {
		ParentEditorApi.textItemChanged({key, value});
	}

	render() {
		const iframeUrl = 'http://courses.dreamm.co.uk/roche/d1092/babel5to6/m1/index.html';
		const {textItems} = this.props;
		const {height} = this.state;
		const textItemKeys = Object.keys(textItems);

		// filter and group textItems
		const groups = _.groupBy(_.filter(textItemKeys, (key) => {
			// filter out ignored suffixes
			const splitKey = key.split('-');
			const suffix = splitKey[splitKey.length - 1];
			return !_.includes(ContentEditorView.keySuffixesToIgnore, suffix);
		}), (key) => {
			// group by everything but the last 2 parts of the key
			const splitKey = key.split('-');
			return Array.join(_.take(splitKey, splitKey.length - 2), '-');
		});

		const groupKeys = Object.keys(groups);
		const editorStyle = {height};

		return (
			<div>
				<iframe id='contentframe' src={iframeUrl}
						className={classes.iframe} frameBorder={0}/>
				<div className={classes.menu}>
					<div onClick={this.clickHighlightMode} className={classes.circleButtonBlue}>
						<span className={classes.circleButtonIcon}><i className='fa fa-pencil'></i></span>
					</div>
					<div onClick={this.clickSave} className={classes.circleButtonGreen}>
						<span className={classes.circleButtonIcon}><i className='fa fa-save'></i></span>
					</div>

				</div>
				<div className={classes.editor} style={editorStyle} ref='editor'>

					<div className={classes.groupPanelsContainer}>
						{groupKeys.map(groupKey => {
							let splitKey = groupKey.split('-');
							if (splitKey[splitKey.length - 1] === splitKey[splitKey.length - 2]) {
								splitKey = _.take(splitKey, splitKey.length - 1);
							}
							const displayKey = splitKey.join(' → ');

							return <div className={classes.group} key={groupKey}>
								<div className={classes.groupTitle}>{displayKey}</div>
								{groups[groupKey].map(key => <SingleTextItem
									key={key}
									textItemKey={key}
									textItemValue={textItems[key]}
									onChange={this.textItemChanged}/>)}
							</div>;
						})}
					</div>
				</div>

			</div>
		);
	}
}

const mapStateToProps = state => ({textItems: state.textItems});
export default connect(mapStateToProps)(ContentEditorView);
