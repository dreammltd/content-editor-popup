class ParentApiInstance {
	contentEventSource = null;

	handleMessage(event) {
		console.log('rec msg in editor!', event.data);
		if (event.data.type) {
			switch (event.data.type) {
				case 'init':
					this.contentEventSource = event.source;
					this.initContentEditor(event.data.params);
					break;
			}
		}
	}

	sendMessageToContent(message) {
		if (!this.contentEventSource) {
			console.log(`error: sendMessageToContent() editor not initialised`, message);
			return;
		}

		window.frames[0].postMessage({isEditorMessage: true, ...message}, '*');
	}

	initContentEditor({defaults, textItems}) {
		console.log('editor init', defaults);
		this.sendMessageToContent({type: 'editorFound'});
	}

	init() {
		window.addEventListener('message', event => {
			// crude but effective message filtering
			if (event.data.isEditorMessage)
				this.handleMessage(event);
		});
	}
}

const ParentApi = new ParentApiInstance();

export default ParentApi;
