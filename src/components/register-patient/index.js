/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layout } from '../common/Layout'
import { FormGroup, Input } from 'reactstrap'
import Modal from './modal/View'
import moment from 'moment'
import {
	getGenderDetails,
	getAddressTypeDetails,
	getPatientRelationshipDetails,
	addPatient,
	searchPatients,
	getNonLinkPatientDetails,
} from '../../actions/bookTestAction'
import { isEmptyString } from '../../utils/validations'
import { Spinner } from 'reactstrap'
import { Link } from 'react-router-dom'
import { PATH } from '../../config/routes'
import { showNotification, getPatientOtp, getOtpVerification } from '../../actions/commonAction'
import { getUserAddressListDetails } from '../../actions/bookTestAction'
import { TOAST } from '../../utils/Constants'
import DatePicker from 'reactstrap-date-picker'
import { getLabadminCode } from '../../utils/Utility'
import AsyncCreatableSelect from 'react-select/async-creatable'
import store from 'store'

class RegisterPatient extends Component {
	constructor(props) {
		super(props)
		this.state = {
			mobileNo: '',
			ptName: '',
			ptEmail: '',
			dob: moment(new Date()).format('YYYY-MM-DD'),
			gender: '',
			relationshipCode: '',
			addressType: '',
			street: '',
			place: '',
			city: '',
			pin: '',
			country: '',
			hasError: false,
			showModal: false,
			responseMessage: '',
			showLoading: false,
			state: '',
			landMark: '',
			linkCode: '',
			Pt_Code: 0,
			code: '',
			patientSelected: false,
			otpVerified: false,
		}
	}

	componentDidMount() {
		this.props.getGenderDetails({}, result => {
			this.setState({ showLoading: false })
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})

		this.props.getAddressTypeDetails({}, result => {
			this.setState({ showLoading: false })
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})

		this.props.getPatientRelationshipDetails({}, result => {
			this.setState({ showLoading: false })
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})
	}

	handleChange = event => {
		if (event.target.name !== 'mobileNo' && event.target.name !== 'pin') {
			if (event.target.name === 'addressType') {
				this.setState({ [event.target.name]: event.target.value })
				if (this.state.mobileNo.trim().length && event.target.value !== '') {
					this.props.getUserAddressListDetails(
						{
							Labadmin_Code: getLabadminCode(),
							UserName: this.state.mobileNo,
							Address_Type_code: event.target.value,
						},
						() => {
							if (this.props.patientAddressList && this.props.patientAddressList[0]) {
								this.setState({
									street: this.props.patientAddressList[0].Street,
									place: this.props.patientAddressList[0].Place,
									city: this.props.patientAddressList[0].City,
									pin: this.props.patientAddressList[0].PinCode,
									landMark: this.props.patientAddressList[0].Landmark,
									state: this.props.patientAddressList[0].State,
								})
							} else {
								this.setState({
									street: '',
									place: '',
									city: '',
									pin: '',
									landMark: '',
									state: '',
								})
							}
						}
					)
				} else {
					this.setState({
						street: '',
						place: '',
						city: '',
						pin: '',
						landMark: '',
						state: '',
					})
				}
			} else {
				this.setState({ [event.target.name]: event.target.value })
			}
		} else {
			if (!isEmptyString(event.target.value)) {
				const re = /^[0-9\b]+$/

				if (re.test(event.target.value)) {
					this.setState({ [event.target.name]: event.target.value.trim('') })
				}
			} else {
				this.setState({ [event.target.name]: event.target.value.trim('') })
			}
		}
	}

	handleNumberChange = inputValue => {
		if (inputValue && inputValue.Pt_Code) {
			this.props.getNonLinkPatientDetails(
				{
					Labadmin_Code: getLabadminCode(),
					Pt_Code: inputValue.Pt_Code.trim(),
				},
				(success, data) => {
					if (success) {
						this.setState({
							patientSelected: true,
							Pt_Code: inputValue.Pt_Code.trim(),
							mobileNo: data.Message[0].Mobile_No,
							linkCode: data.Message[0].Patient_Code,
							ptName: data.Message[0].Patient_Name,
							ptEmail: data.Message[0].Email_Id,
							dob: moment(data.Message[0].DOB).format('YYYY-MM-DD'),
							gender: data.Message[0].Gender_Code,
							street: data.Message[0].Street,
							place: data.Message[0].Place,
							city: data.Message[0].City,
							pin: data.Message[0].PinCode,
							country: data.Message[0].Country,
						})
					}
				}
			)
		} else {
			this.setState({
				mobileNo: (inputValue && inputValue.value) || '',
				ptName: '',
				ptEmail: '',
				dob: moment(new Date()).format('YYYY-MM-DD'),
				gender: '',
				relationshipCode: '',
				addressType: '',
				street: '',
				place: '',
				city: '',
				pin: '',
				country: '',
				hasError: false,
				showModal: false,
				responseMessage: '',
				showLoading: false,
				state: '',
				landMark: '',
				linkCode: '',
				patientSelected: false,
				code: '',
			})
		}
	}

