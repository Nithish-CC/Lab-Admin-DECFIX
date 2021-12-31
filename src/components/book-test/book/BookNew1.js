/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Component } from 'react'
import Head from './Head1'
import profile from '../../../assets/media/images/image.png'
import { Layout } from '../../common/Layout'
import PropTypes from 'prop-types'
import { FormGroup, Input, InputGroup, InputGroupAddon, Button } from 'reactstrap'
import { getPhlebotomistDetails, getBookingTypeDetails, getTestDetails } from '../../../actions/bookingDetailsAction'
import {
	getPatientListDetails,
	getUserAddressListDetails,
	getPatientDetails,
	getPromotiontApplyDetails,
	bookTest,
	bookingSlotDaywise,
	setTestListInStore,
	getCollectionCharges,
} from '../../../actions/bookTestAction'
import DatePicker from 'reactstrap-date-picker'
import moment from 'moment'
import { Spinner } from 'reactstrap'
import { isEmptyString, isEmptyArray } from '../../../utils/validations'
import store from 'store'
import { showNotification } from '../../../actions/commonAction'
import { TOAST } from '../../../utils/Constants'
import { PATH } from '../../../config/routes'
import { resetToInitialState } from '../../../actions/commonAction'

class BookNewone extends Component {
	constructor(props) {
		super(props)
		this.myRef = React.createRef()
		this.state = {
			showLoading: false,
			userListData: {},
			userData: {},
			maxDate: '',
			minDate: '',
			visitType: '',
			selectedPtCode: '',
			selectedAddressType: '',
			searchText: '',
			startIndex: 1,
			pageCount: 100,
			service: [],
			serviceTotal: 0,
			promoApplied: false,
			promoAppliedMsg: '',
			promotion: '',
			promotionPercent: 0,
			paymentMode: 'C',
			phlebotomist: '',
			bookType: '',
			bookTime: '',
			bookDate: moment(new Date()).format('YYYY-MM-DD'),
			user: '',
			promotionSelected: '',
			showPromotionLoading: false,
			timeSlots: [],
			showConfirmation: false,
			bookingNumber: 0,
			collectionCharges: 0,
			discountValue: false,
			// trueValue: [],
			// falseValue: [],
			serviceSupportedPromo: {},
			serviceNonSupportedPromo: {},
			totalServiceDiscountedAmount: 0,
		}
	}

	componentDidMount() {
		this.props.resetToInitialState()
		this.props.setTestListInStore([])
		this.setState({
			userListData: {},
			userData: {},
			maxDate: '',
			serviceTotal: 0,
			service: [],
			minDate: '',
			visitType: '',
			promotionSelected: '',
			promoApplied: false,
			promoAppliedMsg: '',
			promotion: '',
			promotionPercent: 0,
			paymentMode: 'C',
			phlebotomist: '',
			bookType: '',
			bookTime: '',
			bookDate: moment(new Date()).format('YYYY-MM-DD'),
		})

		const { patientCode } = this.props.location.state
		this.setState({ showLoading: true })
		this.props.getPhlebotomistDetails({}, result => {
			this.setState({ showLoading: false })
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})

		this.props.getBookingTypeDetails({}, result => {
			this.setState({ showLoading: false })
			if (result) {
				this.setState({
					minDate: moment(this.props.bookingTypeList[0].Slot_Start_Date).format('YYYY-MM-DD'),
					maxDate: moment(this.props.bookingTypeList[0].Slot_End_Date).format('YYYY-MM-DD'),
					visitType: this.props.bookingTypeList[0].Booking_Type_Code,
				})
			} else {
				console.log('')
			}
		})

		const getPatient = {
			Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
			Pt_Code: patientCode,
		}
		this.setState({ selectedPtCode: patientCode })
		this.props.getPatientDetails(getPatient, result => {
			if (result) {
				this.setState({
					userListData: {
						name: this.props.patientList[0].Patient_Name,
						age: this.props.patientList[0].First_Age,
						relationship: this.props.patientList[0].RelationShip_Name,
						gender: this.props.patientList[0].Gender,
					},
					userData: {
						...this.state.userData,
						...{
							name: this.props.patientList[0].Patient_Name,
							age: this.props.patientList[0].First_Age,
							patientId: this.props.patientList[0].Patient_ID,
							relationship: this.props.patientList[0].RelationShip_Name,
							gender: this.props.patientList[0].Gender,
						},
					},
				})

				const getPatientList = {
					Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
					UserName: this.props.patientList[0].User_Name,
				}
				this.props.getPatientListDetails(getPatientList, (result, data) => {
					this.setState({
						showLoading: false,
						userData: {
							...this.state.userData,
							...{
								image: this.getMyImage(data.Patient_Detail, this.state.userData.patientId),
								User_Image_Url: data ? data.User_Image_Url : '',
							},
						},
					})
					if (result) {
						this.props.getUserAddressListDetails(getPatientList, result => {
							this.setState({ showLoading: false })
							if (result) {
								this.setState({
									selectedAddressType: this.props.patientAddressList[0].Address_Type_Code,
								})
							} else {
								console.log('')
							}
						})
					} else {
						this.props.showNotification('Error', 'Invalid Username or Patient not found', TOAST.TYPE_ERROR)
						this.props.history.push(PATH.BOOK_TEST)
					}
				})
			} else {
				console.log('')
			}
		})

		const slotData = {
			Type_Of_Booking: 'H',
			Date_Of_Booking: moment(this.state.bookDate).format('YYYY/MM/DD'),
		}
		this.props.bookingSlotDaywise(slotData, result => {
			this.setState({ showLoading: false })
			if (result && result.Code === 200) {
				this.setState({ timeSlots: result.Message[0].Slot_Detail || [] })
				if (slotData.Type_Of_Booking === 'H') {
					console.log(result.Message[0].Slot_Detail)
				} else {
					console.log(result.Message[0])
				}
			} else {
				console.log('')
			}
		})
	}

