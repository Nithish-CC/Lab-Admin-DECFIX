import { ACTION_TYPES } from '../actions/types'

const INITIAL_STATE = {
	notificationList: [],
}

export const notificationReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_NOTIFICATION:
			return {
				...state,
				notificationList: action.payload,
			}
		default:
			return state
	}
}
