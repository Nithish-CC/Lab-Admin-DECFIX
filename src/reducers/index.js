/*************************************************
 * LIS
 * @file reducers.js
 * @author Sasidharan // on 08/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
import { combineReducers } from 'redux'
import { currentUser } from './loginReducer'
import { bookingDetailsState } from './bookingDetailsReducer'
import { bookTestState } from './bookTestReducer'
import { trackingState } from './trackingReducer'
import { groupTestState } from './groupTestReducer'
import { sosAlertState } from './sosAlertReducer'
import { notificationReducer } from './notificationReducer'
import { ratingState } from './ratingReducer'

/**
 * Combining all objects to redux store
 */
export default combineReducers({
	currentUser,
	bookingDetailsState,
	bookTestState,
	trackingState,
	groupTestState,
	sosAlertState,
	notificationReducer,
	ratingState,
})
