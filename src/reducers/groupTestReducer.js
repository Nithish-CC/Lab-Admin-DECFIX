import { ACTION_TYPES } from '../actions/types'

const INITIAL_STATE = {
	groupTestList: [],
}

/**
 * To store authenticated current user data in redux store
 * @param {Object} state
 * @param {Object} action
 */
export const groupTestState = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_GROUP_TEST_LIST:
			return {
				...state,
				groupTestList: action.payload,
			}
		case ACTION_TYPES.RESET_ALL:
			return {
				groupTestList: [],
			}
		default:
			return state
	}
}
