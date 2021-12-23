/*************************************************
 * LIS
 * @file Axios.js
 * @author Sasidharan // on 08/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
import axios from 'axios'
import store from 'store'

import { API_BASE_URL, OAUTH_BASE_URL } from './../config/index'
import { myLog } from './Utility'

export const axiosPrivateInstance = axios.create({
	baseURL: API_BASE_URL,
})

export const axiosCommonInstance = axios.create({
	baseURL: API_BASE_URL,
})

axiosCommonInstance.interceptors.request.use(
	function (config) {
		let originalRequest = config
		let userSession = store.get('userSession')
		if (Client.isTokenExpired()) {
			myLog('access token expires in 10 secs && refresh token called')
			return Client.refresh_token(userSession.refresh_token)
				.then(response => {
					store.set('userSession', response)
					if (response && response.refresh_token && response.expires_in) {
						store.set('expiryTime', Client.tokenExpires(response.expires_in))
					}
					originalRequest['Authorization'] = response.token_type + ' ' + response.access_token
					return originalRequest
				})
				.catch(err => {
					myLog('Refresh Token Error', err)
					// logout()
				})
		}
		return config
	},
	function (err) {
		return Promise.reject(err)
	}
)

axiosCommonInstance.interceptors.response.use(
	response => {
		return response
	},
	function (error) {
		if (error.response.status === 401) {
			myLog('Access token expired && calling refresh token ...')
			let userSession = store.get('userSession')
			return Client.refresh_token(userSession.refresh_token)
				.then(token_response => {
					store.set('userSession', token_response)
					if (token_response && token_response.refresh_token && token_response.expires_in) {
						store.set('expiryTime', Client.tokenExpires(token_response.expires_in))
					}
					error.config.headers['Authorization'] = token_response.token_type + ' ' + token_response.access_token
					return Promise.resolve(axiosCommonInstance(error.config))
				})
				.catch(err => {
					myLog('Refresh Token Error', err)
					// logout()
				})
		}
		return Promise.reject(error.response)
	}
)

export default class Client {
	static httpHeader(isAccessToken) {
		let date = new Date()
		let headers = {}
		headers = {
			'Content-Type': 'application/json',
			offset: date.getTimezoneOffset(),
		}
		if (isAccessToken) {
			headers = {
				'Content-Type': 'application/json',
				offset: date.getTimezoneOffset(),
				Authorization:
					typeof store.get('userSession') === 'object'
						? `${store.get('userSession').token_type} ${store.get('userSession').access_token}`
						: '',
			}
		}
		return headers
	}

	static isTokenExpired() {
		let expiryTime = store.get('expiryTime')
		if (Date.now() > expiryTime - 120 * 1000 || Date.now() > expiryTime) {
			return true
		} else {
			return false
		}
	}

	static tokenExpires(tokenExpires) {
		let minutes = Date.now() + tokenExpires * 1000
		return minutes
	}

	static OAUTH(username, password) {
		return new Promise(function (success, failed) {
			const config = {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				url: OAUTH_BASE_URL,
				method: 'POST',
				auth: {
					username: 'web_app',
					password: 'changeit',
				},
				data: `grant_type=password&scope=openid&username=${username}&password=${password}`,
			}
			myLog('GET ::::::: INPUT', config)
			Client.callAPI(config, success, failed, true)
		})
	}

	static callAPI = (config, success, failed, isPrivate) => {
		const instance = isPrivate ? axiosPrivateInstance : axiosCommonInstance
		instance(config)
			.then(response => {
				myLog('GET ::::::: response', response)
				success(response.data)
			})
			.catch(err => {
				myLog('GET ::::::: err', err)
				failed(err.data)
			})
	}

	static get(url, params, isAccessToken) {
		return new Promise(function (success, failed) {
			const config = {
				method: 'GET',
				url,
				params,
				headers: Client.httpHeader(isAccessToken),
			}
			myLog('GET ::::::: INPUT', config)
			Client.callAPI(config, success, failed, false)
		})
	}

	static post(url, data, isAccessToken) {
		return new Promise(function (success, failed) {
			const config = {
				method: 'POST',
				url,
				data,
				headers: Client.httpHeader(isAccessToken),
			}
			myLog('POST ::::: Input', config)
			Client.callAPI(config, success, failed, false)
		})
	}

	static put(url, data, isAccessToken) {
		return new Promise(function (success, failed) {
			const config = {
				method: 'PUT',
				url,
				data,
				headers: Client.httpHeader(isAccessToken),
			}
			myLog('PUT ::::::: INPUT', config)
			Client.callAPI(config, success, failed, false)
		})
	}

	static delete(url, params, isAccessToken) {
		return new Promise(function (success, failed) {
			const config = {
				method: 'DELETE',
				url,
				params,
				headers: Client.httpHeader(isAccessToken),
			}
			myLog('DELETE ::::::: INPUT', config)
			Client.callAPI(config, success, failed, false)
		})
	}

	static refresh_token(refresh_token) {
		return new Promise(function (success, failed) {
			const config = {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				url: OAUTH_BASE_URL,
				method: 'POST',
				auth: {
					username: 'web_app',
					password: 'changeit',
				},
				data: `grant_type=refresh_token&refresh_token=${refresh_token}&scope=openid`,
			}
			Client.callAPI(config, success, failed, true)
		})
	}
}
