/*************************************************
 * LIS
 * @file Utility.js
 * @author Sasidharan // on 08/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
import moment from 'moment'
import store from 'store'

import { IS_DEVELOPMENT } from './../config/index'

export let userSessionTimer
let sessionTime = 0

export function myLog(...message) {
	if (IS_DEVELOPMENT) {
		//console.log(...message)
	}
}

export const getLabadminCode = () => {
	if (typeof store.get('userSession') === 'object' && store.get('userSession').Message) {
		const adminCode = store.get('userSession').Message[0].Labadmin_Code
		return adminCode
	} else {
		logout()
	}
}

export const isLoggedIn = () => {
	if (typeof store.get('userSession') === 'object' && store.get('sessionTill')) {
		if (!userSessionTimer) {
			scheduleTokenRenewal()
		}
		if (moment().isAfter(store.get('sessionTill'))) {
			logout()
		}
		return true
	}
	/**
	 * if userSession object is not present return false
	 **/
	return false
}

export const logout = () => {
	store.clearAll()
	clearInterval(userSessionTimer)
	window.location.href = '/'
}

/**
 * logout user when user is not active for 20 mins
 **/
export const scheduleTokenRenewal = () => {
	sessionTime = 0
	userSessionTimer = setInterval(() => {
		sessionTime++
		if (sessionTime > 1800) {
			// alert('Session timeout')
			logout()
		}
	}, 1000)
}

export const getDateDDMMYYYY = string => {
	let date = string.split(' ')
	let newDate = date[0].split('/').reverse().join('/')
	date.splice(0, 1)
	date.unshift(newDate)
	return date.join(' ')
}

const sessionTimeRenewal = () => {
	sessionTime = 0
	if (moment().isBefore(store.get('sessionTill'))) {
		store.set('sessionTill', moment().add(20, 'm').toDate())
	}
}

function keyDownTextField() {
	if (isLoggedIn()) {
		sessionTimeRenewal()
	}
}

function keyDownEvent() {
	if (isLoggedIn()) {
		sessionTimeRenewal()
	}
}

function mouseMoveEvent() {
	if (isLoggedIn()) {
		sessionTimeRenewal()
	}
}

// Listen to user keypress and reset timer
document.addEventListener('keypress', keyDownTextField, false)

// Listen to user keypress and reset timer
document.addEventListener('keydown', keyDownEvent, false)

// Listen to user keypress and reset timer
document.addEventListener('mousemove', mouseMoveEvent, false)

window.addEventListener('offline', () => {
	myLog('App is offline')
})

window.addEventListener('online', () => {
	myLog('App is online')
})
