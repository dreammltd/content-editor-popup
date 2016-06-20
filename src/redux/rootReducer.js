import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import currentUser from './modules/currentUser';

export default combineReducers({
	currentUser,
	router
});
