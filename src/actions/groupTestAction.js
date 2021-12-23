/* eslint-disable no-prototype-builtins */
import { ACTION_TYPES } from './types'
import { myLog } from '../utils/Utility'
import Client from '../utils/AxiosInstance'
import { API_ENDPOINT } from '../config'

export const addGroupTest = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.ADD_GROUP_TEST, params)
			myLog(response, '---set group test list response----')
			if (response.Code === 200) {
				dispatch({
					type: ACTION_TYPES.SET_GROUP_TEST_LIST,
					payload: response.Message,
				})
				callback(true)
			} else {
				callback(response.Message[0].Message)
			}
		} catch (error) {
			myLog(error, '--set group test list response error--')
			callback(error.Message[0].Message)
		}
	}
}

export const getGroupTest = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_GROUP_TEST, params)
			myLog(response, '---get group test list response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_GROUP_TEST_LIST,
					payload: response.Message,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_GROUP_TEST_LIST,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_GROUP_TEST_LIST,
				payload: [],
			})
			myLog(error, '--get group test list response error--')
			callback(false)
		}
	}
}