	getMyImage = (patient_Detail_Arr, patientId) => {
		let self = patient_Detail_Arr.filter(i => i.Pt_Code === patientId)
		return self[0].Pt_Profile_Picture
	}

	handleChange = event => {
		if (event.target.name === 'promotion' && event.target.value.trim() === '') {
			const serviceArr = this.state.service
			if (serviceArr && serviceArr.length) {
				for (let i = 0, _len = serviceArr.length; i < _len; i++) {
					serviceArr[i]['Service_Discount'] = (serviceArr[i]['Service_Amount'] * 0) / 100
				}
			}
			this.setState({
				promotion: '',
				promoApplied: false,
				promotionPercent: 0,
				promotionSelected: '',
				promoAppliedMsg: '',
				service: [],
			})
		} else {
			this.setState({ [event.target.name]: event.target.value })
		}
	}

	getTest = newValue => {
		const searchData = {
			Search_Text: newValue,
			Start_Index: this.state.startIndex,
			Page_Count: this.state.pageCount,
		}
		this.props.getTestDetails(searchData, result => {
			this.setState({ showLoading: false })
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})
	}

	getSlot = () => {
		const slotData = {
			Type_Of_Booking: this.state.visitType,
			Date_Of_Booking: moment(this.state.bookDate).format('YYYY/MM/DD'),
		}
		this.props.bookingSlotDaywise(slotData, result => {
			this.setState({ showLoading: false })
			if (result.Code === 200) {
				this.setState({ timeSlots: result.Message[0].Slot_Detail || [] })
				if (slotData.Type_Of_Booking === 'H') {
					console.log(result.Message[0].Slot_Detail)
				} else {
					console.log(result.Message[0])
				}
			} else {
				console.log('')
			}
		})
	}

	setUserListData = (code, name, age, relationship, gender, mobile) => {
		this.setState({ userListData: { name, age, relationship, gender } }, () => {
			const getPatientList = {
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				UserName: mobile,
			}
			this.props.getUserAddressListDetails(getPatientList, result => {
				this.setState({ showLoading: false, selectedPtCode: code })
				if (result) {
					this.setState({
						selectedAddressType: this.props.patientAddressList[0].Address_Type_Code,
					})
				} else {
					console.log('')
				}
			})
			this.props.getCollectionCharges(
				{
					Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
					Bill_Amount: this.state.serviceTotal,
					Pt_Code: code,
				},
				(success, data) => {
					if (success) {
						if (this.state.visitType === 'H') {
							this.setState({ collectionCharges: data.Collection_Charge })
						} else {
							this.setState({ collectionCharges: 0 })
						}
						if (data.Promo_Code && data.Promo_Code.trim() !== '' && this.state.visitType === 'W') {
							this.setState({ promotion: data.Promo_Code }, () => {
								const serviceTotalDis =
									this.state.serviceTotal - this.state.serviceTotal * (data.Discount_In_Percent / 100)
								this.setState({
									promoApplied: true,
									promotionSelected: this.state.promotion,
									promoAppliedMsg: 'Promo Applied',
									promotionPercent: data.Discount_In_Percent,
									serviceTotalDis,
								})
							})
						} else {
							this.setState({
								promoApplied: false,
								promotion: '',
								promoAppliedMsg: '',
								promotionPercent: 0,
							})
						}
					}
				}
			)
		})
	}
	executeScroll = () => this.myRef && this.myRef.current.scrollIntoView()
	applyPromotion = () => {
		let trueValue = this.state.serviceSupportedPromo
		let falseValue = this.state.serviceNonSupportedPromo

		this.setState({ showPromotionLoading: true })
		const promotionData = {
			Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
			Username: this.props.patientList[0].Mobile_No,
			Promo_Code: this.state.promotion,
		}
		this.props.getPromotiontApplyDetails(promotionData, result => {
			this.setState({ showPromotionLoading: false })
			if (result.SuccessFlag === 'true') {
				// const serviceTotalDis =
				// 	this.state.serviceTotal - this.state.serviceTotal * (result.Message[0].Offer_Percentage / 100)

				let serviceTotalDis = Object.keys(trueValue)
					.map(item => trueValue[item].Amount)
					.reduce((_total, value) => _total + value, 0)
				let withOutDiscount = Object.keys(falseValue)
					.map(item => falseValue[item].Amount)
					.reduce((_total, value) => _total + value, 0)

				if (serviceTotalDis) {
					serviceTotalDis =
						withOutDiscount + serviceTotalDis - serviceTotalDis * (result.Message[0].Offer_Percentage / 100)
				}

				this.setState({
					totalServiceDiscountedAmount: serviceTotalDis,
					promoApplied: true,
					promotionSelected: this.state.promotion,
					promoAppliedMsg: 'Promo Applied',
					promotionPercent: result.Message[0].Offer_Percentage,
					serviceTotalDis,
				})
			} else {
				this.props.showNotification('Error', result.Message[0].Message, TOAST.TYPE_ERROR)
				this.setState({ promotion: '', promoAppliedMsg: 'Voucher Invalid!', promoApplied: false, promotionPercent: 0 })
				setTimeout(() => {
					this.setState({ promoAppliedMsg: '' })
				}, 3000)
			}
		})
	}

