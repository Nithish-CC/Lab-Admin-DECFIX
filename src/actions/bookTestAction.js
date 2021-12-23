/* eslint-disable no-prototype-builtins */
import { ACTION_TYPES } from './types'
import { myLog } from '../utils/Utility'
import Client from '../utils/AxiosInstance'
import { API_ENDPOINT } from '../config'

export const getTestSearchDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_PATIENT_FILTER_SEARCH, params)
			myLog(response, '---get patient filter response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_PATIENT_FILTER_SEARCH,
					payload: response.Message[0].Filter_Type_List,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_PATIENT_FILTER_SEARCH,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_PATIENT_FILTER_SEARCH,
				payload: [],
			})
			myLog(error, '--get patient filter response error--')
			callback(false)
		}
	}
}

export const getTestListDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_TEST_LIST_DETAILS, params)
			myLog(response, '---get test list response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_TEST_LIST_DETAILS,
					payload: response.Message[0].Patient_Detail,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_TEST_LIST_DETAILS,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_TEST_LIST_DETAILS,
				payload: [],
			})
			myLog(error, '--get test list response error--')
			callback(false)
		}
	}
}

export const getGenderDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_PATIENT_GENDER, params)
			myLog(response, '---get gender response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_GENDER,
					payload: response.Message,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_GENDER,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_GENDER,
				payload: [],
			})
			myLog(error, '--get gender response error--')
			callback(false)
		}
	}
}

export const getAddressTypeDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_ADDRESS_TYPE, params)
			myLog(response, '---get address type response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_ADDRESS_TYPE,
					payload: response.Message,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_ADDRESS_TYPE,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_ADDRESS_TYPE,
				payload: [],
			})
			myLog(error, '--get address type response error--')
			callback(false)
		}
	}
}

export const getPatientRelationshipDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_PATIENT_RELATIONSHIP, params)
			myLog(response, '---get patient relationship response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_PATIENT_RELATIONSHIP,
					payload: response.Message,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_PATIENT_RELATIONSHIP,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_PATIENT_RELATIONSHIP,
				payload: [],
			})
			myLog(error, '--get patient relationship response error--')
			callback(false)
		}
	}
}

export const addPatient = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.ADD_PATIENT, params)
			myLog(response, '---get add patient response----')
			callback(response)
		} catch (error) {
			myLog(error, '--get add patient response error--')
			callback(error)
		}
	}
}

export const getPatientDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_PATIENT, params)
			myLog(response, '---get patient response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_PATIENT,
					payload: response.Message,
				})
				callback(true, response.Message)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_PATIENT,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_PATIENT,
				payload: [],
			})
			myLog(error, '--get patient response error--')
			callback(false)
		}
	}
}

export const getPatientListDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_PATIENT_LIST, params)
			myLog(response, '---get patient list response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_PATIENT_LIST,
					payload: response.Message[0].Patient_Detail,
				})
				callback(true, response.Message[0])
			} else {
				dispatch({
					type: ACTION_TYPES.SET_PATIENT_LIST,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_PATIENT_LIST,
				payload: [],
			})
			myLog(error, '--get patient list response error--')
			callback(false)
		}
	}
}

export const getUserAddressListDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_USER_ADDRESS_LIST, params)
			myLog(response, '---get user address list response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_USER_ADDRESS_LIST,
					payload: response.Message[0].User_Address,
				})
				callback(true, response.Message[0])
			} else {
				dispatch({
					type: ACTION_TYPES.SET_USER_ADDRESS_LIST,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_USER_ADDRESS_LIST,
				payload: [],
			})
			myLog(error, '--get user address list response error--')
			callback(false)
		}
	}
}

export const getPromotiontDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_PROMOTION, params)
			myLog(response, '---get promotion list response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_PROMOTION,
					payload: response.Message[0].Promotion_List,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_PROMOTION,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_PROMOTION,
				payload: [],
			})
			myLog(error, '--get promotion list response error--')
			callback(false)
		}
	}
}

export const getPromotiontApplyDetails = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.APPLY_PROMOTION, params)
			myLog(response, '---get promotion apply response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				callback(response)
			} else {
				callback(response.Message)
			}
		} catch (error) {
			myLog(error, '--get promotion apply response error--')
			callback(error)
		}
	}
}

export const searchPatients = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.SEARCH_PATIENTS_TO_LINK, params)
			myLog(response, '---get SEARCH_PATIENTS_TO_LINK response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				callback(true, response)
			} else {
				callback(false, response.Message)
			}
		} catch (error) {
			myLog(error, '--get SEARCH_PATIENTS_TO_LINK response error--')
			callback(false, error)
		}
	}
}

export const getNonLinkPatientDetails = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_PATIENT_DETAILS, params)
			myLog(response, '---get GET_PATIENT_DETAILS response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				callback(true, response)
			} else {
				callback(false, response.Message)
			}
		} catch (error) {
			myLog(error, '--get GET_PATIENT_DETAILS response error--')
			callback(false, error)
		}
	}
}

export const bookTest = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.BOOK_TEST, params)
			myLog(response, '---get book test response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				callback(response)
			} else {
				callback(response.Message)
			}
		} catch (error) {
			myLog(error, '--get book test response error--')
			callback(error)
		}
	}
}
export const setTestListInStore = arr => {
	return dispatch => {
		dispatch({
			type: ACTION_TYPES.SET_TEST_DETAILS,
			payload: arr,
		})
	}
}

export const bookingSlotDaywise = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_BOOKING_SLOT, params)
			myLog(response, '---get booking slot daywise response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				callback(response)
			} else {
				callback(response.Message)
			}
		} catch (error) {
			myLog(error, '--get booking slot daywise response error--')
			callback(error)
		}
	}
}

export const getCollectionCharges = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_COLLECTION_CHARGES, params)
			myLog(response, '---getCollectionCharges response----')
			if (response.hasOwnProperty('SuccessFlag') && response.SuccessFlag === 'true') {
				callback(true, response.Message[0])
			} else {
				callback(false, response.Message)
			}
		} catch (error) {
			myLog(error, '--getCollectionCharges response error--')
			callback(false, error)
		}
	}
}
