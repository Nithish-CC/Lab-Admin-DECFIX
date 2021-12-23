import { ACTION_TYPES } from '../actions/types'

const INITIAL_STATE = {
	filterList: [],
	sosList: [],
}

/**
 * To store authenticated current user data in redux store
 * @param {Object} state
 * @param {Object} action
 */
export const sosAlertState = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_SOS_FILTER_LIST:
			return {
				...state,
				filterList: action.payload,
			}
		case ACTION_TYPES.SET_SOS_LIST:
			return {
				...state,
				sosList: action.payload,
			}
		case ACTION_TYPES.RESET_ALL:
			return {
				filterList: [],
				sosList: [],
			}
		default:
			return state
	}
}
