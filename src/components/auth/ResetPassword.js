import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PATH } from '../../config/routes'
import { isEmptyString } from '../../utils/validations'
import { resetPassword } from '../../actions/loginInAction'
import Wrapper from './Wrapper'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Spinner } from 'reactstrap'
import { showNotification } from '../../actions/commonAction'
import { TOAST } from '../../utils/Constants'

class ResetPassword extends Component {
	state = {
		hasError: false,
		password: '',
		otp: '',
		username: '',
		showLoading: false,
		showPassword: false,
	}
	handleChange = event => {
		if (event.target.name === 'otp') {
			// if (!isEmptyString(event.target.value)) {
			// const re = /^[0-9\b]+$/

			// if (re.test(event.target.value)) {
			this.setState({ [event.target.name]: event.target.value.trim('') })
			// }
			// } else {
			// this.setState({ mobileNumber: event.target.value.trim('') })
			// }
		} else {
			this.setState({ [event.target.name]: event.target.value })
		}
	}
	onSubmit = () => {
		const { username, otp, password } = this.state
		if (isEmptyString(username) || isEmptyString(password) || isEmptyString(otp)) {
			this.setState({ hasError: true })
		} else {
			this.setState({ showLoading: true })
			const params = {
				Username: username,
				OTP_Code: otp,
				Password: password,
			}
			this.props.resetPassword(params, (success, err) => {
				if (!success) {
					this.props.showNotification('Error', err, TOAST.TYPE_ERROR)
				} else {
					this.props.showNotification(
						'Success',
						'Your password has been reset successfully, please login to continue.',
						TOAST.TYPE_SUCCESS
					)
					this.props.history.push(PATH.BOOKING_DETAILS)
				}
				this.setState({ showLoading: false })
			})
		}
	}
	render() {
		const { hasError, password, showPassword, otp, username, showLoading } = this.state
		return (
			<Wrapper>
				<>
					<h3>Reset Password</h3>
					<div className='form-group'>
						<label>Username</label>
						<input
							type='text'
							className='form-control'
							placeholder='Enter your username'
							name='username'
							onChange={e => this.handleChange(e)}
							value={username}
						/>
						{hasError && isEmptyString(username) && (
							<div>
								<small className='text-danger'>Enter valid username.</small>
							</div>
						)}
					</div>

					<div className='form-group'>
						<label>OTP</label>
						<input
							type='number'
							className='form-control'
							placeholder='Enter your otp'
							name='otp'
							onChange={e => this.handleChange(e)}
							value={otp}
						/>
						{hasError && isEmptyString(otp) && (
							<div>
								<small className='text-danger'>Enter valid OTP.</small>
							</div>
						)}
					</div>
					<div className='form-group'>
						<label>New Password</label>
						<div className='input-group'>
							<input
								type={showPassword ? 'text' : 'password'}
								className='form-control'
								placeholder='Enter new password'
								name='password'
								onChange={e => this.handleChange(e)}
								value={password}
							/>
							<div
								className='input-group-append'
								onClick={() => this.setState({ showPassword: !this.state.showPassword })}
							>
								<span className='input-group-text bg-transparent'>
									<i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
								</span>
							</div>
						</div>
						{hasError && isEmptyString(password) && (
							<div>
								<small className='text-danger'>Enter valid password.</small>
							</div>
						)}
					</div>
					<div className='d-flex justify-content-between mt-4'>
						<button className='btn btn-dark px-4' onClick={() => this.onSubmit()}>
							Submit {showLoading && <Spinner size='sm' className='ml-2 m-1' />}
						</button>
						<Link to={PATH.LOGIN} className='align-self-center'>
							<small> Back to login</small>
						</Link>
					</div>
				</>
			</Wrapper>
		)
	}
}

ResetPassword.propTypes = {
	resetPassword: PropTypes.func,
	showNotification: PropTypes.func,
	history: PropTypes.object,
}

export default connect(null, { resetPassword, showNotification })(ResetPassword)
