/*************************************************
 * LIS
 * @file Header.js
 * @author Sasidharan // on 12/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PATH } from '../../config/routes'
import { getLabadminCode, logout } from '../../utils/Utility'
import { getAppSettings, getNotificationCount } from '../../actions/commonAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import store from 'store'

class Header extends Component {
	state = {
		showNav: false,
		clientLogo: '',
		notifyCount: '',
	}

	componentDidMount = () => {
		this.props.getAppSettings((success, clientLogo) => {
			if (success) {
				this.setState({ clientLogo })
			}
		})
		this.props.getNotificationCount({ Labadmin_Code: getLabadminCode() }, (success, notifyCount) => {
			if (success) {
				this.setState({ notifyCount })
			} else {
				this.setState({ notifyCount: 0 })
			}
		})
		this.getNotifyCount()
	}

	getNotifyCount = () => {
		setInterval(() => {
			this.props.getNotificationCount(
				{ Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code },
				(success, notifyCount) => {
					if (success) {
						this.setState({ notifyCount })
					} else {
						this.setState({ notifyCount: 0 })
					}
				}
			)
		}, 100000)
	}

	render() {
		return (
			<div className='top-header'>
				<nav className='navbar fixed-top navbar-expand-md custom-navbar navbar-dark'>
					<img className='navbar-brand' src={this.state.clientLogo} id='logo_custom' width='8%' alt='' />
					<button
						className='navbar-toggler navbar-toggler-right custom-toggler'
						type='button'
						onClick={() => this.setState({ showNav: !this.state.showNav })}
					>
						<span className='navbar-toggler-icon ' />
					</button>
					<div
						className={`collapse navbar-collapse ${this.state.showNav ? 'show' : 'collapsed'}`}
						id='collapsibleNavbar'
					>
						<ul className='navbar-nav ml-auto main-nav'>
							{/* <li className='nav-item'>
								<Link className='nav-link' to=''>
									<b>
										<i className='far fa-home pr-1' />
										Home
									</b>
								</Link>
							</li> */}
							<li
								className={`nav-item ${
									(window.location.pathname === PATH.BOOK_TEST || window.location.pathname === PATH.REGISTER_PATIENT) &&
									'Active'
								}`}
							>
								<Link
									className={`nav-link ${
										(window.location.pathname === PATH.BOOK_TEST ||
											window.location.pathname === PATH.REGISTER_PATIENT) &&
										'active'
									}`}
									to={PATH.BOOK_TEST}
								>
									<b>
										<i
											className={`far fa-vial pr-1  ${
												(window.location.pathname === PATH.BOOK_TEST ||
													window.location.pathname === PATH.REGISTER_PATIENT) &&
												'active'
											}`}
										/>
										Book Test
									</b>
								</Link>
							</li>
							<li className={`nav-item ${window.location.pathname === PATH.BOOKING_DETAILS && 'Active'}`}>
								<Link
									className={`nav-link ${window.location.pathname === PATH.BOOKING_DETAILS && 'active'}`}
									to={PATH.BOOKING_DETAILS}
								>
									<b>
										<i
											className={`far fa-calendar-check pr-1  ${
												window.location.pathname === PATH.BOOKING_DETAILS && 'active'
											}`}
										/>
										Booking Details
									</b>
								</Link>
							</li>
							<li className={`nav-item ${window.location.pathname === PATH.TRACKING && 'Active'}`}>
								<Link
									className={`nav-link ${window.location.pathname === PATH.TRACKING && 'active'}`}
									to={PATH.TRACKING}
								>
									<b>
										<i
											className={`far fa-map-marker-alt pr-1  ${
												window.location.pathname === PATH.TRACKING && 'active'
											}`}
										/>
										Tracking
									</b>
								</Link>
							</li>
							<li className={`nav-item ${window.location.pathname === PATH.PROMOTION && 'Active'}`}>
								<Link
									className={`nav-link ${window.location.pathname === PATH.PROMOTION && 'active'}`}
									to={PATH.PROMOTION}
								>
									<b>
										<i className='far fa-bullhorn pr-1' />
										Promotion
									</b>
								</Link>
							</li>
							<li className={`nav-item ${window.location.pathname === PATH.GROUP_TEST && 'Active'}`}>
								<Link
									className={`nav-link ${window.location.pathname === PATH.GROUP_TEST && 'active'}`}
									to={PATH.GROUP_TEST}
								>
									<b>
										<i className='far fa-users-medical pr-1' />
										Group Test
									</b>
								</Link>
							</li>
							<li className={`nav-item ${window.location.pathname === PATH.SOS_ALERT && 'Active'}`}>
								<Link
									className={`nav-link ${window.location.pathname === PATH.SOS_ALERT && 'active'}`}
									to={PATH.SOS_ALERT}
								>
									<b>
										<i className='far fa-siren-on pr-1' />
										SOS Alert
									</b>
								</Link>
							</li>
							<li className={`nav-item ${window.location.pathname === PATH.RATING && 'Active'}`}>
								<Link className={`nav-link ${window.location.pathname === PATH.RATING && 'active'}`} to={PATH.RATING}>
									<b>
										<i className='far fa-star pr-1' />
										Rating/Feedback
									</b>
								</Link>
							</li>
							<li className={`nav-item ${window.location.pathname === PATH.NOTIFICATIONS && 'Active'}`}>
								<Link
									className={`nav-link ${window.location.pathname === PATH.NOTIFICATIONS && 'active'}`}
									to={PATH.NOTIFICATIONS}
									style={{ width: '52px' }}
								>
									<b
										style={{
											width: '30px',
											height: '30px',
											position: 'relative',
										}}
									>
										<i className='far fa-bell fa-2x' />
										<div
											style={{ position: 'absolute', padding: '2px', top: '-11px', left: '9px', borderRadius: '25px' }}
										>
											{this.state.notifyCount !== 0 ? this.state.notifyCount : null}
										</div>
									</b>
								</Link>
							</li>
							<li className='nav-item' onClick={() => logout()}>
								<Link className='nav-link' to={PATH.LOGIN}>
									<b>
										<i className='far fa-sign-out-alt pr-1' />
										Logout
									</b>
								</Link>
							</li>
						</ul>
					</div>
				</nav>
			</div>
		)
	}
}
/**
 * Type of the props used in the component
 */
Header.propTypes = {
	getAppSettings: PropTypes.func,
	getNotificationCount: PropTypes.func,
}
export default connect(null, { getAppSettings, getNotificationCount })(Header)
