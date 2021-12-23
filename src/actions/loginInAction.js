/*************************************************
 * LIS
 * @file loginInAction.js
 * @author Sasidharan // on 08/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
import store from 'store'
import moment from 'moment'
import { ACTION_TYPES } from './types'
import { myLog } from '../utils/Utility'
import Client from '../utils/AxiosInstance'
import { API_ENDPOINT } from '../config'

/**
 * Authenticate user using email/username and password
 * @param {String} username
 * @param {String} password
 * @param {Function} callback
 */
export const authenticate = (Username, Password, callback) => {
	return async dispatch => {
		try {
			const data = {
				Username,
				Password,
			}
			const response = await Client.post(API_ENDPOINT.LOGIN, data)
			myLog(response, '---login response----')
			if (response.SuccessFlag) {
				myLog('success', '---login response----')
				/**
				 * Dispatch authenticated user data to reducer
				 */
				dispatch({
					type: ACTION_TYPES.SET_AUTH_TOKENS,
					payload: response.Message[0],
				})
				store.set('userSession', response)
				store.set('sessionTill', moment().add(20, 'm').toDate())
				callback(true)
			} else {
				callback(false)
			}
		} catch (error) {
			myLog(error, '--Login error--')
			callback(false)
		}
	}
}

export const forgetPassword = (body, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.OTP_SEND, body)
			if (response.SuccessFlag) {
				callback(true)
			} else {
				callback(false, response && response.Message[0] && response.Message[0].Message)
			}
		} catch (error) {
			myLog(error, '--forgetPassword error--')
			callback(false, error && error.Message[0] && error.Message[0].Message)
		}
	}
}

export const resetPassword = (body, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.SET_PASSWORD, body)
			if (response.SuccessFlag) {
				callback(true)
			} else {
				callback(false, response)
			}
		} catch (error) {
			myLog(error, '--resetPassword error--')
			callback(false, error.Message[0].Message)
		}
	}
}
