/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Component, useEffect, useState } from 'react'
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
import { useSelector } from 'react-redux'

const BookNew = props => {
	let myRef = React.createRef()
	//State
	const bookTestState = useSelector(state => state.bookTestState)
	const bookingDetailsState = useSelector(state => state.bookingDetailsState)
	//Patient Details
	const patientList = bookTestState.patientList
	//Booking Types - W,H
	const bookingTypeList = bookingDetailsState.bookingTypeList
	const phlebotomistList = bookingDetailsState.phlebotomistList
	//UserAddressList
	const userAddressList = bookTestState.userAddressList
	//User Defined
	const [patientCode, setPatientCode] = useState(props.location.state.patientCode)
	const [getPatient, setGetPatient] = useState({
		Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
		Pt_Code: patientCode,
	})
	const [selectedPtCode, setSelectedPtCode] = useState({ selectedPtCode: patientCode })
	const [bookingTypeDetails, setBookingTypeDetails] = useState({})
	const [slotTime, setSlotTime] = useState([])
	const [patientDetails, setPatinetDetails] = useState([])
	//Selected PhlebotomistList
	const [searchTestValue, setSearchTestValue] = useState('')
	const [selectedPhlebotomistList, setSelectedPhlebotomistList] = useState('')
	const [testCollection, setTestCollection] = useState([])
	const [selectedValue, setSelectedValue] = useState([])
	const [amountWithDisCount, setAmountWithDisCountotalValues] = useState(0)
	const [amountWithoutDisCount, setAmountWithoutDisCount] = useState(0)
	const [totalValues, settotalValues] = useState(0)
	const [collectionCharges, setCollectionCharges] = useState({ Collection_Charge: 0 })
	const [totalDiscount, setTotalDiscount] = useState(0)
	const [timeSlotSelected, settimeSlotSelected] = useState('')
	const [bookingSlot, setBookingSlot] = useState(moment(new Date()).format('YYYY-MM-DD'))
	const [promoCode, setPromoCode] = useState('')
	const [addressListData, setAddressListData] = useState({})
	const [promocodeDetails, setPromoCodeDetails] = useState({
		Availed_Times: 0,
		Coupon_Code: '',
		Coupon_Desc: '',
		Coupon_Heading: '',
		Offer_Percentage: 0,
		Offer_Times: 0,
		Validity_ToDate: '',
	})
	const [choosePatient, setChoosePatient] = useState({})
	const [selectedAddressType, setSelectedAddressType] = useState([])
	const [promocodeStatus, setPromoCodeStatus] = useState(false)
	const [promoloader, setPromoLoader] = useState(false)
	const [invoiceLoading, setInvoiceLoading] = useState(false)
	const [promoMsg, setPromoMsg] = useState('')
	//single book type
	const [defaultAddress, setDetfaultAddress] = useState({})
	const [defaultPatientLogin, setDetfaultPatientLogin] = useState({})
	const [paymentmode, setPaymentMode] = useState('C')
	const [hasError, setHasError] = useState(false)
	const [showConfirmation, setShowConfirmation] = useState(false)
	const [bookingNumber, setBookingNumber] = useState(0)
	const [visitTypeSelected, setVisitTypeSelected] = useState('')

	console.log(promocodeDetails)

	useEffect(() => {
		props.patientUserList &&
			props.patientUserList.length &&
			props.patientUserList.forEach(values => {
				if (values.Pt_Code == patientList[0].Patient_ID) {
					setDetfaultPatientLogin(values)
				}
			})
	}, [props.patientUserList])

	useEffect(() => {
		setSelectedAddressType(bookTestState.userAddressList)
		setAddressListData(
			bookTestState.userAddressList &&
				bookTestState.userAddressList.length &&
				bookTestState.userAddressList[0].Address_Type_Code
		)
		setDetfaultAddress(
			bookTestState.userAddressList && bookTestState.userAddressList.length && bookTestState.userAddressList[0]
		)
	}, [bookTestState.userAddressList])

	//Get Patient Details
	useEffect(() => {
		props.getPatientDetails(getPatient, result => {
			if (result) console.log('')
		})
	}, [getPatient])

	useEffect(() => {
		//For Booking Type
		props.getBookingTypeDetails({}, result => {
			//this.setState({ showLoading: false })
			if (result) {
				console.log('')
			}
		})

		//For Get Booking Slot Availability
		const slotData = {
			Type_Of_Booking: 'H',
			Date_Of_Booking: moment(new Date()).format('YYYY/MM/DD'),
		}
		setVisitTypeSelected(slotData.Type_Of_Booking)
		props.bookingSlotDaywise(slotData, result => {
			//this.setState({ showLoading: false })
			if (result && result.Code === 200) {
				setSlotTime(result.Message[0].Slot_Detail)
				if (slotData.Type_Of_Booking === 'H') {
					console.log('')
				} else {
					console.log('')
				}
			} else {
				console.log('')
			}
		})
		//To Get PhlebotomistDetails
		props.getPhlebotomistDetails({}, result => {
			if (result) console.log('')
		})
	}, [])

	//Booking Type List
	useEffect(() => {
		bookingTypeList &&
			bookingTypeList.length &&
			setBookingTypeDetails({
				minDate: moment(bookingTypeList[0].Slot_Start_Date).format('YYYY-MM-DD'),
				maxDate: moment(bookingTypeList[0].Slot_End_Date).format('YYYY-MM-DD'),
				visitType: bookingTypeList[0].Booking_Type_Code,
			})
	}, [bookingTypeList])

	//To Get Slot time based on visit type

	useEffect(() => {
		getSlot(bookingTypeDetails)
	}, [bookingTypeDetails])

	// Get Patient Details
	useEffect(() => {
		console.log('')
		if (patientList && patientList.length) {
			const getPatientList = {
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				UserName: patientList[0].User_Name,
			}
			props.getPatientListDetails(getPatientList, (result, data) => {
				//console.log(data.find(o => o.name === 'string 1'))
				setPatinetDetails(data)
				if (result) {
					if (result) {
						props.getUserAddressListDetails(getPatientList, result => {
							//this.setState({ showLoading: false })
							if (result) {
								// setSelectedAddressType(
								//  props.patientAddressList[0].Address_Type_Code,
								// )
								console.log('success')
							} else {
								console.log('')
							}
						})
					} else {
						props.showNotification('Error', 'Invalid Username or Patient not found', TOAST.TYPE_ERROR)
						props.history.push(PATH.BOOK_TEST)
					}
				}
			})
		}
	}, [patientList])

	//Calls the Api to collect test data
	const fetchData = inputValue => {
		const searchData = {
			Search_Text: inputValue,
			Start_Index: 1,
			Page_Count: 100,
		}
		props.getTestDetails(searchData, result => {
			if (result) {
				console.log('')
			}
		})
	}

	//Add new Test data
	const addService = (item, i) => {
		console.log('')
		const found = selectedValue.find(element => element.Service_Code == item.Service_Code)
		if (found == undefined) {
			setSelectedValue([...selectedValue, item])
			setSearchTestValue('')
			let newSelectedVal = props.testList
			newSelectedVal.splice(i, 1)
			if (promocodeStatus == false) {
				setPromoCode('')
			}
		} else {
			setSearchTestValue('')
			props.showNotification('Error', 'Test Exsists', TOAST.TYPE_ERROR)
		}
	}

	//Remove the pre selected Tests
	const removeOldService = value => {
		let newSelectedVal = selectedValue
		newSelectedVal.splice(value, 1)
		setSelectedValue([...newSelectedVal])
	}

	//Recall Selected Values
	const recallValues = () => {
		let tempSelected = selectedValue
		setSelectedValue([...tempSelected])
	}

	//Sample Collection Charges
	const sampleCollectionCharges = sum => {
		console.log('')
		if (bookingTypeDetails.visitType === 'W') {
			setCollectionCharges({ Collection_Charge: 0 })
			settotalValues(sum + 0)
		} else {
			props.getCollectionCharges(
				{
					Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
					Bill_Amount: sum,
					Pt_Code: getPatient.Pt_Code,
				},
				(success, data) => {
					if (success) {
						setCollectionCharges({ Collection_Charge: data.Collection_Charge })
						settotalValues(sum + data.Collection_Charge)
						//recallValues()
					}
				}
			)
		}
	}

	//Calculate Amount
	useEffect(() => {
		if (selectedValue && selectedValue.length <= 0) {
			setCollectionCharges({ Collection_Charge: 0 })
			setVisitTypeSelected('H')
			removeCoupenCode()
		}
		//alert(promoCode)
		if (promoCode == '' || promoCode == null) {
			let sum = 0
			selectedValue &&
				selectedValue.length &&
				selectedValue.forEach(values => {
					values.Service_Amount ? (sum += values.Service_Amount) : (sum += values.Amount)
					setAmountWithoutDisCount(sum)
				})
			return sampleCollectionCharges(sum)
		} else if ((promoCode != '' && promocodeDetails.Offer_Percentage > 0) || promocodeDetails.Discount_In_Percent > 0) {
			setPromoCodeStatus(true)
			let sum = 0
			let discount = 0
			selectedValue &&
				selectedValue.length &&
				selectedValue.forEach(values => {
					values.Service_Amount ? (sum += values.Service_Amount) : (sum += values.Amount)

					values.Service_Discount
						? (discount += values.Service_Discount)
						: values.Suppress_Discount == false
						? (discount +=
								(values.Amount *
									(promocodeDetails.Offer_Percentage
										? promocodeDetails.Offer_Percentage
										: promocodeDetails.Discount_In_Percent
										? promocodeDetails.Discount_In_Percent
										: 100)) /
								100)
						: (discount += 0)

					setTotalDiscount(discount)
					setAmountWithoutDisCount(sum)
				})
			setAmountWithDisCountotalValues(sum - discount)
			return sampleCollectionCharges(sum - discount)
		}
	}, [selectedValue, promoCode])

	//Remove the Coupon Code
	const removeCoupenCode = () => {
		setPromoCode('')
		setPromoMsg('')
		setPromoCodeDetails({
			Availed_Times: 0,
			Coupon_Code: '',
			Coupon_Desc: '',
			Coupon_Heading: '',
			Offer_Percentage: 0,
			Offer_Times: 0,
			Validity_ToDate: '',
		})
		setPromoCodeStatus(false)
	}

	//Check For Coupon
	const checkForCoupon = () => {
		setPromoLoader(true)
		const promotionData = {
			Labadmin_Code: getPatient.Labadmin_Code,
			Username: patientList && patientList.length && patientList[0].Mobile_No,
			Promo_Code: promoCode.trim(),
		}
		props.getPromotiontApplyDetails(promotionData, result => {
			if (result.SuccessFlag === 'true') {
				setPromoCodeStatus(result.SuccessFlag)
				setPromoCodeDetails(result.Message[0])
				setPromoCode(result.Message[0].Coupon_Code)
				setPromoLoader(false)
				setPromoMsg('Promo Applied')
				recallValues()
			} else if (result.SuccessFlag === 'false') {
				setPromoCodeStatus(false)
				setPromoLoader(false)
				setPromoCode('')
				setPromoMsg('Voucher Invalid!')
				setPromoCodeDetails({
					Availed_Times: 0,
					Coupon_Code: '',
					Coupon_Desc: '',
					Coupon_Heading: '',
					Offer_Percentage: 0,
					Offer_Times: 0,
					Validity_ToDate: '',
				})
				recallValues()
				setPromoCodeStatus(false)
			}
		})
	}

	//Time Slot Selected
	const handleTimeSlot = e => {
		settimeSlotSelected(e)
	}

	//Time Booking for Selected Dates

	const getSlot = bookingSlot => {
		const slotData = {
			Type_Of_Booking: bookingTypeDetails.visitType,
			Date_Of_Booking: moment(bookingSlot).format('YYYY/MM/DD'),
		}
		props.bookingSlotDaywise(slotData, result => {
			//this.setState({ showLoading: false })
			if (result.Code === 200) {
				setSlotTime(result.Message[0].Slot_Detail)
				if (slotData.Type_Of_Booking === 'H') {
					console.log('')
				} else {
					console.log('')
				}
			} else {
				console.log('')
			}
		})
	}

	useEffect(() => {
		getSlot(bookingSlot)
	}, [bookingSlot])

	const callBookingSlotByDate = e => {
		setBookingSlot(moment(e).format('YYYY-MM-DD'))
	}

	const visitTypeChange = (code, startDate, endDate) => {
		// if (code === 'W') {
		// 	this.setState({ phlebotomist: '' })
		// }
		//alert(code)
		setVisitTypeSelected(code)
		setBookingSlot(moment(new Date()).format('YYYY-MM-DD'))
		settimeSlotSelected('')
		removeCoupenCode()
		setSelectedPhlebotomistList('')
		setBookingTypeDetails({
			minDate: moment(startDate).format('YYYY-MM-DD'),
			maxDate: moment(endDate).format('YYYY-MM-DD'),
			visitType: code,
		})
		props.getCollectionCharges(
			{
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				Bill_Amount: promocodeStatus ? amountWithDisCount : amountWithoutDisCount,
				Pt_Code: getPatient.Pt_Code,
			},
			(success, data) => {
				console.log('')
				if (success) {
					if (bookingTypeDetails.visitType === 'H') {
						setCollectionCharges({ Collection_Charge: data.Collection_Charge })
					} else {
						setCollectionCharges({ Collection_Charge: 0 })
						//this.setState({ collectionCharges: 0 })
					}
					console.log('')
					if (data.Promo_Code && data.Promo_Code.trim() !== '' && code === 'W') {
						setPromoCodeStatus(true)
						setPromoCodeDetails(data)
						setPromoCode(data.Promo_Code)
						setPromoLoader(false)
						setPromoMsg('Promo Applied')
						recallValues()
					} else {
						removeCoupenCode()
						recallValues()
					}
				}
			}
		)
	}

	useEffect(() => {
		removeCoupenCode()
		props.getCollectionCharges(
			{
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				Bill_Amount: promocodeStatus ? amountWithDisCount : amountWithoutDisCount,
				Pt_Code: getPatient.Pt_Code,
			},
			(success, data) => {
				//console.log(data)
				if (success) {
					if (bookingTypeDetails.visitType === 'H') {
						setCollectionCharges({ Collection_Charge: data.Collection_Charge })
					} else {
						setCollectionCharges({ Collection_Charge: 0 })
					}
					console.log('')
					if (data.Promo_Code && data.Promo_Code.trim() !== '' && visitTypeSelected === 'W') {
						setPromoCodeStatus(true)
						setPromoCodeDetails(data)
						setPromoCode(data.Promo_Code)
						setPromoLoader(false)
						setPromoMsg('Promo Applied')
					} else {
						removeCoupenCode()
						recallValues()
					}
				}
			}
		)
	}, [getPatient])

	const setUserListData = (code, name, age, relationship, gender, mobile) => {
		setSelectedPtCode({ selectedPtCode: code })
		setChoosePatient({ userListData: { name, age, relationship, gender } })
		const getPatientList = {
			Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
			UserName: mobile,
		}
		props.getUserAddressListDetails(getPatientList, result => {
			//this.setState({ showLoading: false, selectedPtCode: code })
			setGetPatient({
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				Pt_Code: code,
			})
			if (result) {
				console.log('k')
				//alert('k')
			} else {
				console.log('')
			}
		})
	}

	const finalCouponCode = () => {
		let finalPromo = promocodeDetails.Coupon_Code ? promocodeDetails.Coupon_Code : promocodeDetails.Promo_Code
		return finalPromo
	}

	const addBookTest = () => {
		let arrService = []
		console.log('')
		selectedValue.forEach(item => {
			arrService.push({
				Service_Code: item.Service_Code,
				Service_Amount: item.Amount,
				Service_Suppress_Discount: item.Suppress_Discount,
				Service_Discount:
					item.Suppress_Discount === false && promocodeDetails.Offer_Percentage
						? (item.Amount * promocodeDetails.Offer_Percentage) / 100
						: promocodeDetails.Discount_In_Percent
						? (item.Amount * promocodeDetails.Discount_In_Percent) / 100
						: 0,
			})
		})

		if (isEmptyArray(arrService) || isEmptyString(timeSlotSelected) || isEmptyString(bookingSlot)) {
			setHasError(true)
			if (isEmptyString(timeSlotSelected)) {
				props.showNotification('Warning', 'Please select slot time', TOAST.TYPE_ERROR)
			}
			if (isEmptyArray(arrService)) {
				props.showNotification('Warning', 'Please select services', TOAST.TYPE_ERROR)
			}
			if (isEmptyString(bookingSlot)) {
				props.showNotification('Warning', 'Please select slot date', TOAST.TYPE_ERROR)
			}
		} else if (isEmptyString(selectedPhlebotomistList) && bookingTypeDetails.visitType == 'H') {
			props.showNotification('Warning', 'Please select Phlebotomist', TOAST.TYPE_ERROR)
		} else {
			//this.setState({ showLoading: true })
			let time = moment(timeSlotSelected.trim(), ['h:mm A']).format('HH:mm')
			const searchData = {
				Sample_Collect_Charge: collectionCharges.Collection_Charge,
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				Username: props.location.state.User_Login_Name,
				Booking_Type: bookingTypeDetails.visitType,
				Firm_No: store.get('userSession').Message[0].Firm_No,
				Visit_Date: moment(bookingSlot).format('YYYY/MM/DD'),
				Visit_Time: time,
				Pt_Code: getPatient.Pt_Code,
				Address_Type: addressListData,
				Service_Reg_Data: arrService,
				Pay_Mode: paymentmode,
				Promo_Code: finalCouponCode(),
				Collector_Code: selectedPhlebotomistList,
			}
			console.log('')
			props.bookTest(searchData, result => {
				if (result.SuccessFlag === 'true') {
					console.log('success')
					props.showNotification('Success', result.Message && result.Message[0].Description, TOAST.TYPE_SUCCESS)
					setShowConfirmation(true)
					setPatientCode(null)
					setGetPatient({
						Labadmin_Code: '',
						Pt_Code: '',
					})
					setSelectedPtCode({ selectedPtCode: patientCode })
					setBookingTypeDetails({})
					setSlotTime([])
					setPatinetDetails([])
					setSearchTestValue('')
					setSelectedPhlebotomistList('')
					setTestCollection([])
					setSelectedValue([])
					setAmountWithDisCountotalValues(0)
					setAmountWithoutDisCount(0)
					settotalValues(0)
					setCollectionCharges({ Collection_Charge: 0 })
					setTotalDiscount(0)
					settimeSlotSelected('')
					setBookingSlot(moment(new Date()).format('YYYY-MM-DD'))
					setPromoCode('')
					setAddressListData({})
					setChoosePatient({})
					setSelectedAddressType([])
					setPromoCodeStatus(false)
					setPromoLoader(false)
					setInvoiceLoading(false)
					setPromoMsg('')
					setDetfaultAddress({})
					setDetfaultPatientLogin({})
					setPaymentMode('C')
					setHasError(false)
					setShowConfirmation(false)
					setBookingNumber(0)
					removeCoupenCode()
					props.history.push(PATH.BOOK_TEST)
				} else {
					props.showNotification('Error', result.Message[0].Message, TOAST.TYPE_ERROR)
				}
			})
		}
	}

	useEffect(() => {
		if (promocodeStatus) {
			sampleCollectionCharges(amountWithDisCount)
		} else {
			sampleCollectionCharges(amountWithoutDisCount)
		}
	}, [selectedAddressType])

	const handlePayment = e => {
		setPaymentMode(e)
	}

	useEffect(() => {
		//const [selectedPtCode, setSelectedPtCode] = useState({ selectedPtCode: patientCode })
		//alert(selectedPtCode.selectedPtCode)
	}, [selectedPtCode])

	return (
		<>
			<Head
				name={Object.keys(patientDetails).length ? defaultPatientLogin.Pt_Name : ''}
				image={Object.keys(patientDetails).length && defaultPatientLogin.Pt_Profile_Picture}
				age={Object.keys(patientDetails).length ? defaultPatientLogin.Pt_First_Age : ''}
				gender={Object.keys(patientDetails).length ? defaultPatientLogin.Pt_Gender : ''}
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
															value={searchTestValue}
															//value={}
															// onChange={e => {
															// 	this.setState({ searchTest: e.target.value })
															// 	this.getTest(e.target.value)
															// }}
															onChange={e => {
																setSearchTestValue(e.target.value)
																fetchData(e.target.value)
															}}
														/>
														<div className='input-group-btn'>
															<button className='btn btn-secondary' type='submit'>
																<i className='far fa-search text-white' />
															</button>
														</div>
													</div>
													{/* {this.state.hasError && isEmptyArray(this.state.service) && (
														<div>
															<small className='text-danger'>Select an Service to Continue</small>
														</div>
													// )} */}
													{selectedValue && selectedValue.length
														? selectedValue.map((item, i) => {
																return (
																	<button
																		key={i}
																		type='button'
																		className='btn btn-sm btn-primary button-tag'
																		onClick={() => removeOldService(i)}
																		style={{ marginRight: '10px', marginBottom: '10px' }}
																		disabled={
																			item.hasOwnProperty('item.Is_Editable_Service')
																				? !item.Is_Editable_Service || item.Is_Editable_Service === false
																				: false
																		}
																	>
																		{item.Service_Name}
																		<span className='badge badge-close'>
																			<i className='far fa-times' />
																		</span>
																	</button>
																)
														  })
														: ''}

													<div className='card col-lg-10 col-sm-12 my-3'>
														<div className='row'>
															<div className='card-body'>
																<ul className='list-group patient-listtag text-color bookTest-testFilter'>
																	<p className='fa-md'>Lab Test</p>
																	{props.testList &&
																		props.testList.map((item, i) => {
																			return (
																				<li key={i}>
																					{/* <span onClick={() => this.addService(item.Service_Code, item.Amount)}> */}
																					{/* <span>
																						<i className='fal fa-plus' />
																					</span> */}
																					<button
																						key={i}
																						type='button'
																						className='btn btn-sm btn-secondary fal fa-plus'
																						onClick={() => addService(item, i)}
																						style={{ marginRight: '10px' }}
																					>
																						{item.code}
																					</button>
																					{item.Service_Name}
																				</li>
																			)
																		})}
																	{props.testList.length == 0 ? (
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
															onChange={e => setSelectedPhlebotomistList(e.target.value)}
															//value={this.state.phlebotomist}
															//onChange={e => this.handleChange(e)}
															disabled={bookingTypeDetails.visitType === 'W'}
														>
															<option value=''>Select Phlebotomist</option>
															{bookingTypeDetails.visitType === 'H' &&
																phlebotomistList &&
																phlebotomistList.length &&
																phlebotomistList.map((val, key) => {
																	return (
																		<option key={key} value={val.Collector_Code}>
																			{val.Collector_Name}
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
													{selectedValue && selectedValue.length ? (
														<div className='form-control res-width w-50'>
															{bookingTypeList &&
																bookingTypeList.length &&
																bookingTypeList.map((item, i) => {
																	// Remove Direct Visit Type
																	if (item.Booking_Type_Code !== 'L') {
																		return (
																			<div className='form-check form-check-inline' key={i}>
																				<input
																					className='form-check-input mr-0'
																					type='radio'
																					name='bookType'
																					id={item.Booking_Type_Code}
																					//checked={visitTypeSelected}
																					defaultChecked={item.Booking_Type_Code === 'H'}
																					onChange={() => {
																						visitTypeChange(
																							item.Booking_Type_Code,
																							item.Slot_Start_Date,
																							item.Slot_End_Date
																						)
																					}}
																				/>
																				<label className='form-check-label text-black' htmlFor={item.Booking_Type_Code}>
																					{item.Type_Of_Booking}
																				</label>
																			</div>
																		)
																	}
																})}
														</div>
													) : (
														''
													)}
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
																value={bookingSlot}
																onChange={e => callBookingSlotByDate(e)}
																maxDate={bookingTypeDetails.maxDate}
																minDate={bookingTypeDetails.minDate}
																dateFormat='DD/MM/YYYY'
																showClearButton={false}
															/>
														</FormGroup>
														{/* {this.state.hasError && isEmptyString(this.state.bookDate) && (
															<div>
																<small className='text-danger'>Select an Date</small>
															</div>
														)} */}
													</div>
												</div>
												<div className='Vist-type col-sm-6'>
													<div className='position-relative mob-width ml-sm-n3'>
														<h6 className='text-color mb-3 font-weight-bold'>Time</h6>
														<select
															className='form-control'
															name='bookTime'
															value={timeSlotSelected}
															onChange={e => handleTimeSlot(e.target.value)}
														>
															<option>Select time slot</option>
															{slotTime && slotTime.length
																? slotTime.map((item, i) => {
																		return (
																			<option key={i} value={item.Slot_Time}>
																				{item.Slot_Time}
																			</option>
																		)
																  })
																: ''}
														</select>
														{/* <FormGroup>
																<Input type='time' name='bookTime' onChange={e => this.handleChange(e)} />
															</FormGroup> */}
														{/* {this.state.hasError && isEmptyString(this.state.bookTime) && (
															<div>
																<small className='text-danger'>Select an Time</small>
															</div>
														)} */}
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
													{props.patientUserList &&
														props.patientUserList.map((item, i) => {
															return (
																<div
																	key={i}
																	className='form-control d-sm-flex  patient-inner flex-wrap mr-2 mb-lg-0 mb-md-0 mb-3'
																>
																	<div className='form-check form-check-inline mr-0 Patient-tag text-truncate'>
																		<img
																			src={
																				item.RelationShip_Name === 'Self'
																					? item.Pt_Profile_Picture
																						? item.Pt_Profile_Picture
																						: profile
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
																			//checked={item.Pt_Code === selectedPtCode}
																			defaultChecked={item.Pt_Code === selectedPtCode.selectedPtCode}
																			onChange={() =>
																				setUserListData(
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
																	{patientList && patientList.length ? props.patientList[0].Patient_Name : ''} ,{' '}
																	{patientList && patientList.length ? props.patientList[0].First_Age : ''}
																</span>
															</li>
															<li>
																<span className='border-right px-3'>
																	{patientList && patientList.length ? props.patientList[0].Gender : ''}
																</span>
															</li>
															<li>
																<span className='pl-3'>
																	{patientList && patientList.length ? props.patientList[0].RelationShip_Name : ''}
																</span>
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
													{selectedAddressType &&
														selectedAddressType.length &&
														selectedAddressType.map((item, i) => {
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
																				defaultChecked={defaultAddress.Address_Type_Code === item.Address_Type_Code}
																				//defaultChecked={item.Pt_Code === selectedPtCode.selectedPtCode}
																				onChange={() => setAddressListData(item.Address_Type_Code)}
																			/>

																			<label className='form-check-label' htmlFor={item.Address_Type_Code}>
																				{item.Address_Type_Desc}
																			</label>
																			<p className='text-gray mb-0 mt-1' style={{ fontSize: '13px' }}>
																				{item.Full_Address}
																			</p>
																		</div>
																		<div className='d-flex'>
																			<span>
																				<i className='fal fa-pencil-alt' style={{ color: '#5A9ED8' }} />
																			</span>
																		</div>
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
														{/* {this.state.service &&
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
															})} */}
														{selectedValue && selectedValue.length
															? selectedValue.map((values, i) => {
																	return (
																		<div className='col-sm-12' key={i}>
																			<div className='d-flex list-inline'>
																				{values.Suppress_Discount==true ?<span style={{color:'red'}}>*</span>:'' }
																				
																				<label className='flex-grow-1 text-color'>{values.Service_Name}</label>
																				<div className='justify-content-end'>
																					<p className='mb-0 text-color'>{values.Amount}</p>
																				</div>
																			</div>
																			<hr className='my-1' />
																		</div>
																	)
															  })
															: ''}
													</div>
													<div className='row'>
														<div className='col-sm-12'>
															<div className='d-flex list-inline'>
																<label className='flex-grow-1 text-color'>Order Value</label>
																<div className='justify-content-end d-flex'>
																	<del style={{ color: 'red' }}>
																		<p className='mb-0 mr-4 text-color text-danger'>
																			{promocodeStatus && selectedValue && selectedValue.length
																				? amountWithoutDisCount.toFixed(2)
																				: ''}
																		</p>
																	</del>
																	<p className='mb-0 text-color text-success'>
																		{promocodeStatus
																			? selectedValue && selectedValue.length && amountWithDisCount.toFixed(2)
																			: selectedValue && selectedValue.length && amountWithoutDisCount.toFixed(2)}
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
																	{Object.keys(collectionCharges).length && collectionCharges.Collection_Charge > 0
																		? collectionCharges.Collection_Charge
																		: 0}
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
																		{selectedValue && selectedValue.length && totalValues.toFixed(2)}
																	</p>
																</div>
															</div>
														</div>
														<div className='col-sm-12'>
															<div className='d-flex list-inline mt-4'>
																<label className='col-form-label flex-grow-1'><h6>NOTE : <span style={{color:'red'}}>* - Indicates Non Discounted Test</span></h6></label>
																<div className='justify-content-end'>
																	<p className='mb-0 text-color text-success'>
																		
																	</p>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className=' d-flex col-lg-6 col-md-12  col-sm-12 mob-width'>
											{selectedValue && selectedValue.length ? (
												<div className='row'>
													<div className='col-10'>
														<div className='visit-edit'>
															<h6 className='text-color mb-3'>
																Voucher Code{' '}
																<span
																	className='ml-2'
																	style={{ float: 'right', color: promocodeStatus ? 'green' : 'red' }}
																>
																	{promoMsg}
																</span>
															</h6>
															<div className='form-group d-flex justify-content-between'>
																<InputGroup>
																	<input
																		type='text'
																		className='form-control bg-transparent patient-details'
																		placeholder='Voucher Code'
																		name='promotion'
																		onChange={e => {
																			setPromoCode(e.target.value)
																			setPromoMsg('')
																		}}
																		value={promoCode}
																		disabled={promocodeStatus}
																	/>
																	<span className='fa fa-times-circle closeIcon' onClick={() => removeCoupenCode()} />
																	<InputGroupAddon addonType='append'>
																		<Button color='secondary' disabled={promoloader} onClick={() => checkForCoupon()}>
																			Apply &nbsp;{promoloader ? <Spinner size='sm' className='ml-2 m-1' /> : <></>}
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
																			defaultChecked={paymentmode === 'C'}
																			onChange={e => handlePayment(e.target.value)}
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
																			defaultChecked={paymentmode === 'O'}
																			onChange={e => handlePayment(e.target.value)}
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
											) : (
												''
											)}
										</div>
									</div>
									{/* {!this.state.showConfirmation ? (
										<div className='d-flex justify-content-end mr-4 my-5'>
											<button
												className='btn btn-sm btn-primary'
												onClick={() => addBookTest()}
												disabled={this.state.showLoading}
											>
												Book Now
												Book now {this.state.showLoading && <Spinner size='sm' className='ml-2 m-1' />}
											</button>
										</div>
									) : null} */}


									{!showConfirmation ? (
										<div className='d-flex justify-content-end mr-4 my-5'>
											<button
												className='btn btn-sm btn-primary'
												onClick={() => addBookTest()}
												//disabled={this.state.showLoading}
											>
												Book Now
												{/* Book now {this.state.showLoading && <Spinner size='sm' className='ml-2 m-1' />} */}
											</button>
										</div>
									) : null}
								</div>

								{showConfirmation ? (
									<div className='bg-dark  mb-4 pb-2'>
										<div className='row p-3'>
											<div className='col-lg-6 align-self-center'>
												<h6 className='mb-0 text-color font-weight-bold font-weight-bold ml-3'>Booking Confirmation</h6>
											</div>
										</div>
										<div className='pl-5'>
											<p>
												Your booking has been confirmed, following is your booking number : {bookingNumber}{' '}
												{paymentmode !== 'C' ? ', please complete the Payment through your mobile application.' : null}
											</p>
										</div>
										<div className='text-center'>
											<h6 className='mb-0 font-weight-bold'>{paymentmode === 'C' ? 'Pay in Cash' : 'Pay Online'}</h6>
										</div>
										<div className='d-flex justify-content-center align-items-center'>
											<div className='amount-paid p-2 my-3 text-white'>Amount to be paid</div>
											<div className='patient-details p-2 my-4 bg-blue'>
												<ul className='list-group list-group-horizontal patient-name'>
													{/* <li className='text-white'>Rs. {this.state.amountToPay}</li> */}
												</ul>
											</div>
										</div>
										<div className='d-flex justify-content-end mr-4 mb-3'>
											<button
												ref={myRef}
												className='btn btn-sm btn-secondary'
												onClick={() => props.history.push(PATH.BOOK_TEST)}
											>
												Go Back
											</button>
										</div>
									</div>
								) : null}

								{/* already commented section <div className='bg-dark mb-4'>
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

								{/* {this.state.showConfirmation ? (
									<div className='bg-dark  mb-4 pb-2'>
										<div className='row p-3'>
											<div className='col-lg-6 align-self-center'>
												<h6 className='mb-0 text-color font-weight-bold font-weight-bold ml-3'>Booking Confirmation</h6>
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
								) : null} */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
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

BookNew.propTypes = {
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

export default Layout(BookNew, mapStateToProps, {
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
