/* eslint-disable no-undef */
import React, { Component } from 'react'
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
import _ from 'lodash'
import moment from 'moment'

// eslint-disable-next-line
Array.prototype.unique = function () {
	var a = this.concat()
	for (var i = 0; i < a.length; ++i) {
		for (var j = i + 1; j < a.length; ++j) {
			if (a[i].Service_Code === a[j].Service_Code) a.splice(j--, 1)
		}
	}
	return a
}

class ViewModal1 extends Component {
	state = {
		serviceDueAmount: this.props.bookingDetail.Due_Amount,
		selectedPhlebotomist: this.props.bookingDetail.Collector_Code,
		inputValue: '',
		startIndex: 1,
		pageCount: 100,
		colourOptions: this.props.testList ? this.props.testList : [],
		testValue: [],
		bookType: this.props.bookingDetail.Booking_Type_Code,
		updatedTest: [],
		oldServiceArr: this.props.bookingDetail.Service_Detail,
		newServiceArr: [],
		serviceArr: this.props.bookingDetail.Service_Detail,
		promoApplied: false,
		promotionPercent: this.props.bookingDetail.Promo_Percentage ? this.props.bookingDetail.Promo_Percentage : 0,
		serviceTotal: this.props.bookingDetail.Bill_Amount,
		showPromotionLoading: false,
		// showPromotion: this.props.bookingDetail.Promo_Code ? true : false,
		promotion: this.props.bookingDetail.Promo_Code ? this.props.bookingDetail.Promo_Code : '',
		promotionSelected: '',
		promoAppliedMsg: '',
		serviceTotalDis: this.props.bookingDetail.Discount_Amount,
		hasError: false,
		Paid_Amount: this.props.bookingDetail.Paid_Amount,
		collectionCharges: this.props.bookingDetail.Sample_Collection_Charge,
	}

	getTest = newValue => {
		this.setState({ newValue }, () => {
			const searchData = {
				Search_Text: this.state.newValue,
				Start_Index: this.state.startIndex,
				Page_Count: this.state.pageCount,
			}
			this.props.getTestDetails(searchData, result => {
				this.setState({ showLoading: false })
				if (result) {
					let convertValue = []
					this.props.testList.filter(i => convertValue.push({ value: i, label: i.Service_Name }))
					this.setState({ testValue: convertValue })
				} else {
					console.log('')
				}
			})
		})
		return newValue
	}

