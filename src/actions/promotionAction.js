/* eslint-disable no-prototype-builtins */
import { ACTION_TYPES } from './types'
import { myLog } from '../utils/Utility'
import Client from '../utils/AxiosInstance'
import { API_ENDPOINT } from '../config'

export const addPromotion = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.ADD_PROMOTION, params)
			myLog(response, '---set promotion response----')
			if (response.SuccessFlag !== false && response.SuccessFlag !== 'False') {
				dispatch({
					type: ACTION_TYPES.SET_PROMOTION,
					payload: response.Message[0].Promotion_List,
				})
				callback(true, response.Message[0].Message)
			} else {
				callback(false, response.Message[0].Message)
			}
		} catch (error) {
			myLog(error, '--set promotion response error--')
			callback(false, error.Message[0].Message)
		}
	}
}
export const modifyPromotion = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.MODIFY_PROMOTION, params)
			myLog(response, '---set promotion response----')
			if (response.SuccessFlag !== false) {
				callback(true)
			} else {
				callback(false, response.Message[0].Message)
			}
		} catch (error) {
			myLog(error, '--set promotion response error--')
			callback(false, error.Message[0].Message)
		}
	}
}
