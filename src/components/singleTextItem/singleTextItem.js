import React, {Component, PropTypes} from 'react';

import classes from './singleTextItem.css';

export default class SingleTextItem extends Component {
	static propTypes = {
		textItemKey: PropTypes.string.isRequired,
		textItemValue: PropTypes.string,
		onChange: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			editItemValue: props.textItemValue ? props.textItemValue.trim() : ''
		};
	}

	textChange = (event) => {
		const {value} = event.target;
		const {onChange, textItemKey} = this.props;

		onChange({key: textItemKey, value});

		this.setState({
			editItemValue: value
		});
	};

	render() {
		const {textItemKey} = this.props;
		const {editItemValue} = this.state;

		const keySplit = textItemKey.split('-');
		const keyToDisplay = keySplit[keySplit.length-1];

		return (<div>
			<label className={classes.keyLabel}>{keyToDisplay}</label>
			<input type='text' className={classes.inputText} onChange={this.textChange} value={editItemValue} />
		</div>);
	}
}
