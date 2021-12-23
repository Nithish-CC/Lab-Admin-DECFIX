import { ACTION_TYPES } from '../actions/types'

const INITIAL_STATE = {
	ratingList: [],
	reviewTypeList: [],
	ratingActionTypeList: [],
	ratingByStarList: [],
	ratedByList: [],
}

/**
 * To store authenticated current user data in redux store
 * @param {Object} state
 * @param {Object} action
 */
export const ratingState = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_RATING:
			return {
				...state,
				ratingList: action.payload,
			}
		case ACTION_TYPES.RESET_ALL:
			return {
				ratingList: [],
				reviewTypeList: [],
				ratingActionTypeList: [],
				ratingByStarList: [],
				ratedByList: [],
			}
		case ACTION_TYPES.SET_REVIEW_TYPE:
			return {
				...state,
				reviewTypeList: action.payload,
			}
		case ACTION_TYPES.SET_RATING_ACTION_TYPE:
			return {
				...state,
				ratingActionTypeList: action.payload,
			}
		case ACTION_TYPES.SET_RATING_BY_STAR:
			return {
				...state,
				ratingByStarList: action.payload,
			}
		case ACTION_TYPES.SET_RATED_BY:
			return {
				...state,
				ratedByList: action.payload,
			}
		default:
			return state
	}
}
