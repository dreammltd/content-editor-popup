class ParentApiInstance {
	contentEventSource = null;

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
	}

	init() {
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