	promiseOptions = inputValue => {
		this.setState({ code: '' })
		if (inputValue) {
			return new Promise(resolve => {
				this.props.searchPatients({ Labadmin_Code: getLabadminCode(), Mobile_No: inputValue }, (success, data) => {
					if (success) {
						let arr = (data.Message[0] && data.Message[0].Patient_Detail) || []
						arr.forEach(item => {
							let label = item.Pt_Mobile_No.trim() + ' - ' + item.Pt_Name.trim()
							item.label = label
							item.value = item.Pt_Code.trim()
						})
						return resolve(arr)
					} else {
						return resolve([])
					}
				})
			})
		} else {
			return new Promise(resolve => resolve([]))
		}
	}

	onClickSubmit = () => {
		let data = {
			Mobile_No: this.state.mobileNo,
			Pt_Name: this.state.ptName,
			Dob: moment(this.state.dob).format('YYYY/MM/DD'),
			Gender: this.state.gender,
			Relationship_Code: this.state.relationshipCode,
			Address_Type: this.state.addressType,
			Street: this.state.street,
			Place: this.state.place,
			City: this.state.city,
			Pin: this.state.pin,
			Country: this.state.country,
			State: this.state.state,
			Land_Mark: this.state.landMark,
		}
		if (this.state.linkCode.trim() !== '') {
			data.Link_Pt_Code = this.state.linkCode.trim()
		}
		if (this.state.ptEmail !== '') {
			data.Email_Id = this.state.ptEmail
		}

		if (
			isEmptyString(this.state.mobileNo) ||
			isEmptyString(this.state.ptName) ||
			isEmptyString(this.state.gender) ||
			isEmptyString(this.state.relationshipCode) ||
			isEmptyString(this.state.addressType) ||
			isEmptyString(this.state.street) ||
			isEmptyString(this.state.place) ||
			isEmptyString(this.state.city) ||
			// (!isEmailSpecialChar(this.state.ptEmail) && this.state.ptEmail !== '') ||
			isEmptyString(this.state.pin)
		) {
			this.setState({ hasError: true })
			this.props.showNotification('Error', 'Please fill out mandatory fields.', TOAST.TYPE_ERROR)
		} else if (this.state.patientSelected == true && this.state.otpVerified == false) {
			this.setState({ hasError: true })
			this.props.showNotification('Error', 'Please verify the OTP.', TOAST.TYPE_ERROR)
		} else {
			this.setState({ showLoading: true })
			this.props.addPatient(data, result => {
				this.setState({ showLoading: false })
				if (result && result.SuccessFlag && result.SuccessFlag !== 'false') {
					this.setState({
						mobileNo: '',
						ptName: '',
						ptEmail: '',
						dob: moment(new Date()).format('YYYY-MM-DD'),
						gender: '',
						relationshipCode: '',
						addressType: '',
						street: '',
						place: '',
						city: '',
						pin: '',
						country: '',
						hasError: false,
						showModal: false,
						responseMessage: '',
						showLoading: false,
						state: '',
						landMark: '',
						linkCode: '',
						selectPatientMobileNumber: '',
					})
					this.props.showNotification('Success', 'Patient added successfully', TOAST.TYPE_SUCCESS)
					setTimeout(() => {
						window.location.reload()
					}, 5000)
				} else {
					this.props.showNotification('Error', result.Message[0].Message, TOAST.TYPE_ERROR)
				}
			})
		}
	}

	handleSendOtp = () => {
		const data = {
			Labadmin_Code: getLabadminCode(),
			UserName: store.get('userSession').Message[0].Mobile_No,
			MobileNo: this.state.mobileNo,
			PtCode: this.state.linkCode.trim(),
		}
		this.props.getPatientOtp(data, result => {
			if (result) {
				this.props.showNotification('Success', 'OTP sent successfully', TOAST.TYPE_SUCCESS)
			}
		})
	}

