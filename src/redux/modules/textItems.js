/* @flow */
// ------------------------------------
// Constants
// ------------------------------------
export const INIT_TEXT_ITEMS = 'INIT_TEXT_ITEMS';

export const initTextItems = (value) => ({
	type: INIT_TEXT_ITEMS,
	payload: value
});

export const actions = {
	initTextItems
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
	[INIT_TEXT_ITEMS]: (state, action) => action.payload
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};

export default function initTextReducer(state = initialState, action) {
	const handler = ACTION_HANDLERS[action.type];
	return handler ? handler(state, action) : state;
}
