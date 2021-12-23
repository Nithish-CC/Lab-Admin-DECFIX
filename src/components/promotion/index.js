import React, { Component } from 'react'
import { Layout } from '../common/Layout'
import Card from './Card'
import moment from 'moment'
import { getPromotiontDetails } from '../../actions/bookTestAction'
import { addPromotion, modifyPromotion } from '../../actions//promotionAction'
import { isEmptyString } from '../../utils/validations'
import { Spinner, FormGroup, Label, Input } from 'reactstrap'
import PropTypes from 'prop-types'
import DatePicker from 'reactstrap-date-picker'
import { showNotification } from '../../actions/commonAction'
import { TOAST } from '../../utils/Constants'
import { getLabadminCode } from '../../utils/Utility'
import { resetToInitialState } from '../../actions/commonAction'
class Promotion extends Component {
	constructor(props) {
		super(props)
		this.myRef = React.createRef()
		this.state = {
			hasError: false,
			showLoading: false,
			promotionName: '',
			discountPercent: '',
			startDate: moment(new Date()).format('YYYY-MM-DD'),
			endDate: moment(new Date()).format('YYYY-MM-DD'),
			description: '',
			offerCode: '',
			offerTimes: '',
			showToast: true,
			errorMsg: '',
			showLoadingOnClick: false,
			showInActiveInput: false,
			isEdit: false,
			inActive: false,
		}
	}

	componentDidMount() {
		this.props.resetToInitialState()
		this.getPromotiontDetails()
	}

	getPromotiontDetails = () => {
		this.setState({ showLoading: true })
		const data = {
			Labadmin_Code: getLabadminCode(),
		}
		this.props.getPromotiontDetails(data, result => {
			this.setState({ showLoading: false })
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})
	}

	handleChange = event => {
		if (event.target.name !== 'discountPercent' && event.target.name !== 'offerCode') {
			this.setState({ [event.target.name]: event.target.value })
		} else if (event.target.name !== 'discountPercent' && event.target.name === 'offerCode') {
			this.setState({ [event.target.name]: event.target.value.replace(/\s/g, '') })
		} else {
			const re = /^[0-9\b]+$/

			if (re.test(event.target.value) || event.target.value === '') {
				this.setState({ [event.target.name]: event.target.value })
			}
		}
	}

	onClickSubmit = () => {
		if (
			isEmptyString(this.state.promotionName) ||
			isEmptyString(String(this.state.discountPercent)) ||
			isEmptyString(this.state.startDate) ||
			isEmptyString(this.state.endDate) ||
			isEmptyString(this.state.description) ||
			isEmptyString(String(this.state.offerTimes)) ||
			isEmptyString(this.state.offerCode)
		) {
			this.setState({ hasError: true })
		} else {
			let data = {
				Labadmin_Code: getLabadminCode(),
				Promotion_Name: this.state.promotionName,
				Promotion_Description: this.state.description,
				Promo_Code: this.state.offerCode,
				Offer_Times: Number(this.state.offerTimes),
				Discount_In_Percent: this.state.discountPercent,
				Start_Date: moment(this.state.startDate).format('YYYY/MM/DD'),
				End_Date: moment(this.state.endDate).format('YYYY/MM/DD'),
			}
			this.setState({ showLoadingOnClick: true })
			if (this.state.isEdit) {
				data.Inactive = this.state.inActive
				this.props.modifyPromotion(data, (result, message) => {
					this.setState({ showLoadingOnClick: false })
					if (result === true) {
						this.props.showNotification('Success', 'Promotion updated successfully', TOAST.TYPE_SUCCESS)
						this.setState({
							hasError: false,
							showLoading: false,
							promotionName: '',
							discountPercent: '',
							startDate: moment(new Date()).format('YYYY-MM-DD'),
							endDate: moment(new Date()).format('YYYY-MM-DD'),
							description: '',
							offerCode: '',
							offerTimes: '',
							showToast: true,
							errorMsg: '',
							inActive: false,
							showLoadingOnClick: false,
							isEdit: false,
						})
						this.getPromotiontDetails()
					} else {
						this.props.showNotification('Error', message, TOAST.TYPE_ERROR)
					}
				})
			} else {
				this.props.addPromotion(data, (result, message) => {
					this.setState({ showLoadingOnClick: false })
					if (result === true) {
						this.props.showNotification('Success', 'Promotion created successfully', TOAST.TYPE_SUCCESS)
						this.setState({
							hasError: false,
							showLoading: false,
							promotionName: '',
							discountPercent: '',
							startDate: moment(new Date()).format('YYYY-MM-DD'),
							endDate: moment(new Date()).format('YYYY-MM-DD'),
							description: '',
							offerTimes: '',
							offerCode: '',
							showToast: true,
							isEdit: false,
							errorMsg: '',
							showLoadingOnClick: false,
							inActive: false,
						})
						this.getPromotiontDetails()
					} else {
						this.props.showNotification('Error', message, TOAST.TYPE_ERROR)
					}
				})
			}
		}
	}
	executeScroll = () => this.myRef.current.scrollIntoView()