	handleVerifyOtp = () => {
		const data = {
			Labadmin_Code: getLabadminCode(),
			UserName: store.get('userSession').Message[0].Mobile_No,
			PtCode: this.state.linkCode.trim(),
			OtpCode: store.get('otp') && store.get('otp').Message[0].OtpCode,
		}
		if (this.state.code && this.state.code.trim() && this.state.code.length === 0) {
			this.props.showNotification('Error', 'OTP missing', TOAST.TYPE_ERROR)
		}
		this.props.getOtpVerification(data, result => {
			console.log('verifyyyying')
			console.log(result)
			if (result) {
				console.log(store.get('otp').Message[0].OtpCode)
				if (this.state.code === store.get('otp').Message[0].OtpCode) {
					this.props.showNotification('Success', 'OTP Successfully verified', TOAST.TYPE_SUCCESS)
					this.setState({ otpVerified: true })
					this.setState({ code: '' })
					this.setState({ patientSelected: false })
					store.remove('otp')
				} else {
					this.props.showNotification('Error', 'Invalid OTP', TOAST.TYPE_ERROR)
					this.setState({ otpVerified: false })
					this.setState({ code: '' })
					this.setState({ patientSelected: true })
				}
			}
		})
	}

	onClickClose = () => {
		this.setState({ showModal: false })
	}