	filterColors = inputValue => {
		return this.state.testValue.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()))
	}

	loadOptions = (inputValue, callback) => {
		setTimeout(() => {
			callback(this.filterColors(inputValue))
		}, 1000)
	}

	handleChange = event => {
		console.log('handle change')
		if (event.target.name === 'promotion' && event.target.value.trim() === '') {
			const serviceArr = this.state.serviceArr
			if (serviceArr && serviceArr.length) {
				for (let i = 0, _len = serviceArr.length; i < _len; i++) {
					serviceArr[i]['Service_Discount'] = (serviceArr[i]['Service_Amount'] > 0 * 0) / 100
				}
			}
			this.setState({
				promotion: '',
				promoApplied: false,
				promotionPercent: 0,
				serviceArr: serviceArr,
				promoAppliedMsg: '',
				serviceDueAmount: this.state.serviceTotal,
				serviceTotalDis: 0,
			})
			console.log(this.state.serviceTotal, this.state.collectionCharges)
		} else {
			this.setState({ [event.target.name]: event.target.value })
		}
	}

	applyPromotion = () => {
		this.setState({ showPromotionLoading: true })
		const promotionData = {
			Labadmin_Code: this.props.labAdminCode,
			Username: this.props.bookingDetail.Mobile_No,
			Promo_Code: this.state.promotion,
		}
		this.props.getPromotiontApplyDetails(promotionData, result => {
			this.setState({ showPromotionLoading: false })
			if (result.SuccessFlag === 'true') {
				const serviceArr = this.state.serviceArr
				console.log(serviceArr)
				// let discountAmount =
				// result.Message[0].Offer_Percentage > 0
				// 	? totalPlusCharge * (result.Message[0].Offer_Percentage / 100)
				// 	: totalPlusCharge

				let discountAmount = 0
				let totalPlusCharge = 0

				for (let i = 0, _len = serviceArr.length; i < _len; i++) {
					if (serviceArr[i].Service_Discount > 0) {
						console.log(serviceArr[i].Service_Discount)
						discountAmount = discountAmount + serviceArr[i].Service_Discount
						serviceArr[i]['Service_Discount'] =
							(serviceArr[i]['Service_Amount'] * result.Message[0].Offer_Percentage) / 100
					}
					totalPlusCharge = totalPlusCharge + serviceArr[i].Service_Amount
				}
				// let totalPlusCharge =
				// 	this.state.serviceTotal < this.state.collectionCharges
				// 		? this.state.serviceTotal
				// 		: this.state.serviceTotal - this.state.collectionCharges
				// console.log('🚀 ~ file: View.js ~ line 128 ~ ViewModal ~ totalPlusCharge', totalPlusCharge)

				// let due = totalPlusCharge - discountAmount
				// console.log(
				// 	'🚀 ~ file: View.js ~ line 128 ~ ViewModal ~ totalPlusCharge, discountAmount',
				// 	totalPlusCharge,
				// 	discountAmount,
				// 	due
				// )

				let due = totalPlusCharge - discountAmount
				this.setState({
					promoApplied: true,
					promotionSelected: this.state.promotion,
					promoAppliedMsg: 'Promo Applied',
					promotionPercent: result.Message[0].Offer_Percentage,
					serviceArr: serviceArr,
					serviceDueAmount: due + this.state.collectionCharges,
					serviceTotalDis:
						totalPlusCharge - (totalPlusCharge - totalPlusCharge * (result.Message[0].Offer_Percentage / 100)),
				})
				console.log(this.state.serviceDueAmount, this.state.serviceTotalDis)
			} else {
				// this.props.showNotification(result.Message[0].Message, 'error', TOAST.TYPE_ERROR)
				const serviceArr = this.state.serviceArr
				console.log(serviceArr + '++++++++++++++')
				if (serviceArr && serviceArr.length) {
					for (let i = 0, _len = serviceArr.length; i < _len; i++) {
						serviceArr[i]['Service_Discount'] = 0
					}
				}
				this.setState({
					promotion: '',
					promoAppliedMsg: 'Voucher Invalid!',
					promoApplied: false,
					promotionPercent: 0,
					serviceArr: serviceArr,
				})
				setTimeout(() => {
					this.setState({ promoAppliedMsg: '' })
				}, 3000)
			}
		})
	}

	downloadFile = invoice => {
		if (invoice) {
			this.setState({ invoiceLoading: true })
			const data = {
				Labadmin_Code: this.props.labAdminCode,
				Firm_No: this.props.bookingDetail.Firm_No,
				Invoice_No: this.props.bookingDetail.Invoice_No,
				Invoice_Date: this.props.bookingDetail.Invoice_Date,
			}
			this.props.viewInvoice(data, (success, res) => {
				if (success) {
					let arr = []
					if (res.Message[0].InvoiceReport_Url) arr.push(res.Message[0].InvoiceReport_Url)
					arr.forEach(url => FileSaver.saveAs(url))
				}
				this.setState({ invoiceLoading: false })
			})
		} else {
			const data = {
				Labadmin_Code: this.props.labAdminCode,
				Firm_No: this.props.bookingDetail.Firm_No,
				Booking_Type: this.props.bookingDetail.Booking_Type_Code,
				Booking_Date: this.props.bookingDetail.Booking_Date,
				Booking_No: this.props.bookingDetail.Booking_No,
			}
			this.props.viewPrescription(data, (success, res) => {
				if (success) {
					let arr = []
					if (res.Message[0].Prescription_File1) arr.push(res.Message[0].Prescription_File1)
					if (res.Message[0].Prescription_File2) arr.push(res.Message[0].Prescription_File2)
					arr.forEach(url => FileSaver.saveAs(url))
				}
			})
		}
	}

	removeOldService = data => {
		console.log('old service')
		const newServiceArr = this.state.newServiceArr
		const oldServiceArr = this.state.oldServiceArr

		oldServiceArr.splice(data, 1)
		const serviceArr = oldServiceArr ? oldServiceArr.concat(newServiceArr).unique() : newServiceArr
		let total = 0
		let totalDis = 0
		for (let i = 0, _len = serviceArr.length; i < _len; i++) {
			total += serviceArr[i]['Service_Amount']
			totalDis += serviceArr[i]['Service_Discount']
		}
		console.log('🚀 ~ file: View.js ~ line 205 ~ ViewModal ~ totalDis', totalDis, total)

		this.props.getCollectionCharges(
			{
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				Bill_Amount: this.props.bookingDetail.Bill_Amount,
				Pt_Code: this.props.bookingDetail.Pt_Code,
			},
			(success, data) => {
				if (success) {
					if (this.state.bookType === 'H') {
						console.log('old service H')
						this.setState({ collectionCharges: data.Collection_Charge })
					} else {
						this.setState({ collectionCharges: 0 })
					}
					if (data.Promo_Code && data.Promo_Code.trim() !== '' && this.state.bookType === 'W') {
						console.log('old service W')
						const serviceArr = this.state.serviceArr
						for (let i = 0, _len = serviceArr.length; i < _len; i++) {
							serviceArr[i]['Service_Discount'] =
								(serviceArr[i]['Service_Amount'] * result.Message[0].Offer_Percentage) / 100
						}
						let amount =
							data.Discount_In_Percent > 0
								? this.state.serviceTotal * (data.Discount_In_Percent / 100)
								: this.state.serviceTotal
						this.setState({ promotion: data.Promo_Code }, () => {
							this.setState({
								promoApplied: true,
								promotionSelected: this.state.promotion,
								promoAppliedMsg: 'Promo Applied',
								promotionPercent: data.Discount_In_Percent,
								serviceArr: serviceArr,
								serviceDueAmount: amount + this.state.collectionCharges,
								serviceTotalDis:
									this.state.serviceTotal -
									(this.state.serviceTotal - this.state.serviceTotal * (data.Discount_In_Percent / 100)),
							})
						})
					} else {
						// this.setState({
						// 	promoApplied: false,
						// 	promotion: this.state.promotion,
						// 	promoAppliedMsg: '',
						// 	promotionPercent: 0,
						// })
					}
					let amount = this.state.promotionPercent > 0 ? total * (this.state.promotionPercent / 100) : total
					this.setState({
						newServiceArr: newServiceArr,
						serviceArr: serviceArr,
						serviceTotal: total,
						serviceDueAmount: total + this.state.collectionCharges - totalDis,
						//serviceDueAmount: amount + this.state.collectionCharges,
						serviceTotalDis: total - (total - total * (this.state.promotionPercent / 100)),
					})
				}
			}
		)
		let amount = this.state.promotionPercent > 0 ? total * (this.state.promotionPercent / 100) : total
		this.setState({
			oldServiceArr: oldServiceArr,
			serviceArr: serviceArr,
			serviceTotal: total,
			serviceDueAmount: total + this.state.collectionCharges - totalDis,
			serviceTotalDis: total - (total - total * (this.state.promotionPercent / 100)),
		})
		console.log(total, this.state.collectionCharges, total + this.state.collectionCharges - totalDis)
	}

	removeNewService = data => {
		console.log(data)

		const newServiceArr = this.state.newServiceArr
		const oldServiceArr = this.state.oldServiceArr

		newServiceArr.splice(data, 1)

		const serviceArr = oldServiceArr ? oldServiceArr.concat(newServiceArr).unique() : newServiceArr
		let total = 0
		// let totalDis = 0
		for (let i = 0, _len = serviceArr.length; i < _len; i++) {
			total += serviceArr[i]['Service_Amount']
		}
		console.log('🚀 ~ file: View.js ~ line 279 ~ ViewModal ~ total', total)
		this.props.getCollectionCharges(
			{
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				Bill_Amount: total,
				Pt_Code: this.props.bookingDetail.Pt_Code,
			},
			(success, data) => {
				if (success) {
					if (this.state.bookType === 'H') {
						this.setState({ collectionCharges: data.Collection_Charge })
					} else {
						this.setState({ collectionCharges: 0 })
					}
					if (data.Promo_Code && data.Promo_Code.trim() !== '' && this.state.bookType === 'W') {
						const serviceArr = this.state.serviceArr
						for (let i = 0, _len = serviceArr.length; i < _len; i++) {
							serviceArr[i]['Service_Discount'] =
								(serviceArr[i]['Service_Amount'] * result.Message[0].Offer_Percentage) / 100
						}
						let amount =
							data.Discount_In_Percent > 0
								? this.state.serviceTotal * (data.Discount_In_Percent / 100)
								: this.state.serviceTotal
						this.setState({ promotion: data.Promo_Code }, () => {
							this.setState({
								promoApplied: true,
								promotionSelected: this.state.promotion,
								promoAppliedMsg: 'Promo Applied',
								promotionPercent: data.Discount_In_Percent,
								serviceArr: serviceArr,
								serviceDueAmount: amount + this.state.collectionCharges,
								serviceTotalDis:
									this.state.serviceTotal -
									(this.state.serviceTotal - this.state.serviceTotal * (data.Discount_In_Percent / 100)),
							})
						})
					} else {
						// this.setState({
						// 	promoApplied: false,
						// 	promotion: this.state.promotion,
						// 	promoAppliedMsg: '',
						// 	promotionPercent: 0,
						// })
					}
					let amount = this.state.promotionPercent > 0 ? total * (this.state.promotionPercent / 100) : total
					console.log('🚀 ~ file: View.js ~ line 330 ~ ViewModal ~ amount', amount, this.state.collectionCharges)
					this.setState({
						newServiceArr: newServiceArr,
						serviceArr: serviceArr,
						serviceTotal: total,
						serviceDueAmount: amount + this.state.collectionCharges,
						serviceTotalDis: total - (total - total * (this.state.promotionPercent / 100)),
					})
				}
			}
		)
		let amount = this.state.promotionPercent > 0 ? total * (this.state.promotionPercent / 100) : total
		this.setState({
			newServiceArr: newServiceArr,
			serviceArr: serviceArr,
			serviceTotal: total,
			serviceDueAmount: amount + this.state.collectionCharges,
			serviceTotalDis: total - (total - total * (this.state.promotionPercent / 100)),
		})
	}

	onClickSubmit = () => {
		this.setState({ showLoading: true })

		if (isEmptyArray(this.state.serviceArr)) {
			this.setState({ hasError: true })
		} else if (isEmptyString(this.state.selectedPhlebotomist) && this.props.bookingDetail.Booking_Type_Code !== 'W') {
			this.setState({ hasError: true })
		} else {
			let serArr = []

			this.state.serviceArr.forEach(element => {
				serArr.push({
					Service_Code: element.Service_Code,
					Service_Discount: element.Service_Discount,
					Service_Amount: element.Service_Amount,
				})
			})

			const data = {
				Labadmin_Code: this.props.labAdminCode,
				Firm_No: this.props.bookingDetail.Firm_No,
				Booking_Type: this.props.bookingDetail.Booking_Type_Code,
				Booking_Date: this.props.bookingDetail.Booking_Date,
				Booking_No: this.props.bookingDetail.Booking_No,
				Collector_Code: this.state.selectedPhlebotomist,
				Service_Reg_Data: serArr,
				Promo_Code: this.state.promotion,
				Sample_Collect_Charge: this.state.collectionCharges,
			}
			this.props.bookingUpdate(data, result => {
				this.setState({ showLoading: false })
				if (result.SuccessFlag === 'true') {
					this.props.showNotification('Success', 'Booking updated Successfully', TOAST.TYPE_SUCCESS)
					this.props.onClickClose()
				} else {
					this.props.showNotification('Error', result.Message[0].Message, TOAST.TYPE_ERROR)
				}
			})
		}
	}

	onChange = val => {
		console.log(val)
		const newServiceArr = this.state.newServiceArr
		const oldServiceArr = this.state.oldServiceArr

		let isInArrayOld = _.find(oldServiceArr, { Service_Code: val.value.Service_Code })
		let isInArrayNew = _.find(newServiceArr, { Service_Code: val.value.Service_Code })

		if (isInArrayOld === undefined && isInArrayNew === undefined) {
			newServiceArr.push({
				Service_Code: val.value.Service_Code,
				Service_Name: val.value.Service_Name,
				Service_Amount: val.value.Amount,
				Suppress_Discount: val.Suppress_Discount,
			})
			const serviceArr = oldServiceArr ? oldServiceArr.concat(newServiceArr).unique() : newServiceArr
			let total = 0
			for (let i = 0, _len = serviceArr.length; i < _len; i++) {
				total += serviceArr[i]['Service_Amount']
			}
			for (let i = 0, _len = serviceArr.length; i < _len; i++) {
				serviceArr[i]['Service_Discount'] = (serviceArr[i]['Service_Amount'] * this.state.promotionPercent) / 100
			}
			this.props.getCollectionCharges(
				{
					Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
					Bill_Amount: total,
					Pt_Code: this.props.bookingDetail.Pt_Code,
				},
				(success, data) => {
					if (success) {
						if (this.state.bookType === 'H') {
							this.setState({ collectionCharges: data.Collection_Charge })
						} else {
							this.setState({ collectionCharges: 0 })
						}
						if (data.Promo_Code && data.Promo_Code.trim() !== '' && this.state.bookType === 'W') {
							const serviceArr = this.state.serviceArr
							for (let i = 0, _len = serviceArr.length; i < _len; i++) {
								serviceArr[i]['Service_Discount'] =
									(serviceArr[i]['Service_Amount'] * result.Message[0].Offer_Percentage) / 100
							}
							this.setState({ promotion: data.Promo_Code }, () => {
								let discountAmount =
									data.Discount_In_Percent > 0
										? this.state.serviceTotal -
										  (this.state.serviceTotal - this.state.serviceTotal * (data.Discount_In_Percent / 100))
										: this.state.serviceTotal
								let due = this.state.serviceTotal - discountAmount
								console.log('🚀 ~ file: View.js ~ amount, due', discountAmount, due, this.state.collectionCharges)
								this.setState({
									promoApplied: true,
									promotionSelected: this.state.promotion,
									promoAppliedMsg: 'Promo Applied',
									promotionPercent: data.Discount_In_Percent,
									serviceArr: serviceArr,
									serviceDueAmount: due + this.state.collectionCharges,
									serviceTotal: due + this.state.collectionCharges,
									serviceTotalDis:
										this.state.serviceTotal -
										(this.state.serviceTotal - this.state.serviceTotal * (data.Discount_In_Percent / 100)),
								})
								console.log(
									'gggggggggggggggggggg' + this.state.serviceTotal,
									this.state.serviceTotalDis,
									this.state.serviceDueAmount
								)
							})
						} else {
							const { serviceTotal, serviceArr } = this.state
							for (let i = 0, _len = serviceArr.length; i < _len; i++) {
								serviceArr[i]['Service_Discount'] = 0
							}
							this.setState({
								// promoApplied: false,
								// promotion: this.state.promotion,
								serviceArr: serviceArr,
								serviceTotal: serviceTotal + this.state.collectionCharges,
								// promoAppliedMsg: '',
								// promotionPercent: 0,
								serviceTotalDis: 0,
							})
						}
						let discountAmount = this.state.promotionPercent > 0 ? total * (this.state.promotionPercent / 100) : total
						let due = discountAmount
						console.log('🚀 ~ file: View.js 478~ amount, due', discountAmount, due)
						this.setState({
							newServiceArr: newServiceArr,
							serviceArr: serviceArr,
							serviceTotal: total + this.state.collectionCharges,
							serviceDueAmount: due + this.state.collectionCharges,
							serviceTotalDis: total - (total - total * (this.state.promotionPercent / 100)),
						})
					}
				}
			)
			// let discountAmount = this.state.promotionPercent > 0 ? total * (this.state.promotionPercent / 100) : total
			// let due = discountAmount
			this.setState({
				newServiceArr: newServiceArr,
				serviceArr: serviceArr,
				// serviceTotal: total,
				// serviceDueAmount: due + this.state.collectionCharges,
				// serviceTotalDis: total - (total - total * (this.state.promotionPercent / 100)),
			})
		}
	}

	removeCoupenCode = () => {
		const { serviceTotal, serviceArr } = this.state
		for (let i = 0, _len = serviceArr.length; i < _len; i++) {
			serviceArr[i]['Service_Discount'] = 0
			console.log(serviceArr[i]['Service_Discount'])
		}
		console.log(serviceTotal, serviceArr)
		this.props.getCollectionCharges(
			{
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				Bill_Amount: serviceTotal,
				Pt_Code: this.props.bookingDetail.Pt_Code,
			},
			(success, data) => {
				if (success) {
					if (this.state.bookType === 'H') {
						this.setState({ collectionCharges: data.Collection_Charge })
					}
					if (data.Promo_Code && data.Promo_Code.trim() !== '' && this.state.bookType === 'W') {
						const serviceArr = this.state.serviceArr
						for (let i = 0, _len = serviceArr.length; i < _len; i++) {
							serviceArr[i]['Service_Discount'] =
								(serviceArr[i]['Service_Amount'] * result.Message[0].Offer_Percentage) / 100
						}
						this.setState({ promotion: data.Promo_Code }, () => {
							this.setState({
								promoApplied: true,
								promotionSelected: this.state.promotion,
								promoAppliedMsg: 'Promo Applied',
								promotionPercent: data.Discount_In_Percent,
								serviceArr: serviceArr,
								serviceDueAmount:
									this.state.serviceTotal > 0
										? this.state.serviceTotal - this.state.serviceTotal * (data.Discount_In_Percent / 100)
										: 0,
								serviceTotalDis:
									this.state.serviceTotal -
									(this.state.serviceTotal - this.state.serviceTotal * (data.Discount_In_Percent / 100)),
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
					let total = serviceTotal - this.state.collectionCharges
					//let discountAmount = this.state.promotionPercent > 0 ? total * (this.state.promotionPercent / 100) : total
					let discountAmount = 0
					this.setState({
						serviceArr: serviceArr,
						//serviceDueAmount: discountAmount + this.state.collectionCharges,
						serviceDueAmount: Number(serviceTotal) + Number(this.state.collectionCharges),
						serviceTotalDis: 0,
						promotionPercent: 0,
						promotion: '',
						promoApplied: false,
						promoAppliedMsg: '',
					})
				}
			}
		)
		let total = serviceTotal - this.state.collectionCharges
		//let discountAmount = this.state.promotionPercent > 0 ? total * (this.state.promotionPercent / 100) : total
		let discountAmount = 0
		let due = discountAmount
		this.setState({
			serviceArr: serviceArr,
			//serviceDueAmount: due + this.state.collectionCharges,
			serviceDueAmount: Number(serviceTotal) + Number(this.state.collectionCharges),
			serviceTotalDis: 0,
			promotionPercent: 0,
			promotion: '',
			promoApplied: false,
			promoAppliedMsg: '',
		})
	}

	render() {
		return (
			<Modal isOpen toggle={() => this.props.onClickClose()} size='lg'>
				<ModalHeader toggle={() => this.props.onClickClose()} className='w-100'>
					<div className='d-flex w-100 justify-content-between'>
						<div className='p-2'>View Bookings</div>

						<div className='p-2 d-flex row'>
							<div>
								{this.props.bookingDetail.Payment_Full_Desc && (
									<span className='badge badge-pill badge-success'>{this.props.bookingDetail.Payment_Full_Desc}</span>
								)}
							</div>
							<span className='ml-4'>
								{this.props.bookingDetail.IsPrescription !== 'false' &&
								this.props.bookingDetail.IsPrescription !== false ? (
									<>
										<img src={require('../../../assets/media/images/pdf.svg')} alt='pdf' width='20' height='20' />
										<button className='btn btn-link' onClick={() => this.downloadFile()}>
											View Prescription
										</button>
									</>
								) : null}
							</span>
							<span className='ml-4 d-block'>
								{this.props.bookingDetail.Invoice_Status !== false &&
								this.props.bookingDetail.Invoice_Status !== 'false' ? (
									<>
										<img src={require('../../../assets/media/images/pdf.svg')} alt='pdf' width='10' height='10' />
										<button
											disabled={this.state.invoiceLoading}
											className='btn btn-link'
											onClick={() => this.downloadFile('invoice')}
										>
											{this.state.invoiceLoading ? 'Opening...' : 'View Invoice'}
										</button>
									</>
								) : null}
							</span>
						</div>
					</div>
				</ModalHeader>
				<ModalBody>
					{this.props.loading ? (
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
												<h5 className='title'>BID : {this.props.bookingDetail.Booking_No}</h5>
												{this.props.bookingDetail.Sid_No && props.Sid_No.trim().length ? (
													<h5 className='title'>SID : {this.props.bookingDetail.Sid_No}</h5>
												) : null}
												<p className='desc'>{this.props.bookingDetail.Visit_Date_Desc}</p>
											</div>
										</div>
										<div className='p-2'>
											<div className='info'>
												<h5 className='title'>Booking Date</h5>
												<p className='desc'>{moment(this.props.bookingDetail.Booking_Date).format('DD/MM/YYYY')}</p>
											</div>
										</div>
										<div className='p-2'>
											<div className='info'>
												<h5 className='title'>Schedule Date</h5>
												<p className='desc'>{moment(this.props.bookingDetail.Visit_Date).format('DD/MM/YYYY')}</p>
											</div>
										</div>

										<div className='ml-auto p-2'>
											<div className='info'>
												<h5 className='title'>
													{this.props.branchName ? (
														<>
															<i className='far fa-map-marker-alt pr-1' />
															{this.props.branchName}
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
															this.props.bookingDetail.Pt_Profile_Picture
																? this.props.bookingDetail.Pt_Profile_Picture
																: profile
														}
														alt=''
													/>
													<div className='overflow-auto'>
														<p className='m-0 text-truncate' title={this.props.modalName}>
															{this.props.modalName}
														</p>
														<p className='m-0'>Age - {this.props.bookingDetail.First_Age}</p>
													</div>
												</div>
												<div className='col-sm-8 col-8'>
													<div className='d-flex flex-row'>
														<div>
															<p className='m-0'>
																<i className='far fa-mars pr-1' />
																{this.props.bookingDetail.Gender_Desc}
															</p>
														</div>
														<div className='pl-3'>
															<p className='m-0'>
																{this.props.bookingDetail.Mobile_No ? <i className='far fa-mobile pr-1' /> : null}
																{this.props.bookingDetail.Mobile_No}
															</p>
														</div>
													</div>
													<div>
														<p className='m-0 text-break'>
															{this.props.bookingDetail.Full_Address && <i className='far fa-map-marker-alt pr-1' />}
															{this.props.bookingDetail.Full_Address
																? `${this.props.bookingDetail.Full_Address}, `
																: ''}
															{/* {this.props.bookingDetail.Pt_Street ? `${this.props.bookingDetail.Pt_Street}, ` : ''}
															{this.props.bookingDetail.Pt_Place ? `${this.props.bookingDetail.Pt_Place}, ` : ''}
															{this.props.bookingDetail.Pt_Landmark ? `${this.props.bookingDetail.Pt_Landmark}, ` : ''}
															{this.props.bookingDetail.Pt_City ? `${this.props.bookingDetail.Pt_City}, ` : ''}
															{this.props.bookingDetail.Pt_PinCode ? `${this.props.bookingDetail.Pt_PinCode}.` : ''} */}
														</p>
													</div>
													{/* <p className='m-0 pt-2'>
														<i className='far fa-map-marker-alt pr-1' />
														{this.props.bookingDetail.Booking_Status_Desc}
														<br /> {this.props.bookingDetail.Booking_Status_Desc}
													</p> */}
													<div>
														<p className='text-wrap badge badge-warning mt-2 mb-3 text-truncate'>
															{this.props.bookingDetail.Booking_Status_Desc}
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
												{this.state.serviceArr &&
													this.state.serviceArr.map((item, i) => {
														return (
															<tr key={i}>
																<th scope='col'>{item.Service_Name}</th>
																<td scope='col'>
																	{/* <p className='mb-0 mr-4 text-color text-danger'>{item.Service_Discount}</p> */}
																</td>
																<td scope='col'>{item.Service_Amount.toFixed(2)}</td>
															</tr>
														)
													})}
												<tr>
													<th scope='row'>Sample Collection Charge</th>
													<th />
													<th>{this.state.collectionCharges && this.state.collectionCharges.toFixed(2)}</th>
												</tr>
												<tr>
													<th scope='row'>Amount Payable</th>
													<th>
														{this.state.serviceDueAmount !== 0 && (
															<p className='mb-0 mr-4 text-color text-danger'>
																{this.state.serviceTotalDis.toFixed(2)}
															</p>
														)}
													</th>
													<th>{this.state.serviceDueAmount.toFixed(2)}</th>
												</tr>
												<tr>
													<th scope='row'>Amount Paid</th>
													<th>
														{this.state.Paid_Amount !== 0 && (
															<p className='mb-0 mr-4 text-color text-danger'>
																{this.state.serviceTotalDis.toFixed(2)}
															</p>
														)}
													</th>
													<th>{this.state.Paid_Amount.toFixed(2)}</th>
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
												<Input
													type='select'
													id='filter'
													placeholder='Select'
													name='selectedPhlebotomist'
													disabled={
														this.props.bookingDetail.Is_Editable_CollectorAssign === false ||
														this.props.bookingDetail.Is_Editable_CollectorAssign === 'false' ||
														!this.props.bookingDetail.Is_Editable_CollectorAssign
													}
													onChange={e => this.handleChange(e)}
													value={this.state.selectedPhlebotomist}
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
										{this.state.hasError &&
											isEmptyString(this.state.selectedPhlebotomist) &&
											this.props.bookingDetail.Booking_Type_Code !== 'W' && (
												<div>
													<small className='text-danger'>Phlebotomist is required</small>
												</div>
											)}
										<h6 className='mt-4'>Visit Type</h6>

										{this.props.visitType &&
											this.props.visitType.map((item, i) => {
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
																	onChange={e => this.handleChange(e)}
																	disabled
																	checked={this.state.bookType === item.Booking_Type_Code}
																/>
																{item.Type_Of_Booking}
															</label>
														</div>
													)
												}
											})}
										<div className='input-group mt-4'>
											<h6 className='mt-4'>Search Test</h6>
											<AsyncSelect
												className='react-select'
												inputValue={this.state.newValue}
												cacheOptions
												value={this.state.newValue}
												placeholder='Search Test'
												loadOptions={this.loadOptions}
												defaultOptions
												onInputChange={this.getTest}
												onChange={this.onChange}
												isDisabled={
													!this.props.bookingDetail.Is_Editable_Booking ||
													this.props.bookingDetail.Is_Editable_Booking === 'false' ||
													this.props.bookingDetail.Is_Editable_Booking === false
												}
											/>
											{this.state.hasError && isEmptyArray(this.state.serviceArr) && (
												<div>
													<small className='text-danger'>Select an Service to Continue</small>
												</div>
											)}
											{this.state.oldServiceArr &&
												this.state.oldServiceArr.map((item, i) => {
													return (
														<button
															key={i}
															type='button'
															className='btn btn-sm btn-primary button-tag'
															onClick={() => this.removeOldService(i)}
															style={{ marginRight: '10px', marginBottom: '10px' }}
															disabled={!item.Is_Editable_Service || item.Is_Editable_Service === false}
														>
															{item.Service_Name}
															<span className='badge badge-close'>
																<i className='far fa-times' />
															</span>
														</button>
													)
												})}
											{this.state.newServiceArr &&
												this.state.newServiceArr.map((item, i) => {
													return (
														<button
															key={i}
															type='button'
															className='btn btn-sm btn-primary button-tag'
															onClick={() => this.removeNewService(i)}
															style={{ marginRight: '10px', marginBottom: '10px' }}
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
												Voucher Code{' '}
												<span
													className='ml-2'
													style={{ float: 'right', color: this.state.promoApplied ? 'green' : 'red' }}
												>
													{this.state.promoAppliedMsg}
												</span>
											</h6>
											<InputGroup>
												<input
													type='text'
													className='form-control bg-transparent patient-details'
													placeholder='Voucher Code'
													name='promotion'
													value={this.state.promotion}
													disabled={
														!this.props.bookingDetail.Is_Editable_Booking ||
														this.props.bookingDetail.Is_Editable_Booking === 'false' ||
														this.props.bookingDetail.Is_Editable_Booking === false
													}
													onChange={e => this.handleChange(e)}
												/>
												{!this.state.showPromotionLoading && this.state.promotion ? (
													<span
														className={`${
															!this.props.bookingDetail.Is_Editable_Booking ||
															this.props.bookingDetail.Is_Editable_Booking === 'false' ||
															this.props.bookingDetail.Is_Editable_Booking === false
																? 'disabled'
																: ''
														} fa fa-times-circle closeIcon`}
														onClick={() => this.removeCoupenCode()}
													/>
												) : (
													''
												)}
												<InputGroupAddon addonType='append'>
													<Button
														color='secondary'
														disabled={
															!this.props.bookingDetail.Is_Editable_Booking ||
															this.props.bookingDetail.Is_Editable_Booking === 'false' ||
															this.props.bookingDetail.Is_Editable_Booking === false ||
															this.state.showPromotionLoading
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
							</div>
							<br />
						</>
					)}
				</ModalBody>
				<ModalFooter>
					{(this.props.bookingDetail.Is_Editable_Booking ||
						this.props.bookingDetail.Is_Editable_Booking === 'true' ||
						this.props.bookingDetail.Is_Editable_CollectorAssign ||
						this.props.bookingDetail.Is_Editable_CollectorAssign === 'true') && (
						<button type='button' className='btn btn-dark rounded mr-2' onClick={() => this.onClickSubmit()}>
							Update
						</button>
					)}
					<button type='button' className='btn btn-light rounded mr-2' onClick={() => this.props.onClickClose()}>
						Close
					</button>
				</ModalFooter>
			</Modal>
		)
	}
}

ViewModal1.propTypes = {
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
})(ViewModal1)