	visitTypeChange = (code, startDate, endDate) => {
		if (code === 'W') {
			this.setState({ phlebotomist: '' })
		}
		this.setState(
			{
				minDate: moment(startDate).format('YYYY-MM-DD'),
				maxDate: moment(endDate).format('YYYY-MM-DD'),
				visitType: code,
			},
			() => this.getSlot()
		)
		this.props.getCollectionCharges(
			{
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				Bill_Amount: this.state.serviceTotal,
				Pt_Code: this.state.selectedPtCode,
			},
			(success, data) => {
				if (success) {
					if (this.state.visitType === 'H') {
						this.setState({ collectionCharges: data.Collection_Charge })
					} else {
						this.setState({ collectionCharges: 0 })
					}
					if (data.Promo_Code && data.Promo_Code.trim() !== '' && this.state.visitType === 'W') {
						this.setState({ promotion: data.Promo_Code }, () => {
							const serviceTotalDis =
								this.state.serviceTotal - this.state.serviceTotal * (data.Discount_In_Percent / 100)
							this.setState({
								promoApplied: true,
								promotionSelected: this.state.promotion,
								promoAppliedMsg: 'Promo Applied',
								promotionPercent: data.Discount_In_Percent,
								serviceTotalDis,
							})
						})
					} else {
						this.setState({
							promoApplied: false,
							promotion: '',
							promoAppliedMsg: '',
							promotionPercent: 0,
							promotionSelected: '',
						})
					}
				}
			}
		)
	}

	setAddressListData = code => {
		this.setState({
			selectedAddressType: code,
		})
	}

	addService = (data, i) => {
		var trueValue = {}
		var falseValue = {}

		let serviceArr = this.state.service
		serviceArr.push({ data })

		trueValue = serviceArr
			.filter(item => item.data.Suppress_Discount === false)
			.reduce((obj, value) => {
				obj[value.data.Service_Code] = value.data
				return obj
			}, {})

		falseValue = serviceArr
			.filter(item => item.data.Suppress_Discount === true)
			.reduce((obj, value) => {
				obj[value.data.Service_Code] = value.data
				return obj
			}, {})

		this.setState({ service: serviceArr, serviceSupportedPromo: trueValue, serviceNonSupportedPromo: falseValue })

		let temp = this.props.testList
		temp.splice(i, 1)
		this.props.setTestListInStore(temp)
		let total = 0
		// for (let i = 0, _len = serviceArr.length; i < _len; i++) {
		// 	total += serviceArr[i]['data']['Amount']
		// }
		let withDiscount = Object.keys(trueValue)
			.map(item => trueValue[item].Amount)
			.reduce((_total, value) => _total + value, 0)
		let withOutDiscount = Object.keys(falseValue)
			.map(item => falseValue[item].Amount)
			.reduce((_total, value) => _total + value, 0)
		let totalValue = withDiscount + withOutDiscount
		console.log('before discount', withDiscount)

		if (withDiscount && this.state.promoApplied) {
			withDiscount = withDiscount - withDiscount * (this.state.promotionPercent / 100)
		}
		console.log('withDiscount', withDiscount)
		console.log('withOutDiscount', withOutDiscount)
		total = withDiscount + withOutDiscount

		this.props.getCollectionCharges(
			{
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				Bill_Amount: total,
				Pt_Code: this.state.selectedPtCode,
			},
			(success, data) => {
				if (success) {
					if (this.state.visitType === 'H') {
						this.setState({ collectionCharges: data.Collection_Charge })
					} else {
						this.setState({ collectionCharges: 0 })
					}

					if (data.Promo_Code && data.Promo_Code.trim() !== '' && this.state.visitType === 'W') {
						this.setState({ promotion: data.Promo_Code }, () => {
							const serviceTotalDis =
								this.state.serviceTotal - this.state.serviceTotal * (data.Discount_In_Percent / 100)
							this.setState({
								promoApplied: true,
								promotionSelected: this.state.promotion,
								promoAppliedMsg: 'Promo Applied',
								promotionPercent: data.Discount_In_Percent,
								totalServiceDiscountedAmount: serviceTotalDis,
								serviceTotal: totalValue,
							})
						})
					} else {
						if (this.state.promoApplied) {
							this.setState({ totalServiceDiscountedAmount: total })
						}
						// this.setState({
						// 	promoApplied: false,
						// 	promotion: '',
						// 	promoAppliedMsg: '',
						// 	promotionSelected: '',
						// 	promotionPercent: 0,
						// })
					}
					// total = total + data.Collection_Charge
				}
			}
		)

		this.setState({
			service: serviceArr,
			serviceTotal: totalValue,
			searchTest: '',
		})
	}

	removeService = data => {
		let tempServiceCode = this.state.service[data]?.data?.Service_Code
		let arr = this.state.service
		const spliceData = arr.splice(data, 1)

		let trueValue = this.state.serviceSupportedPromo
		let falseValue = this.state.serviceNonSupportedPromo
		console.log('temp service out', tempServiceCode)
		if (tempServiceCode >= 0) {
			if (trueValue.hasOwnProperty(tempServiceCode)) delete trueValue[tempServiceCode]
			console.log(trueValue.hasOwnProperty(tempServiceCode))
			if (falseValue.hasOwnProperty(tempServiceCode)) delete falseValue[tempServiceCode]
		}

		let temp = this.props.testList
		temp.push(spliceData[0].data)
		this.props.setTestListInStore(temp)
		let total = 0
		// for (let i = 0, _len = arr.length; i < _len; i++) {
		// 	total += arr[i]['data']['Amount']
		// }
		let withDiscount = Object.keys(trueValue)
			.map(item => trueValue[item].Amount)
			.reduce((_total, value) => _total + value, 0)
		let withOutDiscount = Object.keys(falseValue)
			.map(item => falseValue[item].Amount)
			.reduce((_total, value) => _total + value, 0)
		let totalValue = withDiscount + withOutDiscount

		if (withDiscount && this.state.promoApplied) {
			withDiscount = withDiscount - withDiscount * (this.state.promotionPercent / 100)
		}

		console.log('withDiscount', withDiscount)
		console.log('withOutDiscount', withOutDiscount)
		total = withDiscount + withOutDiscount
		this.props.getCollectionCharges(
			{
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				Bill_Amount: total,
				Pt_Code: this.state.selectedPtCode,
			},
			(success, data) => {
				if (success) {
					if (this.state.visitType === 'H') {
						this.setState({ collectionCharges: data.Collection_Charge })
					} else {
						this.setState({ collectionCharges: 0 })
					}

					if (data.Promo_Code && data.Promo_Code.trim() !== '' && this.state.visitType === 'W') {
						this.setState({ promotion: data.Promo_Code }, () => {
							const serviceTotalDis =
								this.state.serviceTotal - this.state.serviceTotal * (data.Discount_In_Percent / 100)
							this.setState({
								promoApplied: true,
								promotionSelected: this.state.promotion,
								promoAppliedMsg: 'Promo Applied',
								promotionPercent: data.Discount_In_Percent,
								totalServiceDiscountedAmount: serviceTotalDis,
							})
							this.setState({
								serviceSupportedPromo: trueValue,
								serviceNonSupportedPromo: falseValue,
								service: arr,
							})
						})
					} else {
						if (this.state.promoApplied) {
							this.setState({
								totalServiceDiscountedAmount: total,
							})
						}

						// this.setState({
						// 	promoApplied: false,
						// 	promotion: '',
						// 	promotionSelected: '',
						// 	promoAppliedMsg: '',
						// 	promotionPercent: 0,
						// })
					}
				}
			}
		)
		// this.setState({serviceTotal: total})

		this.setState({
			serviceSupportedPromo: trueValue,
			serviceNonSupportedPromo: falseValue,
			service: arr,
			searchTest: '',
			serviceTotal: totalValue,
		})
	}

