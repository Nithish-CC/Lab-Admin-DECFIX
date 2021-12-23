import React, { Component } from 'react'
import { Layout } from '../common/Layout'
import Card from './Card'
import moment from 'moment'
import { getTestDetails } from '../../actions/bookingDetailsAction'
import { getGroupTest, addGroupTest } from '../../actions/groupTestAction'
import { isEmptyString, isEmptyArray } from '../../utils/validations'
import { Spinner, FormGroup } from 'reactstrap'
import PropTypes from 'prop-types'
import store from 'store'
import DatePicker from 'reactstrap-date-picker'
import AsyncSelect from 'react-select/async'
import { showNotification } from '../../actions/commonAction'
import { TOAST } from '../../utils/Constants'
import View from './modal/View'
import { resetToInitialState } from '../../actions/commonAction'

const stateData = {
	hasError: false,
	showLoading: false,
	packageName: '',
	packageCost: 0,
	showToast: true,
	errorMsg: '',
	testArr: [],
	startIndex: 1,
	pageCount: 100,
	testValue: [],
	showLoadingOnClick: false,
	showModal: false,
	modalData: {},
	startDate: moment(new Date()).format('YYYY-MM-DD'),
	endDate: moment(new Date()).format('YYYY-MM-DD'),
	testArrVal: [],
}

class Promotion extends Component {
	constructor(props) {
		super(props)
		this.state = stateData
	}

	componentDidMount() {
		this.props.resetToInitialState()
		this.setState({ showLoading: true })
		const data = {
			Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
		}
		this.props.getGroupTest(data, result => {
			this.setState({ showLoading: false })
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})
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
		if (event.target.name !== 'packageCost') {
			this.setState({ [event.target.name]: event.target.value })
		} else {
			const re = /^[0-9\b]+$/

			if (re.test(event.target.value) || event.target.value === '') {
				this.setState({ [event.target.name]: event.target.value })
			}
		}
	}

	onClickSubmit = () => {
		const data = {
			Package_Name: this.state.packageName,
			Package_Amount: this.state.packageCost,
			Services_In_A_Package: this.state.testArr,
			From_Date: this.state.startDate ? moment(this.state.startDate).format('YYYY/MM/DD') : '',
			To_Date: this.state.endDate ? moment(this.state.endDate).format('YYYY/MM/DD') : '',
		}

		if (isEmptyString(this.state.packageName) || this.state.packageCost <= 0 || isEmptyArray(this.state.testArr)) {
			this.setState({ hasError: true })
		} else {
			this.setState({ showLoadingOnClick: true })
			this.props.addGroupTest(data, result => {
				this.setState({ showLoadingOnClick: false })
				if (result === true) {
					this.props.showNotification('Success', 'Group test created successfully', TOAST.TYPE_SUCCESS)
					this.setState(stateData)
				} else {
					this.props.showNotification('Error', result, TOAST.TYPE_ERROR)
				}
			})
		}
	}

	onChange = val => {
		const arr = []
		val &&
			val.forEach(element => {
				arr.push({ Service_Code: element.value.Service_Code })
			})
		this.setState({ testArr: arr, testArrVal: val })
	}

	onClickOpen = data => {
		this.setState({ modalData: data, showModal: true })
	}

	onClickClose = () => {
		this.setState({ showModal: false })
	}

