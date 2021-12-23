/* eslint-disable no-prototype-builtins */
import { ACTION_TYPES } from './types'
import { myLog } from '../utils/Utility'
import Client from '../utils/AxiosInstance'
import { API_ENDPOINT } from '../config'

export const getSOS = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_SOS, params)
			myLog(response, '---set sos list response----')
			if (response.SuccessFlag !== false) {
				dispatch({
					type: ACTION_TYPES.SET_SOS_LIST,
					payload: response.Message[0].Users_List,
				})
				callback(response)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_SOS_LIST,
					payload: [],
				})
				callback(response)
			}
		} catch (error) {
			myLog(error, '--set sos list response error--')
			dispatch({
				type: ACTION_TYPES.SET_SOS_LIST,
				payload: [],
			})
			callback(error)
		}
	}
}

export const getFilter = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_SOS_FILTER, params)
			myLog(response, '---get sos filter list response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_SOS_FILTER_LIST,
					payload: response.Message[0].Filter_Type_List,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_SOS_FILTER_LIST,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_SOS_FILTER_LIST,
				payload: [],
			})
			myLog(error, '--get sos filter list response error--')
			callback(false)
		}
	}
}