	addBookTest = () => {
		let arrService = []
		let total = this.state.serviceTotal
		this.setState({
			amountToPay: this.state.promoApplied
				? total - (this.state.serviceTotal * this.state.promotionPercent) / 100
				: total,
		})
		this.state.service.forEach(item => {
			arrService.push({
				Service_Code: item.data.Service_Code,
				Service_Amount: item.data.Amount,
				Service_Discount:
					item.data.Suppress_Discount === false && this.state.promoApplied
						? (item.data.Amount * this.state.promotionPercent) / 100
						: 0,
			})
		})

		if (isEmptyArray(arrService) || isEmptyString(this.state.bookTime) || isEmptyString(this.state.bookDate)) {
			this.setState({ hasError: true })
			if (isEmptyString(this.state.bookTime)) {
				this.props.showNotification('Warning', 'Please select slot time', TOAST.TYPE_ERROR)
			}
			if (isEmptyArray(arrService)) {
				this.props.showNotification('Warning', 'Please select services', TOAST.TYPE_ERROR)
			}
		} else {
			this.setState({ showLoading: true })
			let time = moment(this.state.bookTime.trim(), ['h:mm A']).format('HH:mm')
			const searchData = {
				Sample_Collect_Charge: this.state.collectionCharges,
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				Username: this.props.location.state.User_Login_Name,
				Booking_Type: this.state.visitType,
				Firm_No: store.get('userSession').Message[0].Firm_No,
				Visit_Date: moment(this.state.bookDate).format('YYYY/MM/DD'),
				Visit_Time: time,
				Pt_Code: this.state.selectedPtCode,
				Address_Type: this.state.selectedAddressType,
				Service_Reg_Data: arrService,
				Pay_Mode: this.state.paymentMode,
				Promo_Code: this.state.promotionSelected,
				Collector_Code: this.state.phlebotomist,
			}
			this.props.bookTest(searchData, result => {
				this.setState({ showLoading: false })
				if (result.SuccessFlag === 'true') {
					this.props.showNotification('Success', result.Message && result.Message[0].Description, TOAST.TYPE_SUCCESS)
					this.setState(
						{
							showConfirmation: true,
							bookingNumber: result.Message[0].Booking_No,
							userListData: {},
							userData: {},
							maxDate: '',
							serviceTotal: 0,
							collectionCharges: 0,
							service: [],
							minDate: '',
							promotionSelected: '',
							visitType: '',
							promoApplied: false,
							promoAppliedMsg: '',
							promotion: '',
							promotionPercent: 0,
							paymentMode: 'C',
							phlebotomist: '',
							bookType: '',
							bookTime: '',
							bookDate: moment(new Date()).format('YYYY-MM-DD'),
						},
						() => this.executeScroll()
					)
					this.props.history.push(PATH.BOOK_TEST)
				} else {
					this.props.showNotification('Error', result.Message[0].Message, TOAST.TYPE_ERROR)
				}
			})
		}
	}

	removeCoupenCode = () => {
		const { serviceTotal } = this.state
		this.setState({
			serviceTotalDis: serviceTotal,
			promotionPercent: 0,
			promotionSelected: '',
			promotion: '',
			promoApplied: false,
			promoAppliedMsg: '',
		})
	}