	fillValuesToFields = item => {
		this.executeScroll()
		this.setState({
			showInActiveInput: true,
			isEdit: true,
			promotionName: item.Promotion_Name,
			discountPercent: item.Discount_In_Percent,
			startDate: item.Start_Date
				? moment(item.Start_Date, 'DD/MM/YYYY').format('YYYY-MM-DD')
				: moment(new Date()).format('YYYY-MM-DD'),
			endDate: item.End_Date
				? moment(item.End_Date, 'DD/MM/YYYY').format('YYYY-MM-DD')
				: moment(new Date()).format('YYYY-MM-DD'),
			description: item.Promotion_Description,
			offerCode: item.Promo_Code,
			offerTimes: item.Offer_Times,
			inActive: item.Inactive,
		})
	}

	render() {
		return (
			<div className='main-content overflow-auto pb-3'>
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-12 p-0'>
							<div className='bg-white p-3 rounded'>
								<div className='row'>
									<div className='col-9'>
										<h4 className='float-left' ref={this.myRef}>
											Promotions
										</h4>
									</div>
								</div>
								<hr className='mb-3 mt-0' />
								<div className='filter-product  bg-dark p-4 '>
									<div className='row'>
										<div className='card-body py-1'>
											<h5 className='text-black pb-2'>{this.state.isEdit ? 'Edit' : 'Add'} Promotion</h5>
											<div className='row mt-3'>
												<div className='col-lg-6 col-sm-6'>
													<div className='form-group mb-lg-0'>
														<label>Promotion Name</label>
														<input
															type='text'
															className='form-control bg-transparent form-control-border'
															placeholder='Promotion Name'
															value={this.state.promotionName}
															name='promotionName'
															onChange={e => this.handleChange(e)}
														/>
														{this.state.hasError && isEmptyString(this.state.promotionName) && (
															<div>
																<small className='text-danger'>promotion name is required</small>
															</div>
														)}
													</div>
												</div>
												<div className='col-lg-2 col-sm-2'>
													<div className='form-group mb-lg-0'>
														<label>Discount %</label>
														<input
															type='text'
															className='form-control bg-transparent form-control-border'
															placeholder='Discount %'
															value={this.state.discountPercent}
															name='discountPercent'
															onChange={e => this.handleChange(e)}
															maxLength={3}
														/>
														{this.state.hasError && isEmptyString(this.state.discountPercent) && (
															<div>
																<small className='text-danger'>discount percent is required</small>
															</div>
														)}
													</div>
												</div>
												<div className='col-lg-2 col-sm-2'>
													<div className='form-group mb-lg-0'>
														<label>Start Date</label>
														<FormGroup>
															<DatePicker
																name='startDate'
																value={this.state.startDate}
																onChange={e => {
																	this.setState(
																		{
																			startDate: moment(e).isValid()
																				? moment(e).format('YYYY-MM-DD')
																				: moment(new Date()).format('YYYY-MM-DD'),
																			// endDate: moment(e).isValid()
																			// 	? moment(e).format('YYYY-MM-DD')
																			// 	: moment(new Date()).format('YYYY-MM-DD'),
																		},
																		() => {
																			if (moment(e).isAfter(this.state.endDate)) {
																				this.setState({
																					endDate: moment(e).isValid()
																						? moment(e).format('YYYY-MM-DD')
																						: moment(new Date()).format('YYYY-MM-DD'),
																				})
																			}
																		}
																	)
																}}
																// maxDate={moment(this.state.endDate).format('YYYY-MM-DD')}
																minDate={moment(new Date()).format('YYYY-MM-DD')}
																// disabled={this.state.isEdit}
																dateFormat='DD/MM/YYYY'
																showClearButton={false}
															/>
															{this.state.hasError && isEmptyString(this.state.startDate) && (
																<div>
																	<small className='text-danger'>start date is required</small>
																</div>
															)}
														</FormGroup>
													</div>
												</div>
												<div className='col-lg-2 col-sm-2'>
													<div className='form-group mb-lg-0'>
														<label>End Date</label>

														<FormGroup>
															<DatePicker
																name='endDate'
																value={this.state.endDate}
																onChange={e =>
																	this.setState({
																		endDate: moment(e).isValid()
																			? moment(e).format('YYYY-MM-DD')
																			: moment(this.state.startDate).format('YYYY-MM-DD'),
																	})
																}
																minDate={moment(this.state.startDate).format('YYYY-MM-DD')}
																dateFormat='DD/MM/YYYY'
																showClearButton={false}
															/>
															{this.state.hasError && isEmptyString(this.state.endDate) && (
																<div>
																	<small className='text-danger'>end date is required</small>
																</div>
															)}
														</FormGroup>
													</div>
												</div>
											</div>
											<div className='row mt-3'>
												<div className='col-lg-6 col-sm-6'>
													<div className='form-group mb-lg-0'>
														<label>Description</label>
														<input
															type='text'
															className='form-control bg-transparent form-control-border'
															placeholder='Description'
															value={this.state.description}
															name='description'
															onChange={e => this.handleChange(e)}
														/>
														{this.state.hasError && isEmptyString(this.state.description) && (
															<div>
																<small className='text-danger'>description is required</small>
															</div>
														)}
													</div>
												</div>
												<div className='col-lg-3 col-sm-3'>
													<div className='form-group mb-lg-0'>
														<label>Offer Code</label>
														<input
															type='text'
															className='form-control bg-transparent form-control-border'
															placeholder='Offer Code'
															value={this.state.offerCode}
															name='offerCode'
															onChange={e => this.handleChange(e)}
														/>
														{this.state.hasError && isEmptyString(this.state.offerCode) && (
															<div>
																<small className='text-danger'>offer code is required</small>
															</div>
														)}
													</div>
												</div>
												<div className='col-lg-3 col-sm-3'>
													<div className='form-group mb-lg-0'>
														<label>Offer Times</label>
														<input
															type='number'
															className='form-control bg-transparent form-control-border'
															placeholder='No.of Offer Times'
															value={this.state.offerTimes}
															name='offerTimes'
															onChange={e => this.handleChange(e)}
														/>
														{this.state.hasError && isEmptyString(this.state.offerCode) && (
															<div>
																<small className='text-danger'>offer times is required</small>
															</div>
														)}
													</div>
												</div>
												<div className='col-sm d-flex align-items-center justify-content-end'>
													{this.state.showInActiveInput && this.state.isEdit && (
														<FormGroup check className='mt-2'>
															<Label check>
																<Input
																	type='checkbox'
																	name='inActive'
																	checked={this.state.inActive}
																	onChange={e => this.setState({ inActive: e.target.checked })}
																/>{' '}
																Inactive
															</Label>
														</FormGroup>
													)}
													<div className='mt-3 d-flex justify-content-end ml-4'>
														<button
															className='btn btn-sm btn-primary mb-1 mr-2'
															disabled={this.state.showLoadingOnClick}
															onClick={() => this.onClickSubmit()}
														>
															{this.state.isEdit ? 'Update' : 'Submit'}
															{this.state.showLoadingOnClick && <Spinner size='sm' className='ml-2 m-1' />}
														</button>
														{this.state.isEdit && (
															<button
																className='btn btn-sm btn-secondary mb-1'
																disabled={this.state.showLoadingOnClick}
																onClick={() => {
																	this.setState({
																		hasError: false,
																		showLoading: false,
																		promotionName: '',
																		discountPercent: '',
																		startDate: moment(new Date()).format('YYYY-MM-DD'),
																		endDate: moment(new Date()).format('YYYY-MM-DD'),
																		description: '',
																		offerCode: '',
																		showToast: true,
																		errorMsg: '',
																		inActive: false,
																		showLoadingOnClick: false,
																		offerTimes: '',
																		isEdit: false,
																	})
																}}
															>
																Cancel
															</button>
														)}
													</div>
												</div>
											</div>
											<div className='row  col-12 mt-3 pt-4'>
												{this.state.errorMsg && (
													<div>
														<small className='text-danger'>{this.state.errorMsg}</small>
													</div>
												)}
											</div>
										</div>
									</div>
									<div className='row mt-3'>
										<div className='card-body'>
											<h5 className='text-black pb-3'>Promotions</h5>
											<div className='row'>
												{this.state.showLoading ? (
													<div className='col-12 d-flex flex-wrap justify-content-center'>
														<Spinner size='lg' className='ml-2 m-1 spinner' />
													</div>
												) : (
													<>
														{this.props.promotionList &&
															this.props.promotionList.map((item, i) => {
																return <Card key={i} {...item} fillValues={() => this.fillValuesToFields(item)} />
															})}
													</>
												)}
											</div>
										</div>
									</div>
								</div>
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
		promotionList: state.bookTestState.promotionList,
	}
}

Promotion.propTypes = {
	promotionList: PropTypes.array,
	addPromotion: PropTypes.func,
	getPromotiontDetails: PropTypes.func,
	showNotification: PropTypes.func,
	resetToInitialState: PropTypes.func,
	modifyPromotion: PropTypes.func,
}

export default Layout(Promotion, mapStateToProps, {
	addPromotion,
	getPromotiontDetails,
	showNotification,
	resetToInitialState,
	modifyPromotion,
})
