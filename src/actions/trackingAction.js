/* eslint-disable no-prototype-builtins */
import { ACTION_TYPES } from './types'
import { myLog } from '../utils/Utility'
import Client from '../utils/AxiosInstance'
import { API_ENDPOINT } from '../config'

export const getTrackingList = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_TRACKING_OF_BOOKINGS, params)
			if (response.hasOwnProperty('SuccessFlag')) {
				let res = response.Message[0].Booking_List
				let arrayToDispatch = []
				res.forEach(item => {
					let temp = item
					temp.isOpen = false
					arrayToDispatch.push(temp)
				})
				dispatch({
					type: ACTION_TYPES.SET_TRACKING_LIST,
					payload: arrayToDispatch,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_TRACKING_LIST,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_TRACKING_LIST,
				payload: [],
			})
			myLog(error, '--get SET_TRACKING_LIST error--')
			callback(false)
		}
	}
}
export const dispatchTrackingList = arrayToDispatch => {
	return async dispatch => {
		try {
			dispatch({
				type: ACTION_TYPES.SET_TRACKING_LIST,
				payload: arrayToDispatch,
			})
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_TRACKING_LIST,
				payload: [],
			})
			myLog(error, '--get dispatchTrackingList error--')
		}
	}
}
export const getSearchFilters = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_BOOKING_STATUS_SEARCH, params)
			if (response.hasOwnProperty('SuccessFlag')) {
				callback(true, response.Message[0].Filter_Type_List)
			} else {
				callback(false)
			}
		} catch (error) {
			myLog(error, '-- getSearchFilters error--')
			callback(false)
		}
	}
}
