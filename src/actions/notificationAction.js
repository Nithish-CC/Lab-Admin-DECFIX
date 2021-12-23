/* eslint-disable no-prototype-builtins */
import { ACTION_TYPES } from './types'
import { myLog } from '../utils/Utility'
import Client from '../utils/AxiosInstance'
import { API_ENDPOINT } from '../config'

export const getNotificationDetails = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_NOTIFICATIONS, params)
			myLog(response, '---get notification details response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				let notificationArr = []

				response.Message.forEach(element => {
					element.Notification_List.forEach(list => {
						notificationArr.push(list)
					})
				})

				dispatch({
					type: ACTION_TYPES.SET_NOTIFICATION,
					payload: notificationArr,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_NOTIFICATION,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_NOTIFICATION,
				payload: [],
			})
			myLog(error, '--get notification details response error--')
			callback(false)
		}
	}
}

export const getNotificationCount = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.GET_NOTIFICATION_COUNT, params)
			myLog(response, '---get notification count response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_NOTIFICATION_COUNT,
					payload: response.Message[0].Notification_List,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_NOTIFICATION_COUNT,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_NOTIFICATION_COUNT,
				payload: [],
			})
			myLog(error, '--get notification count response error--')
			callback(false)
		}
	}
}

export const notificationUpdate = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.NOTIFICATION_UPDATE, params)
			myLog(response, '---get notification update response----')
			if (response.hasOwnProperty('SuccessFlag')) {
				dispatch({
					type: ACTION_TYPES.SET_NOTIFICATION_COUNT,
					payload: response.Message[0].Notification_List,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_NOTIFICATION_COUNT,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			dispatch({
				type: ACTION_TYPES.SET_NOTIFICATION_COUNT,
				payload: [],
			})
			myLog(error, '--get notification update response error--')
			callback(false)
		}
	}
}
