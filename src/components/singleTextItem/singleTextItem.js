import React, {Component, PropTypes} from 'react';

import classes from './singleTextItem.css';

export default class SingleTextItem extends Component {
	static propTypes = {
		textItemKey: PropTypes.string.isRequired,
		textItemValue: PropTypes.string
	};

	textChange = (evt) => {

	};

	render() {
		const {textItemKey, textItemValue} = this.props;

		const keySplit = textItemKey.split('-');
		const keyToDisplay = keySplit[keySplit.length-1];

		return (<div>
			<label className={classes.keyLabel}>{keyToDisplay}</label>
			<input type='text' className={classes.inputText} onChange={this.textChange} value={textItemValue} />
		</div>);
	}
}
