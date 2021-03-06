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
		this.state = {
			height: window.innerHeight,
			changedItems: {},
			saved: false
		};
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
		if (confirm('Are you sure you made all of your changes?\n\n' +
				'Creating your new course can take 5-10 minutes.\n\n' +
				'Ready to proceed and save?')) {
			// trigger save
			fetch('', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					textItems: ParentEditorApi.getChangedItems()
				})
			}).then(response => {
				// we're saved
				this.setState({...this.state, saved: true});
			});
		}
	};

	clickCancel = (event) => {
		if (confirm('Are you sure you want to undo all of your changes?')) {
			window.location.reload();
		}
	};

	windowResize() {
		const {innerHeight: height} = window;
		this.setState({height, changedItems: this.state.changedItems, saved: false});
	}

	textItemChanged = ({key, value}) => {
		ParentEditorApi.textItemChanged({key, value});
		this.setState({height: this.state.height, changedItems: ParentEditorApi.getChangedItems(), saved: false});
	};

	render() {
		// grab settings from window, rendered by alfred on server into the html
		const {job, user, branch, module} = window.settings;

		// e.g. 'http://courses.dreamm.co.uk/roche/d1092/babel5to6/m1/index.html';
		const iframeUrl = `${job.coursesBaseUrl}${branch}/${module}/index.html`;

		const {textItems} = this.props;
		const {height, changedItems, saved} = this.state;
		const textItemKeys = Object.keys(textItems);

		// filter and group textItems
		const groups = _.groupBy(_.filter(textItemKeys, (key) => {
			// exclude engine
			if (key.indexOf('components-containers-engine') == 0)
				return false;

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
		const displaySaveAndCancel = Object.keys(changedItems).length > 0;

		if (saved) {
			return <div className={classes.saved}> Thank you for your updates! <br/><br/>
				Your changes are being processed into a new e-learning course. <br/>
				In around 5-10 minutes you will be provided with new links via email to {user.email}.</div>;
		}

		return (
			<div>
				<div className={classes.iframeContainer}>
					<iframe id='contentframe' src={iframeUrl}
							className={classes.iframe} frameBorder={0}/>
					<br/>
					<div className={classes.textUnderCourse}>{user.name} editing {job.title}</div>
				</div>
				<div className={classes.menu}>
					<div onClick={this.clickHighlightMode} className={classes.circleButtonBlue}>
						<span className={classes.circleButtonIcon}><i className='fa fa-pencil'></i></span>
					</div>
					{
						displaySaveAndCancel ? <div onClick={this.clickSave}
													className={classes.circleButtonGreen}>
							<span className={classes.circleButtonIcon}><i className='fa fa-save'></i></span>
						</div> : null
					}
					{
						displaySaveAndCancel ? <div onClick={this.clickCancel}
													className={classes.circleButtonRed}>
							<span className={classes.circleButtonIcon}><i className='fa fa-remove'></i></span>
						</div> : null
					}
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
