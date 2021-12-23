import { ACTION_TYPES } from '../actions/types'

const INITIAL_STATE = {
	bookingDetailsList: [],
	bookingDetailsSearch: [],
	bookingDetailsStatus: [],
	phlebotomistList: [],
	bookingTypeList: [],
	bookingDetailed: {},
	bookingFilterList: {},
	testList: [],
	filterDataList: {},
}

/**
 * To store authenticated current user data in redux store
 * @param {Object} state
 * @param {Object} action
 */
export const bookingDetailsState = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_BOOKING_DETAILS:
			return {
				...state,
				bookingDetailsList: action.payload,
			}
		case ACTION_TYPES.SET_BOOKING_DETAILS_SEARCH:
			return {
				...state,
				bookingDetailsSearch: action.payload,
			}
		case ACTION_TYPES.SET_BOOKING_STATUS_SEARCH:
			return {
				...state,
				bookingDetailsStatus: action.payload,
			}
		case ACTION_TYPES.SET_PHLEBOTOMIST_DETAILS:
			return {
				...state,
				phlebotomistList: action.payload,
			}
		case ACTION_TYPES.SET_BOOKING_TYPE_DETAILS:
			return {
				...state,
				bookingTypeList: action.payload,
			}
		case ACTION_TYPES.SET_BOOKING_FILTER_DETAILS:
			return {
				...state,
				bookingFilterList: action.payload,
			}
		case ACTION_TYPES.SET_BOOKING_DETAILED:
			return {
				...state,
				bookingDetailed: action.payload,
			}
		case ACTION_TYPES.SET_TEST_DETAILS:
			return {
				...state,
				testList: action.payload,
			}
		case ACTION_TYPES.SET_BOOKING_DETAILS_FILTER_DATA:
			return {
				...state,
				filterDataList: action.payload,
			}
		case ACTION_TYPES.RESET_ALL:
			return {
				bookingDetailsList: [],
				bookingDetailsSearch: [],
				bookingDetailsStatus: [],
				phlebotomistList: [],
				bookingTypeList: [],
				bookingDetailed: {},
				bookingFilterList: {},
				testList: [],
				filterDataList: {},
			}
		default:
			return state
	}
}
