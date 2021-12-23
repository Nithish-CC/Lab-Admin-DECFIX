/*************************************************
 * LIS
 * @file Login.js
 * @author Sasidharan // on 08/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { authenticate } from '../../actions/loginInAction'
import Wrapper from './Wrapper'
import { PATH } from '../../config/routes'
import { isEmptyString } from '../../utils/validations'
import { Spinner } from 'reactstrap'
import { isLoggedIn } from '../../utils/Utility'

const regexp = /^\S*$/

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
			password: '',
			showLoading: false,
			hasError: false,
			showLoginError: false,
			showPassword: false,
		}
	}

	componentDidMount = () => {
		if (isLoggedIn()) {
			this.props.history.push(PATH.BOOK_TEST)
		}
	}

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value.trim('') })
	}
	/**
	 * Handles onSubmit Login Form
	 */
	onClickLogin = () => {
		const { username, password } = this.state
		this.setState({ showLoginError: false })
		if (isEmptyString(username) || isEmptyString(password) || !regexp.test(username) || !regexp.test(password)) {
			this.setState({ hasError: true })
		} else {
			this.setState({ showLoading: true })
			this.props.authenticate(this.state.username.trim(), this.state.password.trim(), result => {
				this.setState({ showLoading: false })
				if (result) {
					this.props.history.push(PATH.BOOK_TEST)
				} else {
					this.setState({ showLoginError: true })
				}
			})
		}
	}
	/**
	 * Renders login screen design
	 */
	render() {
		const { username, password, hasError, showLoginError, showPassword } = this.state
		return (
			<Wrapper>
				<>
					<h3>Login</h3>
					<p className='text-muted'>Login to your account using your credentials</p>
					<div className='form-group'>
						<label>Username</label>
						<div className='input-group mb-3'>
							<input
								type='text'
								className='form-control'
								placeholder='Enter username'
								name='username'
								onChange={e => this.handleChange(e)}
								value={username}
							/>
						</div>
						{hasError && (isEmptyString(username) || !regexp.test(username)) && (
							<div>
								<small className='text-danger'>Enter valid username.</small>
							</div>
						)}
					</div>
					<div className='form-group'>
						<label>Password</label>
						<div className='input-group mb-3'>
							<input
								type={showPassword ? 'text' : 'password'}
								className='form-control'
								placeholder='Enter password'
								name='password'
								onChange={e => this.handleChange(e)}
								value={password}
								onKeyPress={event => {
									if (event.key === 'Enter') this.onClickLogin()
								}}
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
						{hasError && (isEmptyString(password) || !regexp.test(password)) && (
							<div>
								<small className='text-danger'>Enter valid password.</small>
							</div>
						)}
					</div>
					{showLoginError && (
						<div>
							<small className='text-danger'>Invalid username or password.</small>
						</div>
					)}
					<div className='d-flex justify-content-between mt-4'>
						<button className='btn btn-dark px-4' onClick={() => this.onClickLogin()} disabled={this.state.showLoading}>
							Login
							{this.state.showLoading && <Spinner size='sm' className='ml-2 m-1' />}
						</button>
						<Link to={PATH.FORGET_PASSWORD} className='align-self-center'>
							<small>Forgot Password?</small>
						</Link>
					</div>
				</>
			</Wrapper>
		)
	}
}
/**
 * Type of the props used in the component
 */
Login.propTypes = {
	authenticate: PropTypes.func,
	getAppSettings: PropTypes.func,
	history: PropTypes.object,
}

export default connect(null, { authenticate })(Login)
