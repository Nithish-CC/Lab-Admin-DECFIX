/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Input, InputGroup, InputGroupAddon, Button } from 'reactstrap'
import AsyncSelect from 'react-select/async'
import { connect } from 'react-redux'
import { getTestDetails, viewPrescription, viewInvoice, bookingUpdate } from '../../../actions/bookingDetailsAction'
import { getPromotiontApplyDetails, getCollectionCharges } from '../../../actions/bookTestAction'
import FileSaver from 'file-saver'
import { Spinner } from 'reactstrap'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { showNotification } from '../../../actions/commonAction'
import { TOAST } from '../../../utils/Constants'
import profile from '../../../assets/media/images/image.png'
import { isEmptyString, isEmptyArray } from '../../../utils/validations'
import store from 'store'
import _, { result, values } from 'lodash'
import moment from 'moment'
import { useSelector } from 'react-redux'
import searchTestApiCall from './searchTestapi'
import './style.css'

const ViewModal2 = props => {
	console.log(props)
	const [bookingDetail, setBookDetail] = useState({})
	const [phlebotomistList, setPhlebotomistList] = useState([])
	const [selectedPhlebotomistList, setSelectedPhlebotomistList] = useState('')
	const [bookingType, setBookingType] = useState('')
	const [serviceDetail, setServiceDetail] = useState([])
	const [promoCode, setPromoCode] = useState('')
	const [testCollection, setTestCollection] = useState({ value: '', label: '' })
	const state = useSelector(state => state.bookingDetailsState)
	const testListData = state.testList
	const [testList, setTestList] = useState(testListData)
	const [inputValue, setValue] = useState('a')
	const [selectedValue, setSelectedValue] = useState([])
	const [totalValues, settotalValues] = useState(0)
	const [collectionCharges, setCollectionCharges] = useState({})
	const [totalDiscount, setTotalDiscount] = useState(0)
	const [promocodeDetails, setPromoCodeDetails] = useState({
		Availed_Times: 0,
		Coupon_Code: '',
		Coupon_Desc: '',
		Coupon_Heading: '',
		Offer_Percentage: 0,
		Offer_Times: 0,
		Validity_ToDate: '',
	})
	const [promocodeStatus, setPromoCodeStatus] = useState(false)
	const [promoloader, setPromoLoader] = useState(false)
	const [hasError, setHasError] = useState(false)
	const [invoiceLoading, setInvoiceLoading] = useState(false)
	const [searchTestvalue, setSearchTestValue] = useState('')
	const [promoMsg, setPromoMsg] = useState('')

	useEffect(() => {
		const getTest = newValue => {
			const searchData = {
				Search_Text: newValue,
				Start_Index: 1,
				Page_Count: 100,
			}
			props.getTestDetails(searchData, result => {
				if (result) {
					let convertValue = []
					testList.filter(i => convertValue.push({ value: i, label: i.Service_Name }))
					setTestCollection(convertValue)
				}
			})
		}
		getTest('a')
		if (Object.keys(props).length) {
			//console.log(props)
			setBookDetail(props.bookingDetail)
			setPhlebotomistList(props.phlebotomistList)
			setSelectedPhlebotomistList(props.bookingDetail.Collector_Code)
			//To have intial selected test
			setServiceDetail(props.bookingDetail.Service_Detail)
			setPromoCode(props.bookingDetail.Promo_Code)
			if (props.bookingDetail.Service_Detail && props.bookingDetail.Service_Detail.length) {
				setSelectedValue(props.bookingDetail.Service_Detail)
			} else {
				setSelectedValue([])
			}
			setPromoCodeDetails({
				Promo_Code: props.bookingDetail.Promo_Code,
				Promo_Heading: props.bookingDetail.Promo_Heading,
				Offer_Percentage: props.bookingDetail.Promo_Percentage,
			})
			setBookingType(props.bookingDetail.Booking_Type_Code)
		}
	}, [])

	//Sample Collection Charges
	const sampleCollectionCharges = sum => {
		if (props.bookingDetail.Booking_Type_Code != 'W') {
			props.getCollectionCharges(
				{
					Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
					Bill_Amount: sum,
					Pt_Code: bookingDetail.Pt_Code,
				},
				(success, data) => {
					if (success) {
						setCollectionCharges(data)
						settotalValues(sum + data.Collection_Charge)
					}
				}
			)
		} else {
			setCollectionCharges({ Collection_Charge: 0 })
			settotalValues(sum + 0)
		}
	}

	//Calculate Amount
	useEffect(() => {
		setHasError(false)
		if (promoCode == '' || promoCode == null) {
			let sum = 0
			selectedValue &&
				selectedValue.length &&
				selectedValue.forEach(values => {
					values.Service_Amount ? (sum += values.Service_Amount) : (sum += values.Amount)
					settotalValues(sum)
				})
			return sampleCollectionCharges(sum)
		} else if (promoCode != '' && promocodeDetails.Offer_Percentage > 0) {
			setPromoMsg('Promo Applied')
			setPromoCodeStatus(true)
			let sum = 0
			let discount = 0
			selectedValue &&
				selectedValue.length &&
				selectedValue.forEach(values => {
					values.Service_Amount ? (sum += values.Service_Amount) : (sum += values.Amount)
					//console.log(values)
					values.Suppress_Discount == false
						? values.Service_Amount
							? (discount += (Number(values.Service_Amount) * Number(promocodeDetails.Offer_Percentage)) / 100)
							: (discount += (Number(values.Amount) * Number(promocodeDetails.Offer_Percentage)) / 100)
						: (discount += 0)
					//console.log(discount)
					setTotalDiscount(discount)
					settotalValues(sum)
				})
			//console.log(discount)
			return sampleCollectionCharges(sum - discount)
		}
	}, [selectedValue, promoCode])

	// Test Search handle input change event
	const handleInputChange = value => {
		setValue(value)
	}

	//recall values
	const recallValuesAgain = () => {
		let newSelectedVal = selectedValue
		setSelectedValue([...newSelectedVal])
	}

	// Test Search handle selection
	const handleChange = value => {
		delete value.RowNumber
		setSearchTestValue('')
		const found = selectedValue.find(element => element.Service_Code == value.Service_Code)
		if (found == undefined) {
			setSelectedValue([...selectedValue, value])
			setSearchTestValue('')
			if (promocodeStatus == false) {
				setPromoCode('')
			}
		} else {
			setSearchTestValue('')
			if (promocodeStatus == false) {
				setPromoCode('')
			}
		}
	}

	//Test Search results from api
	const fetchData = () => {
		const searchData = {
			Search_Text: inputValue,
			Start_Index: 1,
			Page_Count: 100,
		}
		return searchTestApiCall.post('/Fetch_Services_For_Order', searchData).then(result => {
			const res = result.data.Message[0].Service_List
			//console.log(res)
			return res
		})
	}

	//Remove the pre selected Tests
	const removeOldService = value => {
		let newSelectedVal = selectedValue
		newSelectedVal.splice(value, 1)
		setSelectedValue([...newSelectedVal])
	}

	//Remove the Coupon Code
	const removeCoupenCode = () => {
		setHasError(false)
		setPromoCode('')
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
		setPromoMsg('')
	}

	//Check For Coupon
	const checkForCoupon = () => {
		setPromoLoader(true)
		const promotionData = {
			Labadmin_Code: props.labAdminCode,
			Username: props.bookingDetail.Mobile_No,
			Promo_Code: promoCode.trim(),
		}
		props.getPromotiontApplyDetails(promotionData, result => {
			if (result.SuccessFlag === 'true') {
				//console.log(result)
				setPromoCodeStatus(result.SuccessFlag)
				setPromoCodeDetails(result.Message[0])
				setPromoCode(result.Message[0].Coupon_Code)
				setPromoLoader(false)
				setPromoMsg('Promo Applied')
				recallValuesAgain()
			} else if (result.SuccessFlag === 'false') {
				removeCoupenCode()
				setPromoCodeStatus(false)
				setPromoLoader(false)
				setPromoCode('')
				setPromoMsg('Voucher Invalid!')
				recallValuesAgain()
			}
		})
	}

	//Update
	const onClickSubmit = () => {
		//this.setState({ showLoading: true })
		//alert(promoCode,promocodeStatus)
		if (isEmptyArray(selectedValue)) {
			setHasError(true)
		} else if (isEmptyString(selectedPhlebotomistList) && props.bookingDetail.Booking_Type_Code !== 'W') {
			setHasError(true)
		} else if (promoCode.length && promocodeStatus == false) {
			setHasError(true)
		} else {
			let serArr = []
			selectedValue.forEach(element => {
				let serviceAmount = 0
				if (element.Service_Amount) {
					serviceAmount = element.Service_Amount
				} else {
					serviceAmount = element.Amount
				}
				let serviceDiscount = 0
				if (element.Service_Discount) {
					serviceDiscount = element.Service_Discount
				} else if (element.Suppress_Discount == false) {
					serviceDiscount = element.Amount / promocodeDetails.Offer_Percentage
				} else {
					serviceDiscount = 0
				}
				serArr.push({
					Service_Code: element.Service_Code,
					Service_Discount: serviceDiscount,
					Service_Amount: serviceAmount,
				})
			})

			let arrService = []
			console.log('')
			selectedValue.forEach(item => {
				arrService.push({
					Service_Code: item.Service_Code,
					Service_Amount: item.Amount ? item.Amount : item.Service_Amount,
					Service_Suppress_Discount: item.Suppress_Discount,
					Service_Discount:
						item.Suppress_Discount === false && promocodeDetails.Offer_Percentage && item.Amount
							? (item.Amount * promocodeDetails.Offer_Percentage) / 100
							: item.Suppress_Discount === false && promocodeDetails.Offer_Percentage && item.Service_Amount
							? (item.Service_Amount * promocodeDetails.Offer_Percentage) / 100
							: 0,
				})
			})

			const data = {
				Labadmin_Code: props.labAdminCode,
				Firm_No: props.bookingDetail.Firm_No,
				Booking_Type: bookingType,
				Booking_Date: props.bookingDetail.Booking_Date,
				Booking_No: props.bookingDetail.Booking_No,
				Collector_Code: selectedPhlebotomistList,
				Service_Reg_Data: arrService,
				Promo_Code: promoCode,
				Sample_Collect_Charge: collectionCharges.Collection_Charge,
			}
			props.bookingUpdate(data, result => {
				//this.setState({ showLoading: false })
				if (result.SuccessFlag === 'true') {
					setBookDetail(props.bookingDetail)
					setPhlebotomistList(props.phlebotomistList)
					setSelectedPhlebotomistList(props.bookingDetail.Collector_Code)
					//To have intial selected test
					setServiceDetail(props.bookingDetail.Service_Detail)
					setPromoCode(props.bookingDetail.Promo_Code)
					setSelectedValue(props.bookingDetail.Service_Detail)
					setPromoCodeDetails({})
					setBookDetail({})
					setPhlebotomistList([])
					setSelectedPhlebotomistList('')
					setBookingType('')
					setServiceDetail([])
					setPromoCode('')
					setTestCollection({ value: '', label: '' })
					setTestList(testListData)
					setValue('')
					setSelectedValue([])
					settotalValues(0)
					setCollectionCharges({})
					setTotalDiscount(0)
					setPromoCodeStatus(false)
					setPromoLoader(false)
					setHasError(false)
					setInvoiceLoading(false)
					setSearchTestValue('')
					setPromoMsg('')
					removeCoupenCode()
					props.showNotification('Success', 'Booking updated Successfully', TOAST.TYPE_SUCCESS)
					props.onClickClose()
				} else {
					props.showNotification('Error', result.Message[0].Message, TOAST.TYPE_ERROR)
				}
			})
		}
	}

	//Download Invoice
	const downloadFile = invoice => {
		if (invoice) {
			setInvoiceLoading(true)
			const data = {
				Labadmin_Code: props.labAdminCode,
				Firm_No: props.bookingDetail.Firm_No,
				Invoice_No: props.bookingDetail.Invoice_No,
				Invoice_Date: props.bookingDetail.Invoice_Date,
			}
			props.viewInvoice(data, (success, res) => {
				if (success) {
					let arr = []
					if (res.Message[0].InvoiceReport_Url) arr.push(res.Message[0].InvoiceReport_Url)
					arr.forEach(url => FileSaver.saveAs(url))
				}
				setInvoiceLoading(true)
			})
		} else {
			const data = {
				Labadmin_Code: props.labAdminCode,
				Firm_No: props.bookingDetail.Firm_No,
				Booking_Type: props.bookingDetail.Booking_Type_Code,
				Booking_Date: props.bookingDetail.Booking_Date,
				Booking_No: props.bookingDetail.Booking_No,
			}
			props.viewPrescription(data, (success, res) => {
				if (success) {
					let arr = []
					if (res.Message[0].Prescription_File1) arr.push(res.Message[0].Prescription_File1)
					if (res.Message[0].Prescription_File2) arr.push(res.Message[0].Prescription_File2)
					arr.forEach(url => FileSaver.saveAs(url))
				}
			})
		}
	}

	return (
		<Modal isOpen toggle={() => props.onClickClose()} size='lg'>
			<ModalHeader toggle={() => props.onClickClose()} className='w-100'>
				{' '}
				<div className='d-flex w-100 justify-content-between'>
					<div className='p-2'>View Bookings</div>

					<div className='p-2 d-flex row'>
						<div>
							{props.bookingDetail.Payment_Full_Desc && (
								<span className='badge badge-pill badge-success'>{props.bookingDetail.Payment_Full_Desc}</span>
							)}
						</div>
						<span className='ml-4'>
							{props.bookingDetail.IsPrescription !== 'false' && props.bookingDetail.IsPrescription !== false ? (
								<>
									<img src={require('../../../assets/media/images/pdf.svg')} alt='pdf' width='20' height='20' />
									<button className='btn btn-link' onClick={() => downloadFile()}>
										View Prescription
									</button>
								</>
							) : null}
						</span>
						<span className='ml-4 d-block'>
							{props.bookingDetail.Invoice_Status !== false && props.bookingDetail.Invoice_Status !== 'false' ? (
								<>
									<img src={require('../../../assets/media/images/pdf.svg')} alt='pdf' width='10' height='10' />
									<button disabled={invoiceLoading} className='btn btn-link' onClick={() => downloadFile('invoice')}>
										{invoiceLoading ? 'Opening...' : 'View Invoice'}
									</button>
								</>
							) : null}
						</span>
					</div>
				</div>
			</ModalHeader>
			<ModalBody>
				{props.loading ? (
					<div className='col-sm-12'>
						<div className='d-flex w-100'>
							<div className='p-2'>
								<Spinner size='lg' className='ml-2 m-1 spinner' />
							</div>
						</div>
					</div>
				) : (
					<>
						<div className='row'>
							<div className='col-sm-12 overflow-auto'>
								<div className='d-flex w-100'>
									<div className='p-2'>
										<div className='info'>
											<h5 className='title'>BID : {props.bookingDetail.Booking_No}</h5>
											{props.bookingDetail.Sid_No && props.Sid_No.trim().length ? (
												<h5 className='title'>SID : {props.bookingDetail.Sid_No}</h5>
											) : null}
											<p className='desc'>{props.bookingDetail.Visit_Date_Desc}</p>
										</div>
									</div>
									<div className='p-2'>
										<div className='info'>
											<h5 className='title'>Booking Date</h5>
											<p className='desc'>{moment(props.bookingDetail.Booking_Date).format('DD/MM/YYYY')}</p>
										</div>
									</div>
									<div className='p-2'>
										<div className='info'>
											<h5 className='title'>Schedule Date</h5>
											<p className='desc'>{moment(props.bookingDetail.Visit_Date).format('DD/MM/YYYY')}</p>
										</div>
									</div>

									<div className='ml-auto p-2'>
										<div className='info'>
											<h5 className='title'>
												{props.branchName ? (
													<>
														<i className='far fa-map-marker-alt pr-1' />
														{props.branchName}
													</>
												) : null}
											</h5>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-sm-6'>
								<div className='box_se w-100 pr-3 mb-3'>
									<div className='bg-white rounded-lg pt-3'>
										<div className='row pl-3'>
											<div className='col-sm-4 col-4 nam'>
												<img
													width='95'
													height='95'
													src={
														props.bookingDetail.Pt_Profile_Picture ? props.bookingDetail.Pt_Profile_Picture : profile
													}
													alt=''
												/>
												<div className='overflow-auto'>
													<p className='m-0 text-truncate' title={props.modalName}>
														{props.modalName}
													</p>
													<p className='m-0'>Age - {props.bookingDetail.First_Age}</p>
												</div>
											</div>
											<div className='col-sm-8 col-8'>
												<div className='d-flex flex-row'>
													<div>
														<p className='m-0'>
															<i className='far fa-mars pr-1' />
															{props.bookingDetail.Gender_Desc}
														</p>
													</div>
													<div className='pl-3'>
														<p className='m-0'>
															{props.bookingDetail.Mobile_No ? <i className='far fa-mobile pr-1' /> : null}
															{props.bookingDetail.Mobile_No}
														</p>
													</div>
												</div>
												<div>
													<p className='m-0 text-break'>
														{props.bookingDetail.Full_Address && <i className='far fa-map-marker-alt pr-1' />}
														{props.bookingDetail.Full_Address ? `${props.bookingDetail.Full_Address}, ` : ''}
														{/* {props.bookingDetail.Pt_Street ? `${props.bookingDetail.Pt_Street}, ` : ''}
															{props.bookingDetail.Pt_Place ? `${props.bookingDetail.Pt_Place}, ` : ''}
															{props.bookingDetail.Pt_Landmark ? `${props.bookingDetail.Pt_Landmark}, ` : ''}
															{props.bookingDetail.Pt_City ? `${props.bookingDetail.Pt_City}, ` : ''}
															{props.bookingDetail.Pt_PinCode ? `${props.bookingDetail.Pt_PinCode}.` : ''} */}
													</p>
												</div>
												{/* <p className='m-0 pt-2'>
														<i className='far fa-map-marker-alt pr-1' />
														{props.bookingDetail.Booking_Status_Desc}
														<br /> {props.bookingDetail.Booking_Status_Desc}
													</p> */}
												<div>
													<p className='text-wrap badge badge-warning mt-2 mb-3 text-truncate'>
														{props.bookingDetail.Booking_Status_Desc}
													</p>
												</div>
												<br />
											</div>
										</div>
									</div>
								</div>
								<div className='amazon_products bg-white rounded-lg table-responsive'>
									<table className='table'>
										<thead>
											<tr>
												<th scope='col'>Service</th>

												<th scope='col'>
													<p className='mb-0 mr-4 text-color text-danger'>Discount</p>
												</th>
												<th scope='col'>Amount(Rs)</th>
											</tr>
										</thead>
										<tbody>
											{selectedValue && selectedValue.length
												? selectedValue.map((values, key) => {
														return (
															<tr key={key}>
																<td>
																	{values.Suppress_Discount == true ? <span style={{ color: 'red' }}>*</span> : ''}
																	{values.Service_Name}
																</td>
																<td>
																	{promocodeStatus && values.Service_Discount >= 0
																		? values.Suppress_Discount == false &&
																		  (Number(values.Service_Amount) * Number(promocodeDetails.Offer_Percentage)) / 100
																		: values.Suppress_Discount == false && promocodeStatus
																		? (Number(values.Amount) * Number(promocodeDetails.Offer_Percentage)) / 100
																		: ''}
																</td>
																<td>
																	{values.Amount > 0 && selectedValue && selectedValue.length
																		? values.Amount.toFixed(2)
																		: selectedValue && selectedValue.length
																		? values.Service_Amount.toFixed(2)
																		: ''}
																</td>
															</tr>
														)
												  })
												: ''}
											<tr>
												<th scope='row'>Sample Collection Charge</th>
												<th></th>
												<th>{selectedValue && selectedValue.length ? collectionCharges.Collection_Charge : 0}</th>
											</tr>
											<tr>
												<th scope='row'>Amount Payable</th>
												<th>
													{promocodeStatus && totalDiscount !== 0 && (
														<p className='mb-0 mr-4 text-color text-danger'>
															{selectedValue && selectedValue.length ? totalDiscount.toFixed(2) : ''}
														</p>
													)}
												</th>
												<th>{selectedValue && selectedValue.length ? totalValues.toFixed(2) : 0}</th>
											</tr>
											<tr>
												<th scope='row'>Amount Paid</th>
												<th></th>
												<th>{bookingDetail.Paid_Amount}</th>
											</tr>
										</tbody>
									</table>
								</div>
								<div className=''>
									<div className='d-flex list-inline mt-4'>
										<label className='col-form-label flex-grow-1'>
											<h6>
												Note : <span style={{ color: 'red' }}>* - Indicates Non Discounted Test</span>
											</h6>
										</label>
										<div className='justify-content-end'>
											<p className='mb-0 text-color text-success'></p>
										</div>
									</div>
								</div>
							</div>
							<div className='col-sm-6'>
								<div className='dropdown-filter'>
									<h6>Choose Phlebotomist </h6>
									<div className='dropdown bg-dark'>
										<FormGroup>
											<Input
												type='select'
												id='filter'
												placeholder='Select'
												name='selectedPhlebotomist'
												value={selectedPhlebotomistList}
												onChange={e => setSelectedPhlebotomistList(e.target.value)}
											>
												<option value=''>Select Phlebotomist</option>
												{props.bookingDetail.Booking_Type_Code != 'W' &&
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
									{hasError &&
										isEmptyString(selectedPhlebotomistList) &&
										props.bookingDetail.Booking_Type_Code !== 'W' && (
											<div>
												<small className='text-danger'>Phlebotomist is required</small>
											</div>
										)}
									<h6 className='mt-4'>Visit Type</h6>
									{props.visitType &&
										props.visitType.map((item, i) => {
											// Remove Direct Visit Type
											if (item.Booking_Type_Code !== 'L') {
												return (
													<div key={i} className='form-check-inline'>
														<label className='form-check-label'>
															<input
																type='radio'
																className='form-check-input'
																name='bookType'
																value={item.Booking_Type_Code}
																onChange={e => setBookingType(e.target.value)}
																disabled
																//defaultChecked={setStatusMode(el.enabled, k)}
																checked={bookingType === item.Booking_Type_Code}
															/>
															{item.Type_Of_Booking}
														</label>
													</div>
												)
											}
										})}

									<div className='input-group mt-4'>
										<h6 className='mt-4'>Search Test</h6>

										<FormGroup style={{ width: '100%' }}>
											<AsyncSelect
												cacheOptions
												placeholder='Search Test'
												value=''
												isSearchable={true}
												getOptionLabel={e => e.Service_Name}
												getOptionValue={e => e.Service_Code}
												loadOptions={fetchData}
												onInputChange={handleInputChange}
												onChange={e => {
													handleChange(e)
												}}
												isDisabled={
													!props.bookingDetail.Is_Editable_Booking ||
													props.bookingDetail.Is_Editable_Booking === 'false' ||
													props.bookingDetail.Is_Editable_Booking === false
												}
											/>
										</FormGroup>

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
									</div>
									{hasError && isEmptyArray(selectedValue) && (
										<div>
											<small className='text-danger'>Select an Service to Continue</small>
										</div>
									)}
									<div className='input-group mt-4'>
										<h6 className=''>
											Voucher Code{' '}
											<span className='ml-2' style={{ float: 'right', color: promocodeStatus ? 'green' : 'red' }}>
												{promoMsg}
											</span>
										</h6>
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
												<Button color='secondary' onClick={() => checkForCoupon()}>
													Apply &nbsp;{promoloader ? <Spinner size='sm' className='ml-2 m-1' /> : <></>}
												</Button>
											</InputGroupAddon>
										</InputGroup>
										{hasError && promoCode.length && promocodeStatus == false ? (
											<div>
												<small className='text-danger'>Apply or Remove Coupon Code</small>
											</div>
										) : (
											''
										)}
									</div>
								</div>
							</div>
						</div>
						<br />
					</>
				)}
			</ModalBody>
			<ModalFooter>
				{(props.bookingDetail.Is_Editable_Booking ||
					props.bookingDetail.Is_Editable_Booking === 'true' ||
					props.bookingDetail.Is_Editable_CollectorAssign ||
					props.bookingDetail.Is_Editable_CollectorAssign === 'true') && (
					<button type='button' className='btn btn-dark rounded mr-2' onClick={() => onClickSubmit()}>
						Update
					</button>
				)}
				<button type='button' className='btn btn-light rounded mr-2' onClick={() => props.onClickClose()}>
					Close
				</button>
			</ModalFooter>
		</Modal>
	)
}

ViewModal2.propTypes = {
	labAdminCode: PropTypes.string,
	bookingDetail: PropTypes.array,
	loading: PropTypes.bool,
	phlebotomistList: PropTypes.array,
	visitType: PropTypes.array,
	onClickClose: PropTypes.func,
	getTestDetails: PropTypes.func,
	testList: PropTypes.func,
	viewPrescription: PropTypes.func,
	viewInvoice: PropTypes.func,
	bookingUpdate: PropTypes.func,
	getPromotiontApplyDetails: PropTypes.func,
	showNotification: PropTypes.func,
	isEmptyString: PropTypes.func,
	isEmptyArray: PropTypes.func,
	getCollectionCharges: PropTypes.func,
	modalName: PropTypes.string,
	branchName: PropTypes.string,
}

export default connect(null, {
	getTestDetails,
	viewPrescription,
	bookingUpdate,
	getPromotiontApplyDetails,
	showNotification,
	getCollectionCharges,
	viewInvoice,
})(ViewModal2)
