/*************************************************
 * LIS
 * @file App.js
 * @author Sasidharan // on 08/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import '../assets/icons/all.min.css'
import '../assets/css/bootstrap.min.css'
import '../assets/css/style.css'
import '../assets/css/style.scss'
import '../assets/css/all.min.css'
import '../assets/css/dev.css'
import 'react-notifications-component/dist/theme.css'
import { isLoggedIn } from '../utils/Utility'
import { PATH } from './../config/routes'
import Login from './auth/Login'
import BookingDetails from './booking-details'
import ForgetPassword from './auth/ForgetPassword'
import ResetPassword from './auth/ResetPassword'
import BookTest from './book-test'
import RegisterPatient from './register-patient'
import Tracking from './tracking'
import Promotion from './promotion'
import GroupTest from './group-test'
import BookNew from './book-test/book/BookNew'
import Notification from './notifications'
import SosAlert from './sos-alert'
import Rating from './rating'
import BookNewone from './book-test/book/BookNew1'
/**
 * Authenticated routes middleware
 * @param {*} Component
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (isLoggedIn() ? <Component {...props} /> : <Redirect to={PATH.LOGIN} />)} />
)

PrivateRoute.propTypes = {
	component: PropTypes.object,
}

class App extends Component {
	render() {
		return (
			<React.Fragment>
				<React.StrictMode>
					<BrowserRouter>
						<React.Fragment>
							<Switch>
								<Route path={PATH.LOGIN} exact component={Login} />
								<Route path={PATH.FORGET_PASSWORD} exact component={ForgetPassword} />
								<Route path={PATH.RESET_PASSWORD} exact component={ResetPassword} />
								<PrivateRoute path={PATH.INDEX_PAGE} exact component={BookTest} />
								<PrivateRoute path={PATH.BOOKING_DETAILS} exact component={BookingDetails} />
								<PrivateRoute path={PATH.BOOK_TEST} exact component={BookTest} />
								<PrivateRoute path={PATH.TRACKING} exact component={Tracking} />
								<PrivateRoute path={PATH.REGISTER_PATIENT} exact component={RegisterPatient} />
								<PrivateRoute path={PATH.PROMOTION} exact component={Promotion} />
								<PrivateRoute path={PATH.GROUP_TEST} exact component={GroupTest} />
								<PrivateRoute path={PATH.BOOK_TEST_BOOK} exact component={BookNew} />
								<PrivateRoute path={PATH.NOTIFICATIONS} exact component={Notification} />
								<PrivateRoute path={PATH.SOS_ALERT} exact component={SosAlert} />
								<PrivateRoute path={PATH.RATING} exact component={Rating} />
								<PrivateRoute path="/book-test/BookNewone" component={BookNewone}/>
								{/* <PrivateRoute exact component={NotFoundScreen} /> */}
							</Switch>
						</React.Fragment>
					</BrowserRouter>
				</React.StrictMode>
			</React.Fragment>
		)
	}
}

export default App
