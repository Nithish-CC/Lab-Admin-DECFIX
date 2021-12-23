import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PATH } from '../../config/routes'
import { isEmptyString } from '../../utils/validations'
import Wrapper from './Wrapper'
import { forgetPassword } from '../../actions/loginInAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Spinner } from 'reactstrap'
import { showNotification } from '../../actions/commonAction'
import { TOAST } from '../../utils/Constants'

class ForgetPassword extends Component {
	state = {
		hasError: false,
		showResponseError: false,
		mobileNumber: '',
		username: '',
		showLoading: false,
	}
	handleChange = event => {
		if (event.target.name === 'username') {
			this.setState({ [event.target.name]: event.target.value.trim('') })
		} else {
			if (!isEmptyString(event.target.value)) {
				const re = /^[0-9\b]+$/

				if (re.test(event.target.value)) {
					this.setState({ [event.target.name]: event.target.value.trim('') })
				}
			} else {
				this.setState({ mobileNumber: event.target.value.trim('') })
			}
		}
	}
	onSubmit = () => {
		const { mobileNumber, username } = this.state
		if (isEmptyString(username) || isEmptyString(mobileNumber)) {
			this.setState({ hasError: true })
		} else {
			this.setState({ showLoading: true })
			const params = {
				Username: username,
				Mobile_No: mobileNumber,
			}
			this.props.forgetPassword(params, (success, message) => {
				if (!success) {
					this.props.showNotification('Failed', message, TOAST.TYPE_ERROR)
					this.setState({ showResponseError: true })
				} else {
					this.props.showNotification('Success', 'Otp has been sent to your mobile number.', TOAST.TYPE_SUCCESS)
					this.props.history.push(PATH.RESET_PASSWORD)
				}
				this.setState({ showLoading: false })
			})
		}
	}
	render() {
		const { hasError, mobileNumber, username, showLoading } = this.state
		return (
			<Wrapper>
				<>
					<h3>Forget Password</h3>
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
						<label>Mobile number</label>
						<input
							type='text'
							className='form-control'
							placeholder='Enter your mobile number'
							name='mobileNumber'
							maxLength={11}
							onChange={e => this.handleChange(e)}
							value={mobileNumber}
						/>
						{hasError && isEmptyString(mobileNumber) && (
							<div>
								<small className='text-danger'>Enter valid mobile number.</small>
							</div>
						)}
					</div>
					{/* {showResponseError && (
						<div>
							<small className='text-danger'>Invalid username or mobile number.</small>
						</div>
					)} */}
					<div className='d-flex justify-content-between mt-4'>
						<button className='btn btn-dark px-4' onClick={() => this.onSubmit()} disabled={showLoading}>
							Submit
							{showLoading && <Spinner size='sm' className='ml-2 m-1' />}
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
ForgetPassword.propTypes = {
	forgetPassword: PropTypes.func,
	showNotification: PropTypes.func,
	history: PropTypes.object,
}

export default connect(null, { forgetPassword, showNotification })(ForgetPassword)