	render() {
		return (
			<div className='main-content overflow-auto pb-3'>
				<div className='container-fluid  '>
					{this.state.showModal && <View onClickClose={() => this.onClickClose()} {...this.state.modalData} />}
					<div className='row'>
						<div className='col-12 p-0'>
							<div className='bg-white p-3 rounded'>
								<div className='row'>
									<div className='col-9'>
										<h4 className='float-left'>Group Test</h4>
									</div>
								</div>
								<hr className='mb-3 mt-0' />
								<div className='filter-product  bg-dark p-4 '>
									<div className='row'>
										<div className='card-body py-1'>
											<h5 className='text-black pb-2'>Add Group Test</h5>
											<div className='row mt-3'>
												<div className='col-lg-6 col-sm-6'>
													<div className='form-group mb-lg-0'>
														<label>Package Name</label>
														<input
															type='text'
															className='form-control bg-transparent form-control-border'
															placeholder='Package Name'
															value={this.state.packageName}
															name='packageName'
															onChange={e => this.handleChange(e)}
														/>
														{this.state.hasError && isEmptyString(this.state.packageName) && (
															<div>
																<small className='text-danger'>Package name is required</small>
															</div>
														)}
													</div>
												</div>
												<div className='col-lg-6 col-sm-6'>
													<div className='form-group mb-lg-0'>
														<label>Add Test</label>
														<AsyncSelect
															className='react-select'
															loadOptions={this.loadOptions}
															onInputChange={this.getTest}
															onChange={this.onChange}
															isMulti
															value={this.state.testArrVal}
															placeholder='Search Test'
														/>
														{this.state.hasError && isEmptyArray(this.state.testArr) && (
															<div>
																<small className='text-danger'>Test is required</small>
															</div>
														)}
													</div>
												</div>
											</div>
											<div className='row mt-3'>
												<div className='col-lg-2 col-sm-2'>
													<div className='form-group mb-lg-0'>
														<label>Package Cost(Rs)</label>
														<input
															type='text'
															className='form-control bg-transparent form-control-border'
															placeholder='Package Cost'
															value={this.state.packageCost}
															name='packageCost'
															onChange={e => this.handleChange(e)}
														/>
														{this.state.hasError && this.state.packageCost <= 0 && (
															<div>
																<small className='text-danger'>Package Cost is required</small>
															</div>
														)}
													</div>
												</div>
												<div className='col-lg-2 col-sm-2'>
													<div className='form-group mb-lg-0'>
														<label>From Date</label>
														<FormGroup>
															<DatePicker
																name='startDate'
																value={this.state.startDate}
																onChange={e =>
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
																}
																// maxDate={moment(this.state.endDate).format('YYYY-MM-DD')}
																minDate={moment(new Date()).format('YYYY-MM-DD')}
																dateFormat='DD/MM/YYYY'
																showClearButton={false}
															/>
														</FormGroup>
													</div>
												</div>
												<div className='col-lg-2 col-sm-2'>
													<div className='form-group mb-lg-0'>
														<label>To Date</label>

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
																// maxDate={moment(new Date()).format('YYYY-MM-DD')}
																minDate={moment(this.state.startDate).format('YYYY-MM-DD')}
																dateFormat='DD/MM/YYYY'
																showClearButton={false}
															/>
														</FormGroup>
													</div>
												</div>
												<div className='col-sm-6 d-flex justify-content-start align-items-center'>
													<div className='mt-3'>
														<button
															className='btn btn-sm btn-primary'
															disabled={this.state.showLoadingOnClick}
															onClick={() => this.onClickSubmit()}
														>
															Submit
															{this.state.showLoadingOnClick && <Spinner size='sm' className='ml-2 m-1' />}
														</button>
													</div>
												</div>
											</div>
											{this.state.errorMsg && (
												<div>
													<small className='text-danger'>{this.state.errorMsg}</small>
												</div>
											)}
										</div>
									</div>
									<div className='row mt-3'>
										<div className='card-body'>
											<h5 className='text-black pb-3'>Groups Test List</h5>
											<div className='row'>
												{this.state.showLoading ? (
													<div className='col-12 d-flex flex-wrap justify-content-center'>
														<Spinner size='lg' className='ml-2 m-1 spinner' />
													</div>
												) : (
													<>
														{this.props.groupTestList &&
															this.props.groupTestList.map((item, i) => {
																return <Card key={i} {...item} onClickOpen={data => this.onClickOpen(data)} />
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
		groupTestList: state.groupTestState.groupTestList,
		testList: state.bookingDetailsState.testList,
	}
}

Promotion.propTypes = {
	groupTestList: PropTypes.array,
	testList: PropTypes.array,
	addGroupTest: PropTypes.func,
	getGroupTest: PropTypes.func,
	getTestDetails: PropTypes.func,
	showNotification: PropTypes.func,
	resetToInitialState: PropTypes.func,
}

export default Layout(Promotion, mapStateToProps, {
	addGroupTest,
	getGroupTest,
	getTestDetails,
	showNotification,
	resetToInitialState,
})