	render() {
		const { dob, showModal } = this.state
		return (
			<div className='main-content overflow-auto pb-3'>
				<div className='container-fluid  '>
					<div className='row'>
						{showModal && <Modal onClickClose={() => this.onClickClose()} message={this.state.responseMessage} />}
						<div className='col-12 p-0'>
							<div className='bg-white p-3 rounded'>
								<div className='row'>
									<div className='col-6'>
										<h4 className='float-left'>Registration</h4>
									</div>
								</div>

								<div className='row'>
									<div className='col-sm-6'>
										<hr className='mb-3 mt-0 ' />
										<div className='row'>
											<div className='col-6'>
												<div className='form-group'>
													<label className='col-form-label'>
														<span className='text-danger'> * </span>
														Registered Mobile Number
													</label>
													<AsyncCreatableSelect
														cacheOptions
														defaultOptions
														isClearable
														loadOptions={this.promiseOptions}
														onChange={this.handleNumberChange}
														placeholder='Enter Mobile Number'
														value={this.state.selectPatientMobileNumber}
													/>
													{/* <input
														type='text'
														className='form-control'
														name='mobileNo'
														placeholder='Enter Registered Mobile Number'
														value={this.state.mobileNo}
														onChange={e => this.handleChange(e)}
													/> */}
												</div>
											</div>
											<div className='col-sm-6'>
												<form>
													<div className='form-group'>
														<label className='col-form-label'>
															<span className='text-danger'> * </span>
															Name
														</label>
														<input
															type='text'
															className='form-control'
															name='ptName'
															placeholder='Enter Name'
															value={this.state.ptName}
															onChange={e => this.handleChange(e)}
														/>
														{/* {hasError && isEmptyString(this.state.ptName) && (
															<div>
																<small className='text-danger'>Required</small>
															</div>
														)} */}
													</div>
												</form>
											</div>
										</div>
										<div className='row'>
											<div className='col-6'>
												<div className='form-group'>
													<label>
														<span className='text-danger'> * </span>
														Date of Birth
													</label>
													<FormGroup>
														<DatePicker
															name='dob'
															value={dob}
															onChange={e =>
																this.setState({
																	dob: moment(e).isValid()
																		? moment(e).format('YYYY-MM-DD')
																		: moment(new Date()).format('YYYY-MM-DD'),
																})
															}
															maxDate={moment(new Date()).format('YYYY-MM-DD')}
															dateFormat='DD/MM/YYYY'
															showClearButton={false}
														/>
													</FormGroup>
												</div>
											</div>
											<div className='col-6'>
												<div className='form-group'>
													<label>
														<span className='text-danger'> * </span>
														Gender
													</label>
													<FormGroup>
														<Input
															type='select'
															placeholder='Select'
															name='gender'
															value={this.state.gender}
															onChange={e => this.handleChange(e)}
														>
															<option value=''>Select Gender</option>
															{this.props.genderList &&
																this.props.genderList.map(function (item, i) {
																	return (
																		<option value={item.Gender_Code} key={i}>
																			{item.Gender_Desc}
																		</option>
																	)
																})}
														</Input>
													</FormGroup>

													{/* {hasError && isEmptyString(this.state.gender) && (
														<div>
															<small className='text-danger'>Required</small>
														</div>
													)} */}
												</div>
											</div>
										</div>
										<div className='row'>
											<div className='col-sm-6'>
												<form>
													<div className='form-group'>
														<label className='col-form-label'>
															Email
															<span className='text-muted fs-13'> (optional) </span>
														</label>
														<input
															type='text'
															className='form-control'
															name='ptEmail'
															placeholder='Enter Email'
															value={this.state.ptEmail}
															onChange={e => this.handleChange(e)}
														/>
														{/* {hasError && !isEmailSpecialChar(this.state.ptEmail) && this.state.ptEmail !== '' && (
															<div>
																<small className='text-danger'>Please enter valid email</small>
															</div>
														)} */}
													</div>
												</form>
											</div>
											<div className='col-6'>
												<div className='form-group'>
													<label>
														<span className='text-danger'> * </span>
														Patient Relation
													</label>
													<FormGroup>
														<Input
															type='select'
															placeholder='Select'
															name='relationshipCode'
															value={this.state.relationshipCode}
															onChange={e => this.handleChange(e)}
														>
															<option value=''>Select Relationship</option>
															{this.props.patientRelationshipList &&
																this.props.patientRelationshipList.map(function (item, i) {
																	return (
																		<option value={item.RelationShip_Code} key={i}>
																			{item.RelationShip_Desc}
																		</option>
																	)
																})}
														</Input>
													</FormGroup>
													{/* {hasError && isEmptyString(this.state.relationshipCode) && (
														<div>
															<small className='text-danger'>Required</small>
														</div>
													)} */}
												</div>
											</div>
										</div>
									</div>
									<div className='col-sm-6'>{''}</div>
								</div>
								<div className='row'>
									<div className='col-sm-12'>
										<h4 className='float-left'>Address</h4>
									</div>
									<hr className='mb-3 mt-0' />
									<div className='col-sm-6'>
										<hr className='mb-3 mt-0 ' />
										<div className='row'>
											<div className='col-6'>
												<div className='form-group'>
													<label>
														<span className='text-danger'> * </span>
														Address Type
													</label>
													<FormGroup>
														<Input
															type='select'
															placeholder='Select'
															name='addressType'
															value={this.state.addressType}
															onChange={e => this.handleChange(e)}
														>
															<option value=''>Select Address Type</option>
															{this.props.addressTypeList &&
																this.props.addressTypeList.map(function (item, i) {
																	return (
																		<option value={item.Address_Type_Code} key={i}>
																			{item.Address_Type_Desc}
																		</option>
																	)
																})}
														</Input>
													</FormGroup>

													{/* {hasError && isEmptyString(this.state.addressType) && (
														<div>
															<small className='text-danger'>Required</small>
														</div>
													)} */}
												</div>
											</div>
											<div className='col-6'>
												<div className='form-group'>
													<label className='col-form-label'>
														<span className='text-danger'> * </span>
														Street
													</label>
													<input
														type='text'
														className='form-control'
														name='street'
														placeholder='Enter Street'
														value={this.state.street}
														onChange={e => this.handleChange(e)}
													/>

													{/* {hasError && isEmptyString(this.state.street) && (
														<div>
															<small className='text-danger'>Required</small>
														</div>
													)} */}
												</div>
											</div>
										</div>
										<div className='row'>
											<div className='col-sm-6'>
												<form>
													<div className='form-group'>
														<label className='col-form-label'>
															<span className='text-danger'> * </span>
															Place
														</label>
														<input
															type='text'
															className='form-control'
															name='place'
															placeholder='Enter Place'
															value={this.state.place}
															onChange={e => this.handleChange(e)}
														/>

														{/* {hasError && isEmptyString(this.state.place) && (
															<div>
																<small className='text-danger'>Required</small>
															</div>
														)} */}
													</div>
												</form>
											</div>
											<div className='col-6'>
												<div className='form-group'>
													<label className='col-form-label'>
														<span className='text-danger'> * </span>
														City
													</label>
													<input
														type='text'
														className='form-control'
														name='city'
														placeholder='Enter City'
														value={this.state.city}
														onChange={e => this.handleChange(e)}
													/>

													{/* {hasError && isEmptyString(this.state.city) && (
														<div>
															<small className='text-danger'>Required</small>
														</div>
													)} */}
												</div>
											</div>
										</div>
										<div className='row'>
											<div className='col-6'>
												<div className='form-group'>
													<label className='col-form-label'>State</label>
													<input
														type='text'
														className='form-control'
														name='state'
														placeholder='Enter State'
														value={this.state.state}
														onChange={e => this.handleChange(e)}
													/>
												</div>
											</div>
											<div className='col-6'>
												<div className='form-group'>
													<label className='col-form-label'>
														<span className='text-danger'> * </span>
														Pin Code
													</label>
													<input
														type='text'
														className='form-control'
														name='pin'
														placeholder='Enter Pin Code'
														value={this.state.pin}
														onChange={e => this.handleChange(e)}
													/>

													{/* {hasError && isEmptyString(this.state.pin) && (
														<div>
															<small className='text-danger'>Required</small>
														</div>
													)} */}
												</div>
											</div>
										</div>
										<div className='row'>
											<div className='col-6'>
												<div className='form-group'>
													<label className='col-form-label'>Landmark</label>
													<input
														type='text'
														className='form-control'
														name='landMark'
														placeholder='Enter Landmark'
														value={this.state.landMark}
														onChange={e => this.handleChange(e)}
													/>
												</div>
											</div>
											<div className='col-6'>
												<div className='form-group'>
													<label className='col-form-label'>Country</label>
													<input
														type='text'
														className='form-control'
														name='country'
														placeholder='Enter country'
														value={this.state.country}
														onChange={e => this.handleChange(e)}
													/>
												</div>
											</div>
										</div>

										{this.state.patientSelected ? (
											<>
												<div className='row'>
													<div className='col-sm-6'>
														<form>
															<div className='form-group'>
																<label className='col-form-label'>
																	<span className='text-danger'> * </span>
																	OTP
																</label>
																<input
																	type='text'
																	className='form-control'
																	name='place'
																	placeholder='Enter OTP'
																	onChange={value => {
																		this.setState({ code: value.target.value })
																	}}
																	// value={this.state.place}
																	value={this.state.code}
																/>

																{/* {hasError && isEmptyString(this.state.place) && (
															<div>
																<small className='text-danger'>Required</small>
															</div>
														)} */}
															</div>
														</form>
													</div>
													{console.log(this.state.code)}
													{this.state.code && this.state.code.trim() && this.state.code.length > 0 ? (
														<div className='col-6 align-self-center'>
															<button className='btn btn-light mt-3' onClick={() => this.handleVerifyOtp()}>
																Verify OTP
															</button>
														</div>
													) : (
														<div className='col-6 align-self-center'>
															<button className='btn btn-light mt-3' onClick={() => this.handleSendOtp()}>
																Send OTP
															</button>
														</div>
													)}
												</div>
											</>
										) : (
											''
										)}
									</div>
									<div className='col-sm-6'>{''}</div>
								</div>
							</div>
						</div>
					</div>
					<div className='container-fluid'>
						<div className='row'>
							<div className='col-12'>
								<button type='button' className='btn btn-info mr-2' data-dismiss='modal' onClick={this.onClickSubmit}>
									REGISTER
									{this.state.showLoading && <Spinner size='sm' className='ml-2 m-1' />}
								</button>
								<Link to={PATH.BOOK_TEST} className='btn btn-danger'>
									CANCEL
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

/**
 * Map all reducer state to the props of the component
 * @param {Object} state
 */
const mapStateToProps = state => {
	return {
		genderList: state.bookTestState.genderList,
		patientRelationshipList: state.bookTestState.patientRelationshipList,
		addressTypeList: state.bookTestState.addressTypeList,
		filterList: state.bookTestState.bookTestFilter,
		patientAddressList: state.bookTestState.userAddressList,
	}
}

RegisterPatient.propTypes = {
	genderList: PropTypes.array,
	patientRelationshipList: PropTypes.array,
	addressTypeList: PropTypes.array,
	patientAddressList: PropTypes.array,
	filterList: PropTypes.array,
	getGenderDetails: PropTypes.func,
	getAddressTypeDetails: PropTypes.func,
	getPatientRelationshipDetails: PropTypes.func,
	getUserAddressListDetails: PropTypes.func,
	addPatient: PropTypes.func,
	getPatientOtp: PropTypes.func,
	getOtpVerification: PropTypes.func,
	showNotification: PropTypes.func,
	searchPatients: PropTypes.func,
	getNonLinkPatientDetails: PropTypes.func,
}

export default Layout(RegisterPatient, mapStateToProps, {
	getGenderDetails,
	getAddressTypeDetails,
	getPatientRelationshipDetails,
	addPatient,
	getPatientOtp,
	getOtpVerification,
	showNotification,
	getUserAddressListDetails,
	searchPatients,
	getNonLinkPatientDetails,
})
