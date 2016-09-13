class ParentApiInstance {
	handleMessage(event){
		console.log('rec msg in editor!', event.data);
		if(event.data.type){
			switch(event.data.type){
				case 'init':
					this.initContentEditor(event.data.params);
					break;
			}
		}
	}

	initContentEditor({defaults, textItems}){
		console.log('editor init', defaults);
	}

	init(){
		window.addEventListener('message', event => {
			this.handleMessage(event);
		});
	}
}

const ParentApi = new ParentApiInstance();

export default ParentApi;
