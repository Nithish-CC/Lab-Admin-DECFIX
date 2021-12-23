/* eslint-disable no-prototype-builtins */
import { ACTION_TYPES } from './types'
import { myLog } from '../utils/Utility'
import Client from '../utils/AxiosInstance'
import { API_ENDPOINT } from '../config'

export const getBookingDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_BOOKING_DETAILS, params)
			myLog(response, '---get booking details response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_BOOKING_DETAILS,
					payload: response.Message[0].Booking_List,
				})
				dispatch({
					type: ACTION_TYPES.SET_BOOKING_DETAILS_FILTER_DATA,
					payload: params,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_BOOKING_DETAILS,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_BOOKING_DETAILS,
				payload: [],
			})
			myLog(error, '--get booking details error--')
			callback(false)
		}
	}
}

export const getBookingDetailsSearch = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_BOOKING_DETAILS_SEARCH, params)
			myLog(response, '---get booking details response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_BOOKING_DETAILS_SEARCH,
					payload: response.Message[0].Filter_Type_List,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_BOOKING_DETAILS_SEARCH,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_BOOKING_DETAILS_SEARCH,
				payload: [],
			})
			myLog(error, '--get booking details search error--')
			callback(false)
		}
	}
}

export const getBookingStatusDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_BOOKING_STATUS_SEARCH, params)
			myLog(response, '---get filter details response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_BOOKING_STATUS_SEARCH,
					payload: response.Message[0].Filter_Type_List,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_BOOKING_STATUS_SEARCH,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_BOOKING_STATUS_SEARCH,
				payload: [],
			})
			myLog(error, '--get filter details response error--')
			callback(false)
		}
	}
}

export const getPhlebotomistDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_PHLEBOTOMIST_DETAILS, params)
			myLog(response, '---get Phlebotomist details response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_PHLEBOTOMIST_DETAILS,
					payload: response.Message,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_PHLEBOTOMIST_DETAILS,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_PHLEBOTOMIST_DETAILS,
				payload: [],
			})
			myLog(error, '--get Phlebotomist details response error--')
			callback(false)
		}
	}
}

export const getBookingTypeDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_BOOKING_TYPE_DETAILS, params)
			myLog(response, '---get Booking Types details response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_BOOKING_TYPE_DETAILS,
					payload: response.Message,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_BOOKING_TYPE_DETAILS,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_BOOKING_TYPE_DETAILS,
				payload: [],
			})
			myLog(error, '--get Booking Types details response error--')
			callback(false)
		}
	}
}

export const getBookingFilterDetails = (params, callback) => {
	return async dispatch => {
		try {
			dispatch({
				type: ACTION_TYPES.SET_BOOKING_FILTER_DETAILS,
				payload: params,
			})
			myLog(params, '--get Booking Filter details--')
			callback(true)
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_BOOKING_FILTER_DETAILS,
				payload: [],
			})
			myLog(error, '--get Booking Filter details error--')
			callback(false)
		}
	}
}

export const getBookingDepthDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_BOOKING_DETAILED, params)
			myLog(response, '---get Booking Depth details response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_BOOKING_DETAILED,
					payload: response.Message[0],
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_BOOKING_DETAILED,
					payload: {},
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_BOOKING_DETAILED,
				payload: {},
			})
			myLog(error, '--get Booking depth details response error--')
			callback(false)
		}
	}
}

export const getTestDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_TEST_DETAILS, params)
			myLog(response, '---get test details response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_TEST_DETAILS,
					payload: response.Message[0].Service_List,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_TEST_DETAILS,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_TEST_DETAILS,
				payload: [],
			})
			myLog(error, '--get test details response error--')
			callback(false)
		}
	}
}

export const actionOnBooking = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.ACTION_ON_BOOKING, params)
			myLog(response, '---get action on booking response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				callback(true)
			} else {
				callback(false)
			}
		} catch (error) {
			myLog(error, '--get action on booking response error--')
			callback(false)
		}
	}
}

export const viewPrescription = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.VIEW_PRESCRIPTION, params)
			myLog(response, '---get viewPrescription response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				callback(true, response)
			} else {
				callback(false)
			}
		} catch (error) {
			myLog(error, '--get viewPrescription error--')
			callback(false)
		}
	}
}

export const viewInvoice = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.VIEW_INVOICE, params)
			myLog(response, '---get VIEW_INVOICE response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				callback(true, response)
			} else {
				callback(false)
			}
		} catch (error) {
			myLog(error, '--get VIEW_INVOICE error--')
			callback(false)
		}
	}
}

export const bookingUpdate = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.BOOKING_UPDATE, params)
			myLog(response, '---get bookingUpdate response----')
			if (response.SuccessFlag === 'true') {
				callback(response)
			} else {
				callback(response)
			}
		} catch (error) {
			myLog(error, '--get bookingUpdate error--')
			callback(error)
		}
	}
}
