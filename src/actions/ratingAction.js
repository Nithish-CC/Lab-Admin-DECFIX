import { ACTION_TYPES } from './types'
import { myLog } from '../utils/Utility'
import Client from '../utils/AxiosInstance'
import { API_ENDPOINT } from '../config'

export const getRating = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.VIEW_RATING, params)
			myLog(response, '---set rating response----')
			if (response.Code === 200) {
				dispatch({
					type: ACTION_TYPES.SET_RATING,
					payload: response.Message[0].Rating_Detail,
				})
				callback(response)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_RATING,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			myLog(error, '--set rating response error--')
			dispatch({
				type: ACTION_TYPES.SET_RATING,
				payload: [],
			})
			callback(false)
		}
	}
}

export const getRatingActionType = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.SEARCH_FILTERS_RATINGS, params)
			myLog(response, '---set rating action type filter response----')
			if (response.Code === 200) {
				dispatch({
					type: ACTION_TYPES.SET_RATING_ACTION_TYPE,
					payload: response.Message,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_RATING_ACTION_TYPE,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			myLog(error, '--set rating action type filter response error--')
			callback(false)
		}
	}
}

export const getRatingByStar = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.SEARCH_FILTERS_RATINGS, params)
			myLog(response, '---set rating by star type filter response----')
			if (response.Code === 200) {
				dispatch({
					type: ACTION_TYPES.SET_RATING_BY_STAR,
					payload: response.Message,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_RATING_BY_STAR,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			myLog(error, '--set rating by star type filter response error--')
			callback(false)
		}
	}
}

export const getRatedBy = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.SEARCH_FILTERS_RATINGS, params)
			myLog(response, '---set rated by type filter response----')
			if (response.Code === 200) {
				dispatch({
					type: ACTION_TYPES.SET_RATED_BY,
					payload: response.Message,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_RATED_BY,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			myLog(error, '--set rated by type filter response error--')
			callback(false)
		}
	}
}

export const getReviewType = (params, callback) => {
	return async dispatch => {
		try {
			const response = await Client.post(API_ENDPOINT.SEARCH_FILTERS_RATINGS, params)
			myLog(response, '---set review type filter response----')
			if (response.Code === 200) {
				dispatch({
					type: ACTION_TYPES.SET_REVIEW_TYPE,
					payload: response.Message,
				})
				callback(true)
			} else {
				dispatch({
					type: ACTION_TYPES.SET_REVIEW_TYPE,
					payload: [],
				})
				callback(false)
			}
		} catch (error) {
			myLog(error, '--set review type filter response error--')
			callback(false)
		}
	}
}
