import {initTextItems} from '../redux/modules/textItems';
import _ from 'lodash';

class ParentApiInstance {
	contentEventSource = null;
	dispatch = null;
	initialTextItemsForRevert = null;
	changedItems = {};

	handleMessage(event) {
		const {type} = event.data;
		if (!type) {
			return;
		}

		console.log(`content --> editor '${type}'`, event.data);

		switch (type) {
			case 'init':
				this.contentEventSource = event.source;
				this.initContentEditor(event.data.params);
				break;
			case 'selectTextItem':
				this.selectTextItem(event.data.key);
				break;
		}
	}

	selectTextItem(key) {
		// callback we set during init()
		this.onSelectTextItem(key);
	}

	sendMessageToContent(message) {
		if (!this.contentEventSource) {
			console.log('error: sendMessageToContent() editor not initialised', message);
			return;
		}

		this.contentEventSource.postMessage({isEditorMessage: true, ...message}, '*');
	}

	initContentEditor({defaults, textItems}) {
		if (textItems) {
			this.dispatch(initTextItems(textItems));
			// clone initial items for reverting later
			this.initialTextItemsForRevert = _.clone(textItems);
		} else {
			console.log('editor error - no textItems passed in.  this must be a deployed course for editing to work');
		}

		this.sendMessageToContent({type: 'editorFound'});
	}

	startHighlightMode() {
		this.sendMessageToContent({type: 'startHighlightMode'});
	}

	init({dispatch, onSelectTextItem}) {
		this.onSelectTextItem = onSelectTextItem;
		if (!dispatch) {
			throw new Error('No dispatch passed to ParentApi init');
		}

		this.dispatch = dispatch;

		window.addEventListener('message', event => {
			// crude but effective message filtering
			if (event.data.isEditorMessage) {
				this.handleMessage(event);
			}
		});
	}

	textItemChanged({key, value}) {
		if (this.initialTextItemsForRevert[key] === value) {
			// switched it back to its original state, so remove tracked change
			delete this.changedItems[key];
		} else {
			this.changedItems[key] = value;
		}

		this.sendMessageToContent({type: 'updateText', key, value});
	}

	getChangedItems() {
		return this.changedItems;
	}
}

const ParentApi = new ParentApiInstance();

export default ParentApi;
