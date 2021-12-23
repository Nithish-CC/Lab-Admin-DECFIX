/*************************************************
 * LIS
 * @file loginInReducer.js
 * @author Sasidharan // on 08/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
import { ACTION_TYPES } from '../actions/types'

const INITIAL_STATE = {
	currentUser: {},
}

/**
 * To store authenticated current user data in redux store
 * @param {Object} state
 * @param {Object} action
 */
export const currentUser = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_AUTH_TOKENS:
			return {
				...state,
				currentUser: { ...action.payload },
			}
		default:
			return state
	}
}
