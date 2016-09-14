import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import textItems from './modules/textItems';

export default combineReducers({
	textItems,
	router
});
