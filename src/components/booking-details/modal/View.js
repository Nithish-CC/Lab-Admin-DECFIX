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
import _, { result } from 'lodash'
import moment from 'moment'
//import SelectSearch from 'react-select-search'
//import Select from 'react-select'
//import SelectSearch, { fuzzySearch } from "react-select-search";
//import './select-search.css'
import { useSelector } from 'react-redux'
import searchTestApiCall from './searchTestapi'

const ViewModal = props => {
	const [bookingDetail, setBookDetail] = useState({})
	const [phlebotomistList, setPhlebotomistList] = useState([])
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
	const [promocodeDetails,setPromoCodeDetails]=useState({Availed_Times: 0,
		Coupon_Code: "",
		Coupon_Desc: "",
		Coupon_Heading: "",
		Offer_Percentage: 0,
		Offer_Times:0,
		Validity_ToDate: ""});


	useEffect(() => {
		const getTest = newValue => {
			const searchData = {
				Search_Text: newValue,
				Start_Index: 1,
				Page_Count: 100,
			}
			props.getTestDetails(searchData, result => {
				if (result) {
					//console.log(testList)
					let convertValue = []
					testList.filter(i => convertValue.push({ value: i, label: i.Service_Name }))
					//console.log(convertValue)
					setTestCollection(convertValue)
				}
			})
		}
		getTest('a')
		if (Object.keys(props).length) {
			console.log(props)
			alert('hii hii')
			setBookDetail(props.bookingDetail)
			setPhlebotomistList(props.phlebotomistList)
			//To have intial selected test
			setServiceDetail(props.bookingDetail.Service_Detail)
			setPromoCode(props.bookingDetail.Promo_Code)
			setSelectedValue(props.bookingDetail.Service_Detail)
			setPromoCodeDetails({'Promo_Code':props.bookingDetail.Promo_Code,'Promo_Heading':props.bookingDetail.Promo_Heading,'Promo_Percentage':props.bookingDetail.Promo_Percentage})
		}
	}, [])

	//Sample Collection Charges
	const sampleCollectionCharges = sum => {
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
	}

	//Calculate Amount
	useEffect(() => {
		if (promoCode == '' || promoCode == null) {
			let sum = 0
			selectedValue && selectedValue.length && selectedValue.forEach(values => {
					values.Service_Amount ? (sum += values.Service_Amount) : (sum += values.Amount)
					settotalValues(sum)
				})
			return sampleCollectionCharges(sum)
		} else {
			let sum = 0
			let discount = 0
			selectedValue &&
				selectedValue.length &&
				selectedValue.forEach(values => {
					values.Service_Amount ? (sum += values.Service_Amount) : (sum += values.Amount)
					console.log(values)
					values.Service_Discount ? (discount+= values.Service_Discount):(values.Suppress_Discount== false ? (discount+= values.Amount*(promocodeDetails.Offer_Percentage?promocodeDetails.Offer_Percentage:promocodeDetails.Promo_Percentage)/100):((discount+= 0)))
					console.log(discount)
					settotalValues(sum)
				})	
			return sampleCollectionCharges(sum-discount)
		}
	}, [selectedValue, promoCode])

	// Test Search handle input change event
	const handleInputChange = value => {
		//console.log(value)
		setValue(value)
	}

	// Test Search handle selection
	const handleChange = value => {
		//console.log(selectedValue)
		delete value.RowNumber
		setSelectedValue([...selectedValue, value])
	}
	//console.log(selectedValue)

	//Test Search results from api
	const fetchData = () => {
		const searchData = {
			Search_Text: inputValue,
			Start_Index: 1,
			Page_Count: 100,
		}
		//  props.getTestDetails(searchData, result => {
		// 	if (result) {
		// 		//alert(testList)
		// 		//let convertValue = [];
		// 		//testList.filter(i => convertValue.push({ value: i, label: i.Service_Name }))
		// 		//console.log(convertValue)
		// 		setTestCollection(testList)
		// 		console.log(testList)
		// 	}

		// })
		//  props.getTestDetails(searchData, (result) =>{
		// 	return testList
		// })
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
		setPromoCode(null)
	}

	// console.log('bookdetail', bookingDetail)
	// console.log('phlebotomistList', phlebotomistList)
	// console.log('promocode', promoCode)
	console.log(promocodeDetails)
	return (
		<Modal isOpen size='lg'>
			<ModalHeader className='w-100'>
				{' '}
				<div className='d-flex w-100 justify-content-between'>
					<div className='p-2'>View Bookings</div>

					<div className='p-2 d-flex row'>
						<div></div>
						<span className='ml-4'>
							<img alt='pdf' width='20' height='20' />
							<button className='btn btn-link'></button>
						</span>
						<span className='ml-4 d-block'></span>
					</div>
				</div>
			</ModalHeader>
			<ModalBody>
				<>
					<div className='col-sm-12'>
						<div className='d-flex w-100'>
							<div className='p-2'>
								<Spinner size='lg' className='ml-2 m-1 spinner' />
							</div>
						</div>
					</div>

					<div className='row'>
						<div className='col-sm-12 overflow-auto'>
							<div className='d-flex w-100'>
								<div className='p-2'>
									<div className='info'>
										<h5 className='title'>BID : </h5>

										<h5 className='title'>SID : </h5>

										<p className='desc'></p>
									</div>
								</div>
								<div className='p-2'>
									<div className='info'>
										<h5 className='title'>Booking Date</h5>
										<p className='desc'></p>
									</div>
								</div>
								<div className='p-2'>
									<div className='info'>
										<h5 className='title'>Schedule Date</h5>
										<p className='desc'></p>
									</div>
								</div>

								<div className='ml-auto p-2'>
									<div className='info'>
										<h5 className='title'></h5>
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
											<img width='95' height='95' alt='' />
											<div className='overflow-auto'>
												<p className='m-0 text-truncate'></p>
												<p className='m-0'>Age - </p>
											</div>
										</div>
										<div className='col-sm-8 col-8'>
											<div className='d-flex flex-row'>
												<div>
													<p className='m-0'>
														<i className='far fa-mars pr-1' />
													</p>
												</div>
												<div className='pl-3'>
													<p className='m-0'></p>
												</div>
											</div>
											<div>
												<p className='m-0 text-break'></p>
											</div>

											<div>
												<p className='text-wrap badge badge-warning mt-2 mb-3 text-truncate'></p>
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
										{selectedValue &&
											selectedValue.length &&
											selectedValue.map((values, key) => {
												return (
													<tr key={key}>
														<td>{values.Service_Name}</td>
														<td>{values.Service_Discount>=0 ? values.Service_Discount : values.Amount*promocodeDetails.Promo_Percentage/100}</td>
														<td>{values.Amount > 0 ? values.Amount : values.Service_Amount}</td>
													</tr>
												)
											})}
										<tr>
											<th scope='row'>Sample Collection Charge</th>
											<th></th>
											<th>{collectionCharges.Collection_Charge}</th>
										</tr>
										<tr>
											<th scope='row'>Amount Payable</th>
											<th>
												{bookingDetail.Discount_Amount > 0 ? (
													<h5 style={{ color: 'red' }}>{bookingDetail.Discount_Amount}</h5>
												) : (
													''
												)}
											</th>
											<th>{totalValues}</th>
										</tr>
										<tr>
											<th scope='row'>Amount Paid</th>
											<th></th>
											<th>{bookingDetail.Paid_Amount}</th>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className='col-sm-6'>
							<div className='dropdown-filter'>
								<h6>Choose Phlebotomist </h6>
								<div className='dropdown bg-dark'>
									<FormGroup>
										<Input type='select' id='filter' placeholder='Select' name='selectedPhlebotomist'>
											<option value=''>Select Phlebotomist</option>
											{phlebotomistList &&
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

								<h6 className='mt-4'>Visit Type</h6>

								<div className='input-group mt-4'>
									<h6 className='mt-4'>Search Test</h6>
									{/* <AsyncSelect
										className='react-select'
										inputValue={newValue}
										cacheOptions
										value={newValue}
										placeholder='Search Test'
										loadOptions={loadOptions}
										defaultOptions
										onInputChange={getTest}
										onChange={onChange}
										isDisabled={
											!this.props.bookingDetail.Is_Editable_Booking ||
											this.props.bookingDetail.Is_Editable_Booking === 'false' ||
											this.props.bookingDetail.Is_Editable_Booking === false
										}
									/> */}
									<FormGroup style={{ width: '100%' }}>
										{/* <Select
											className='basic-single'
											classNamePrefix='select'
											//defaultValue={options[0]}
											isLoading={false}
											isClearable={true}
											isSearchable={true}
											onInputChange={(e)=>console.log(e.target.value)}
											//onChange={(e) => console.log(e.target.value)}
											name='color'
											options={testCollection}
										/> */}
										<AsyncSelect
											cacheOptions
											defaultOptions
											//inputValue={}
											value={selectedValue}
											getOptionLabel={e => e.Service_Name}
											getOptionValue={e => e.Service_Code}
											loadOptions={fetchData}
											onInputChange={handleInputChange}
											onChange={e => handleChange(e)}
										/>
									</FormGroup>
									{/* 
									<div>
										<small className='text-danger'>Select an Service to Continue</small>
									</div> */}
									{selectedValue &&
										selectedValue.length &&
										selectedValue.map((item, i) => {
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
										})}
								</div>
								<div className='input-group mt-4'>
									<h6 className=''>
										Voucher Code <span className='ml-2'></span>
									</h6>
									<InputGroup>
										<input
											type='text'
											className='form-control bg-transparent patient-details'
											placeholder='Voucher Code'
											name='promotion'
											onChange={e => setPromoCode(e.target.value)}
											value={promoCode}
										/>
										<span className='fa fa-times-circle closeIcon' onClick={() => removeCoupenCode()} />
										<InputGroupAddon addonType='append'>
											<Button color='secondary'>
												Apply &nbsp; <Spinner size='sm' className='ml-2 m-1' />
											</Button>
										</InputGroupAddon>
									</InputGroup>
								</div>
							</div>
						</div>
					</div>
					<br />
				</>
			</ModalBody>
			<ModalFooter>
				<button type='button' className='btn btn-dark rounded mr-2'>
					Update
				</button>

				<button type='button' className='btn btn-light rounded mr-2'>
					Close
				</button>
			</ModalFooter>
		</Modal>
	)
}

ViewModal.propTypes = {
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
})(ViewModal)
