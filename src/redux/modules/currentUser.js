/* @flow */
// ------------------------------------
// Constants
// ------------------------------------
export const POPULATE_CURRENT_USER = 'POPULATE_CURRENT_USER';

let defaultUserInfo = {
	firstName: 'Paul',
	lastName: 'Barrass',
	profileImage: 'https://lh6.googleusercontent.com/-prEfCcilmww/AAAAAAAAAAI/AAAAAAAAAAA/Mo3WaeQXgys/w80-h80/photo.jpg',
	userId: '897x987x897x89x',
	email: 'paul.barrass@dreamm.co.uk',
	brandIds: [1, 4]

};

export const populateCurrentUser = (value) => ({
	type: POPULATE_CURRENT_USER,
	payload: value
});


export const actions = {
	populateCurrentUser
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
	[POPULATE_CURRENT_USER]: (state, action) => action.payload
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = defaultUserInfo;

export default function currentUserReducer(state = initialState, action) {
	const handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}
