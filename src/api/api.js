import {initTextItems} from '../redux/modules/textItems';

class ParentApiInstance {
	contentEventSource = null;
	dispatch = null;

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
		}
	}

	sendMessageToContent(message) {
		if (!this.contentEventSource) {
			console.log('error: sendMessageToContent() editor not initialised', message);
			return;
		}

		this.contentEventSource.postMessage({isEditorMessage: true, ...message}, '*');
	}

	initContentEditor({defaults, textItems}) {
		this.sendMessageToContent({type: 'editorFound'});
		this.dispatch(initTextItems(textItems));
	}

	init(dispatch) {
		if(!dispatch){
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
}

const ParentApi = new ParentApiInstance();

export default ParentApi;
