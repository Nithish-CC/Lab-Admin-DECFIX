/*************************************************
 * LIS
 * @file commonAction.js
 * @author Sasidharan // on 27/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
import { store } from 'react-notifications-component'
import { API_ENDPOINT } from '../config'
import Client from '../utils/AxiosInstance'
import { ACTION_TYPES } from './types'
import Store from 'store'

export const showNotification = (title, message, type) => {
	return () => {
		store.addNotification({
			title,
			message,
			type,
			insert: 'top',
			container: 'top-right',
			animationIn: ['animated', 'fadeIn'],
			animationOut: ['animated', 'fadeOut'],
			dismiss: {
				showIcon: true,
				duration: 5000,
				pauseOnHover: true,
			},
		})
	}
}

export const resetToInitialState = callback => {
	return async dispatch => {
		try {
			dispatch({
				type: ACTION_TYPES.RESET_ALL,
			})
		} catch (error) {
			callback(false)
		}
	}
}

export const getAppSettings = callback => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_APP_SETTINGS, {})
			if (response.SuccessFlag) {
				callback(true, response.Message[0].Client_Logo)
			} else {
				callback(false)
			}
		} catch (error) {
			callback(false)
		}
	}
}

export const getNotificationCount = (params, callback) => {
	return async () => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_NOTIFICATION_COUNT, params)
			if (response.Code === 200) {
				callback(true, response.Message[0].Notify_Count)
			} else {
				callback(false)
			}
		} catch (error) {
			callback(false)
		}
	}
}

export const getPatientOtp = (params, callBack) => {
	console.log('opt in')
	return async dispatch => {
		console.log('async')
		try {
			console.log('try')
			const response = await Client.post(API_ENDPOINT.OTP_SEND_PATIENT, params)
			console.log(response)
			if (response.Code === 200) {
				console.log('hello otp')
				callBack(response)
				Store.set('otp', response)
				dispatch({
					type: ACTION_TYPES.OTP_SEND_PATIENT,
					payload: response.Message[0],
				})
			} else {
				console.log('wrong')
			}
		} catch (error) {
			callBack(error.Message[0])
		}
	}
}

export const getOtpVerification = (params, callBack) => {
	console.log('opt in')
	return async dispatch => {
		console.log('async')
		try {
			console.log('try')
			const response = await Client.post(API_ENDPOINT.OTP_VERIFICATION_PATIENT, params)
			console.log(response)
			if (response.Code === 200) {
				console.log('hello otp')
				callBack(true, response.Message[0])
				dispatch({
					type: ACTION_TYPES.OTP_SEND_PATIENT,
					payload: response.Message[0],
				})
			} else {
				console.log('wrong')
			}
		} catch (error) {
			console.log('errrrrorrrrrr verify')
			callBack(false)
		}
	}
}
