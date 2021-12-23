import { ACTION_TYPES } from '../actions/types'

const INITIAL_STATE = {
	trackingList: [],
}

export const trackingState = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_TRACKING_LIST:
			return {
				...state,
				trackingList: action.payload,
			}
		case ACTION_TYPES.RESET_ALL:
			return {
				trackingList: [],
			}
		default:
			return state
	}
}
