import { ACTION_TYPES } from '../actions/types'

const INITIAL_STATE = {
	bookTestFilter: [],
	bookTestList: [],
	genderList: [],
	patientRelationshipList: [],
	addressTypeList: [],
	patientList: [],
	patientUserList: [],
	userAddressList: [],
	promotionList: [],
	applyPromotionList: [],
}

/**
 * To store authenticated current user data in redux store
 * @param {Object} state
 * @param {Object} action
 */
export const bookTestState = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_PATIENT_FILTER_SEARCH:
			return {
				...state,
				bookTestFilter: action.payload,
			}
		case ACTION_TYPES.SET_TEST_LIST_DETAILS:
			return {
				...state,
				bookTestList: action.payload,
			}
		case ACTION_TYPES.SET_PATIENT_RELATIONSHIP:
			return {
				...state,
				patientRelationshipList: action.payload,
			}
		case ACTION_TYPES.SET_GENDER:
			return {
				...state,
				genderList: action.payload,
			}
		case ACTION_TYPES.RESET_ALL:
			return {
				bookTestFilter: [],
				bookTestList: [],
				genderList: [],
				patientRelationshipList: [],
				addressTypeList: [],
				patientList: [],
				patientUserList: [],
				userAddressList: [],
				promotionList: [],
				applyPromotionList: [],
			}
		case ACTION_TYPES.SET_ADDRESS_TYPE:
			return {
				...state,
				addressTypeList: action.payload,
			}
		case ACTION_TYPES.SET_PATIENT:
			return {
				...state,
				patientList: action.payload,
			}
		case ACTION_TYPES.SET_PATIENT_LIST:
			return {
				...state,
				patientUserList: action.payload,
			}
		case ACTION_TYPES.SET_USER_ADDRESS_LIST:
			return {
				...state,
				userAddressList: action.payload,
			}
		case ACTION_TYPES.SET_PROMOTION:
			return {
				...state,
				promotionList: action.payload,
			}
		case ACTION_TYPES.APPLY_PROMOTION:
			return {
				...state,
				applyPromotionList: action.payload,
			}
		default:
			return state
	}
}