	render() {
		const { maxDate, minDate, visitType, selectedPtCode, selectedAddressType } = this.state
		return (
			<>
				<Head
					name={this.state.userData.name}
					image={this.state.userData.image}
					age={this.state.userData.age}
					gender={this.state.userData.gender}
				/>
				<div className='main-content overflow-auto pb-3 bg-white'>
					<div className='container-fluid'>
						<div className='row'>
							<div className='col-12'>
								<div className='px-lg-3'>
									<div className='bg-dark mb-4'>
										<div className='row p-3'>
											<div className='col-lg-6 align-self-center' />
											<div className='col-lg-6 mt-lg-0 mt-3 d-flex justify-content-lg-end align-items-center'>
												<div className='lab-details'>
													<div className='res-width lab-listed d-flex d-flex justify-content-between align-self-center align-items-center '>
														<span className='badge badge-blue bg-blue rounded-circle text-white mr-2'>1</span>
														<h6 className='mb-0 text-blue font-weight-normal mr-2'>Lab Test Details</h6>
														<span className=' d-flex '>
															<i className='far fa-check-circle text-success ' />
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className='d-flex flex-wrap'>
											<div className='col-md-6 col-sm-4 mb-3'>
												<div className='Test-Details '>
													<div className=''>
														<h6 className='text-gray font-weight-bold'>Search Test</h6>
														<div className='input-group Search-width my-3'>
															<input
																type='text'
																className='form-control border-0 p-4'
																placeholder='Search or Add'
																name='searchTest'
																value={this.state.searchTest}
																onChange={e => {
																	this.setState({ searchTest: e.target.value })
																	this.getTest(e.target.value)
																}}
															/>
															<div className='input-group-btn'>
																<button className='btn btn-secondary' type='submit'>
																	<i className='far fa-search text-white' />
																</button>
															</div>
														</div>
														{this.state.hasError && isEmptyArray(this.state.service) && (
															<div>
																<small className='text-danger'>Select an Service to Continue</small>
															</div>
														)}
														{this.state.service &&
															this.state.service.map((item, i) => {
																return (
																	<button
																		key={i}
																		type='button'
																		className='btn btn-sm btn-primary button-tag'
																		onClick={() => this.removeService(i)}
																		style={{ marginRight: '10px', marginBottom: '10px' }}
																	>
																		{item.data.Service_Name}
																		<span className='badge badge-close'>
																			<i className='far fa-times' />
																		</span>
																	</button>
																)
															})}

														<div className='card col-lg-10 col-sm-12 my-3'>
															<div className='row'>
																<div className='card-body'>
																	<ul className='list-group patient-listtag text-color bookTest-testFilter'>
																		<p className='fa-md'>Lab Test</p>
																		{this.props.testList &&
																			this.props.testList.map((item, i) => {
																				return (
																					<li key={i}>
																						{/* <span onClick={() => this.addService(item.Service_Code, item.Amount)}>
																							<i 
																								className='fal fa-plus' 
																								
																							/>
																						</span> */}
																						<button
																							key={i}
																							type='button'
																							className='btn btn-sm btn-secondary fal fa-plus'
																							onClick={() => this.addService(item, i)}
																							style={{ marginRight: '10px' }}
																						>
																							{item.code}
																						</button>
																						{item.Service_Name}
																					</li>
																				)
																			})}
																		{!this.props.testList.length ? (
																			<li>
																				<small>No search results</small>
																			</li>
																		) : null}
																		{/* <li>
																			<span>
																				<i className='fal fa-plus' />
																			</span>
																			Fasting Blood Sugar or Glucose
																		</li> */}
																	</ul>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className='col-md-6 col-sm-4 mb-3'>
												<div className='Test-Details'>
													<h6 className='text-gray font-weight-bold'>Choose Phlebotomist</h6>
													<div className='dropdown my-3'>
														<FormGroup>
															<Input
																className='col-sm-12 p-2 dropdown-toggle patient-dropdown d-flex justify-content-between align-items-center bg-white'
																type='select'
																placeholder='Select'
																name='phlebotomist'
																value={this.state.phlebotomist}
																onChange={e => this.handleChange(e)}
																disabled={visitType === 'W'}
															>
																<option value=''>Select Phlebotomist</option>
																{this.props.phlebotomistList &&
																	this.props.phlebotomistList.map((item, i) => {
																		return (
																			<option value={item.Collector_Code} key={i}>
																				{item.Collector_Name}
																			</option>
																		)
																	})}
															</Input>
														</FormGroup>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className='bg-dark mb-4'>
										<div className='row p-3'>
											<div className='col-lg-6 align-self-center' />
											<div className='col-lg-6 mt-lg-0 mt-3 d-flex justify-content-lg-end align-items-center'>
												<div className='lab-details'>
													<div className='res-width lab-listed d-flex d-flex justify-content-between align-self-center align-items-center '>
														<span className='badge badge-blue bg-blue rounded-circle text-white mr-2'>2</span>
														<h6 className='mb-0 text-blue font-weight-normal mr-2'>Date and Time</h6>
														<span className=' d-flex '>
															<i className='far fa-check-circle text-success ' />
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className='d-flex flex-wrap py-4'>
											<div className='col-md-6 col-sm-4 mb-3'>
												<div className='Vist-type'>
													<div className=' '>
														<h6 className='text-color mb-3 font-weight-bold'>Visit type</h6>
														<div className='form-control res-width w-50'>
															{this.props.bookingTypeList &&
																this.props.bookingTypeList.map((item, i) => {
																	// Remove Direct Visit Type
																	if (item.Booking_Type_Code !== 'L') {
																		return (
																			<div className='form-check form-check-inline' key={i}>
																				<input
																					className='form-check-input'
																					type='radio'
																					name='bookType'
																					id={item.Booking_Type_Code}
																					value={item.Booking_Type_Code}
																					checked={item.Booking_Type_Code === visitType}
																					onClick={() =>
																						this.visitTypeChange(
																							item.Booking_Type_Code,
																							item.Slot_Start_Date,
																							item.Slot_End_Date
																						)
																					}
																				/>
																				<label className='form-check-label text-black' htmlFor={item.Booking_Type_Code}>
																					{item.Type_Of_Booking}
																				</label>
																			</div>
																		)
																	}
																})}
														</div>
													</div>
												</div>
											</div>
											<div className='col-md-6 col-sm-4 mb-3'>
												<div className='row'>
													<div className='Vist-type col-sm-6 '>
														<div className='position-relative mob-width'>
															<h6 className='text-color mb-3 font-weight-bold'>Date</h6>
															<FormGroup>
																<DatePicker
																	name='bookDate'
																	value={this.state.bookDate}
																	onChange={e =>
																		this.setState({ bookDate: moment(e).format('YYYY-MM-DD') }, () => this.getSlot())
																	}
																	maxDate={maxDate}
																	minDate={minDate}
																	dateFormat='DD/MM/YYYY'
																	showClearButton={false}
																/>
															</FormGroup>
															{this.state.hasError && isEmptyString(this.state.bookDate) && (
																<div>
																	<small className='text-danger'>Select an Date</small>
																</div>
															)}
														</div>
													</div>
													<div className='Vist-type col-sm-6'>
														<div className='position-relative mob-width ml-sm-n3'>
															<h6 className='text-color mb-3 font-weight-bold'>Time</h6>
															<select
																className='form-control'
																name='bookTime'
																value={this.state.bookTime}
																onChange={e => this.handleChange(e)}
															>
																<option>Select time slot</option>
																{this.state.timeSlots.map((item, i) => {
																	return (
																		<option key={i} value={item.Slot_Time}>
																			{item.Slot_Time}
																		</option>
																	)
																})}
															</select>
															{/* <FormGroup>
																<Input type='time' name='bookTime' onChange={e => this.handleChange(e)} />
															</FormGroup> */}
															{this.state.hasError && isEmptyString(this.state.bookTime) && (
																<div>
																	<small className='text-danger'>Select an Time</small>
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className='bg-dark mb-4'>
										<div className='row p-3'>
											<div className='col-lg-6 align-self-center' />
											<div className='col-lg-6 mt-lg-0 mt-3 d-flex justify-content-lg-end align-items-center'>
												<div className='lab-details'>
													<div className='res-width lab-listed d-flex d-flex justify-content-between align-self-center align-items-center '>
														<span className='badge badge-blue bg-blue rounded-circle text-white mr-2'>3</span>
														<h6 className='mb-0 text-blue font-weight-normal mr-2'>Update User Details</h6>
														<span className=' d-flex '>
															<i className='far fa-check-circle text-success ' />
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className='d-sm-flex flex-wrap my-3'>
											<div className=' d-flex col-lg-6 col-md-12 col-sm-12 mob-width' style={{}}>
												<div className='Vist-type ' style={{ overflowX: 'auto' }}>
													<h6 className='text-color mb-3 font-weight-bold'>Choose Patient</h6>
													<div className='d-sm-flex patient-web mb-3 '>
														{this.props.patientUserList &&
															this.props.patientUserList.map((item, i) => {
																return (
																	<div
																		key={i}
																		className='form-control d-sm-flex  patient-inner flex-wrap mr-2 mb-lg-0 mb-md-0 mb-3'
																	>
																		<div className='form-check form-check-inline mr-0 Patient-tag text-truncate'>
																			<img
																				src={
																					item.RelationShip_Name === 'Self'
																						? (this.state.userData && this.state.userData.User_Image_Url) || profile
																						: profile
																				}
																				alt=''
																				className='rounded-circle'
																				style={{ height: '20px', width: '20px' }}
																			/>
																			<label className='form-check-label mx-2' htmlFor={item.Pt_Code}>
																				{item.RelationShip_Name}
																			</label>
																			<input
																				className='form-check-input mr-0'
																				type='radio'
																				name='user'
																				id={item.Pt_Code}
																				checked={item.Pt_Code === selectedPtCode}
																				onChange={() =>
																					this.setUserListData(
																						item.Pt_Code,
																						item.Pt_Name,
																						item.Pt_First_Age,
																						item.RelationShip_Name,
																						item.Pt_Gender,
																						item.Pt_Mobile_No
																					)
																				}
																			/>
																		</div>
																	</div>
																)
															})}
													</div>
													<div className='w-75 res-width'>
														<div className='patient-details  p-2 my-3' style={{ maxWidth: 'max-content' }}>
															<ul className='list-group list-group-horizontal patient-name align-items-center'>
																<li>
																	<span className='border-right pr-3'>
																		{this.state.userListData.name}, {this.state.userListData.age}
																	</span>
																</li>
																<li>
																	<span className='border-right px-3'>{this.state.userListData.gender}</span>
																</li>
																<li>
																	<span className='pl-3'>{this.state.userListData.relationship}</span>
																</li>
															</ul>
														</div>
													</div>
												</div>
											</div>
											<div className=' d-flex col-lg-6 col-md-12  col-sm-12 mob-width' style={{}}>
												<div className='visit-edit'>
													<h6 className='text-color mb-3 font-weight-bold'>Choose Address</h6>
													<div className='row'>
														{this.props.patientAddressList &&
															this.props.patientAddressList.map((item, i) => {
																return (
																	<div key={i} className='col-sm-6 '>
																		<div className=' card mb-3  p-3 flex-row'>
																			<div className='form-check '>
																				<input
																					className='form-check-input'
																					type='radio'
																					name='selectedAddressType'
																					id={item.Address_Type_Code}
																					value={item.Address_Type_Code}
																					checked={selectedAddressType === item.Address_Type_Code}
																					onChange={() => this.setAddressListData(item.Address_Type_Code)}
																				/>

																				<label className='form-check-label' htmlFor={item.Address_Type_Code}>
																					{item.Address_Type_Desc}
																				</label>
																				<p className='text-gray mb-0 mt-1' style={{ fontSize: '13px' }}>
																					{item.Full_Address}
																				</p>
																			</div>
																			{/* <div className='d-flex'>
																				<span>
																					<i className='fal fa-pencil-alt' style={{ color: '#5A9ED8' }} />
																				</span>
																			</div> */}
																		</div>
																	</div>
																)
															})}
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className='bg-dark mb-4 pb-2'>
										<div className='row p-3'>
											<div className='col-lg-6 align-self-center'>
												<h6 className='mb-0 text-color font-weight-bold ml-3'>Payment Details</h6>
											</div>
											<div className='col-lg-6 mt-lg-0 mt-3 d-flex justify-content-lg-end align-items-center'>
												<div className='lab-details'>
													<div className='res-width lab-listed d-flex d-flex justify-content-between align-self-center align-items-center '>
														<span className='badge badge-blue bg-blue rounded-circle text-white mr-2'>4</span>
														<h6 className='mb-0 text-blue font-weight-normal mr-2'>Payment Details</h6>
														<span className=' d-flex '>
															<i className='far fa-check-circle text-success ' />
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className='d-sm-flex flex-wrap my-3'>
											<div className=' d-flex col-lg-6 col-md-12 col-sm-12 mob-width'>
												<div className='col-12'>
													<div className='d-flex justify-content-between'>
														<h6 className='text-color mb-1'>Payment Details</h6>
														<h6 className='text-color mb-1'>Amount(Rs)</h6>
													</div>
													<hr className='my-2' />
													<div className='patient-web mb-3 '>
														<div className='row'>
															{this.state.service &&
																this.state.service.map((item, i) => {
																	return (
																		<div className='col-sm-12' key={i}>
																			<div className='d-flex list-inline'>
																				<label className='flex-grow-1 text-color'>{item.data.Service_Name}</label>
																				<div className='justify-content-end'>
																					<p className='mb-0 text-color'>{item.data.Amount}</p>
																				</div>
																			</div>
																			<hr className='my-1' />
																		</div>
																	)
																})}
														</div>
														<div className='row'>
															<div className='col-sm-12'>
																<div className='d-flex list-inline'>
																	<label className='flex-grow-1 text-color'>Order Value</label>
																	<div className='justify-content-end d-flex'>
																		<p className='mb-0 mr-4 text-color text-danger'>
																			<del>
																				{this.state.promoApplied &&
																				Object.keys(this.state.serviceSupportedPromo).length > 0
																					? `${this.state.serviceTotal.toFixed(2)}`
																					: ''}
																			</del>
																		</p>
																		<p className='mb-0 text-color text-success'>
																			{this.state.promoApplied &&
																			Object.keys(this.state.serviceSupportedPromo).length > 0
																				? this.state.totalServiceDiscountedAmount.toFixed(2)
																				: this.state.serviceTotal.toFixed(2)}
																		</p>
																	</div>
																</div>
															</div>
														</div>
														<div className='row'>
															<div className='col-sm-12'>
																<div className='d-flex list-inline'>
																	<label className='col-form-label text-color flex-grow-1'>
																		Sample collection charges
																	</label>
																	<div className='justify-content-end'>
																		<p className='mb-0 text-color text-success'>
																			{this.state.collectionCharges.toFixed(2)}
																		</p>
																	</div>
																</div>
															</div>
														</div>
														<div className='row'>
															<div className='col-sm-12'>
																<div className='d-flex list-inline'>
																	<label className='col-form-label text-color flex-grow-1'>Amount Payable</label>
																	<div className='justify-content-end'>
																		<p className='mb-0 text-color text-success'>
																			{this.state.promoApplied
																				? (
																						this.state.totalServiceDiscountedAmount + this.state.collectionCharges
																				  ).toFixed(2)
																				: (this.state.serviceTotal + this.state.collectionCharges).toFixed(2)}
																		</p>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className=' d-flex col-lg-6 col-md-12  col-sm-12 mob-width'>
												<div className='row'>
													<div className='col-10'>
														<div className='visit-edit'>
															<h6 className='text-color mb-3'>
																Voucher Code{' '}
																{!this.state.showPromotionLoading && this.state.promotion ? (
																	<span
																		style={{
																			float: 'right',
																			color:
																				this.state.promoApplied &&
																				Object.keys(this.state.serviceSupportedPromo).length > 0
																					? 'green'
																					: 'red',
																		}}
																	>
																		{Object.keys(this.state.serviceSupportedPromo).length > 0
																			? this.state.promoAppliedMsg
																			: 'Discount is not applicable'}
																	</span>
																) : (
																	''
																)}
															</h6>
															<div className='form-group d-flex justify-content-between'>
																<InputGroup>
																	<input
																		type='text'
																		className='form-control bg-transparent patient-details'
																		placeholder='Voucher Code'
																		name='promotion'
																		value={this.state.promotion}
																		onChange={e => this.handleChange(e)}
																	/>
																	{!this.state.showPromotionLoading && this.state.promotion ? (
																		<span
																			className='fa fa-times-circle closeIcon'
																			onClick={() => this.removeCoupenCode()}
																		/>
																	) : (
																		''
																	)}
																	<InputGroupAddon addonType='append'>
																		<Button
																			color='secondary'
																			disabled={
																				this.state.showPromotionLoading ||
																				this.state.showPromotion ||
																				!this.state.promotion
																			}
																			onClick={() => this.applyPromotion()}
																		>
																			Apply
																			{this.state.showPromotionLoading && <Spinner size='sm' className='ml-2 m-1' />}
																		</Button>
																	</InputGroupAddon>
																</InputGroup>
															</div>
														</div>
													</div>
													<div className='col-10'>
														<div className='Vist-type mb-lg-0 mb-md-3 mb-3'>
															<div className=' '>
																<h6 className='text-color mb-3'>Payment Mode</h6>
																<div className='form-control res-width'>
																	<div className='form-check form-check-inline'>
																		<input
																			className='form-check-input'
																			type='radio'
																			name='paymentMode'
																			id='paymentModeCash'
																			checked={this.state.paymentMode === 'C'}
																			onChange={e => this.handleChange(e)}
																			value='C'
																		/>
																		<label className='form-check-label text-black' htmlFor='paymentModeCash'>
																			Cash
																		</label>
																	</div>
																	<div className='form-check form-check-inline'>
																		<input
																			className='form-check-input'
																			type='radio'
																			name='paymentMode'
																			id='paymentModeOnline'
																			checked={this.state.paymentMode === 'O'}
																			onChange={e => this.handleChange(e)}
																			value='O'
																		/>
																		<label className='form-check-label text-black' htmlFor='paymentModeOnline'>
																			Online
																		</label>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										{!this.state.showConfirmation ? (
											<div className='d-flex justify-content-end mr-4 my-5'>
												<button
													className='btn btn-sm btn-primary'
													onClick={() => this.addBookTest()}
													disabled={this.state.showLoading}
												>
													Book now {this.state.showLoading && <Spinner size='sm' className='ml-2 m-1' />}
												</button>
											</div>
										) : null}
									</div>
									{/* <div className='bg-dark mb-4'>
										<div className='row p-3'>
											<div className='col-lg-6 align-self-center'>
												<h6 className='mb-0 text-color font-weight-bold font-weight-bold ml-3'>Booking Confirmation</h6>
											</div>
											<div className='col-lg-6 mt-lg-0 mt-3 d-flex justify-content-lg-end align-items-center'>
												<div className='lab-details'>
													<div className='res-width lab-listed d-flex d-flex justify-content-between align-self-center align-items-center '>
														<span className='badge badge-blue bg-blue rounded-circle text-white mr-2'>5</span>
														<h6 className='mb-0 text-blue font-weight-normal mr-2'>Order Summary</h6>
														<span className=' d-flex '>
															<i className='far fa-check-circle text-success ' />
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className='d-sm-flex flex-wrap my-3'>
											<div className=' d-flex col-lg-6 col-md-12 col-sm-12 mob-width'>
												<div className='Vist-type col-lg-8 col-md-8 col-sm-12'>
													<h6 className='text-dark mb-3'>Your order has been processed successfully.</h6>
													<div className='d-flex justify-content-end flex-lg-row flex-column'>
														<div className='input-group'>
															<input
																type='text'
																className='form-control border-0 text-color'
																placeholder='link'
																value='Http.blit.aix/pay'
																name='q'
															/>
														</div>
														<button className='btn btn-sm btn-primary ml-lg-2 ml-md-0 ml-0 w-50 mt-lg-0 mt-md-3 mt-3'>
															Resend Link
														</button>
													</div>
													<button className='btn btn-sm btn-success mt-3'>Done</button>
													<h6 className='text-color mt-3'>
														Your booking will be confirmed once the payment is completed.
													</h6>
												</div>
											</div>
										</div>
									</div> */}

									{this.state.showConfirmation ? (
										<div className='bg-dark  mb-4 pb-2'>
											<div className='row p-3'>
												<div className='col-lg-6 align-self-center'>
													<h6 className='mb-0 text-color font-weight-bold font-weight-bold ml-3'>
														Booking Confirmation
													</h6>
												</div>
											</div>
											<div className='pl-5'>
												<p>
													Your booking has been confirmed, following is your booking number : {this.state.bookingNumber}{' '}
													{this.state.paymentMode !== 'C'
														? ', please complete the Payment through your mobile application.'
														: null}
												</p>
											</div>
											<div className='text-center'>
												<h6 className='mb-0 font-weight-bold'>
													{this.state.paymentMode === 'C' ? 'Pay in Cash' : 'Pay Online'}
												</h6>
											</div>
											<div className='d-flex justify-content-center align-items-center'>
												<div className='amount-paid p-2 my-3 text-white'>Amount to be paid</div>
												<div className='patient-details p-2 my-4 bg-blue'>
													<ul className='list-group list-group-horizontal patient-name'>
														<li className='text-white'>Rs. {this.state.amountToPay}</li>
													</ul>
												</div>
											</div>
											<div className='d-flex justify-content-end mr-4 mb-3'>
												<button
													ref={this.myRef}
													className='btn btn-sm btn-secondary'
													onClick={() => this.props.history.push(PATH.BOOK_TEST)}
												>
													Go Back
												</button>
											</div>
										</div>
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}
}

/**
 * Map all reducer state to the props of the component
 * @param {Object} state
 */
const mapStateToProps = state => {
	return {
		phlebotomistList: state.bookingDetailsState.phlebotomistList,
		bookingTypeList: state.bookingDetailsState.bookingTypeList,
		patientUserList: state.bookTestState.patientUserList,
		patientList: state.bookTestState.patientList,
		patientAddressList: state.bookTestState.userAddressList,
		testList: state.bookingDetailsState.testList,
	}
}

BookNewone.propTypes = {
	phlebotomistList: PropTypes.array,
	testList: PropTypes.array,
	bookingTypeList: PropTypes.array,
	patientUserList: PropTypes.array,
	patientList: PropTypes.array,
	patientAddressList: PropTypes.array,
	getPhlebotomistDetails: PropTypes.func,
	getBookingTypeDetails: PropTypes.func,
	getPatientListDetails: PropTypes.func,
	setUserListData: PropTypes.func,
	getUserAddressListDetails: PropTypes.func,
	getPatientDetails: PropTypes.func,
	getTestDetails: PropTypes.func,
	getPromotiontApplyDetails: PropTypes.func,
	bookTest: PropTypes.func,
	location: PropTypes.string,
	showNotification: PropTypes.func,
	history: PropTypes.object,
	bookingSlotDaywise: PropTypes.func,
	resetToInitialState: PropTypes.func,
	setTestListInStore: PropTypes.func,
	getCollectionCharges: PropTypes.func,
}

export default Layout(BookNewone, mapStateToProps, {
	getPhlebotomistDetails,
	getBookingTypeDetails,
	getPatientListDetails,
	getPatientDetails,
	getUserAddressListDetails,
	getTestDetails,
	getPromotiontApplyDetails,
	bookTest,
	showNotification,
	bookingSlotDaywise,
	resetToInitialState,
	setTestListInStore,
	getCollectionCharges,
})
