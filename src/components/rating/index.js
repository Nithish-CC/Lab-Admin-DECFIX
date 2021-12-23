import React, { Component } from 'react'
import { Layout } from '../common/Layout'
import Card from './Card'
import moment from 'moment'
import { getRatedBy, getRatingActionType, getRating, getRatingByStar, getReviewType } from '../../actions/ratingAction'
import { Spinner, FormGroup, Input, Table } from 'reactstrap'
import PropTypes from 'prop-types'
import store from 'store'
import DatePicker from 'reactstrap-date-picker'
import { CSVLink } from 'react-csv'
import { getLabadminCode } from '../../utils/Utility'
import { showNotification } from '../../actions/commonAction'
import { TOAST } from '../../utils/Constants'

const stateData = {
	hasError: false,
	showLoading: false,
	startDate: moment(new Date()).format('YYYY-MM-DD'),
	endDate: moment(new Date()).format('YYYY-MM-DD'),
	ratedBy: '',
	ratingType: '',
	rating: 0,
	reviewType: '',
	dataArr: [],
}

class Rating extends Component {
	constructor(props) {
		super(props)
		this.state = stateData
	}

	componentDidMount() {
		this.setState({ showLoading: true })
		const reviewData = {
			Labadmin_Code: getLabadminCode(),
			Search_Type_Code: 'V',
		}
		this.props.getReviewType(reviewData, result => {
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})

		const ratingActionTypeData = {
			Labadmin_Code: getLabadminCode(),
			Search_Type_Code: 'A',
		}
		this.props.getRatingActionType(ratingActionTypeData, result => {
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})

		const ratingByStartData = {
			Labadmin_Code: getLabadminCode(),
			Search_Type_Code: 'S',
		}
		this.props.getRatingByStar(ratingByStartData, result => {
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})

		const ratedByData = {
			Labadmin_Code: getLabadminCode(),
			Search_Type_Code: 'B',
		}
		this.props.getRatedBy(ratedByData, result => {
			this.setState({ showLoading: false })
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})

		this.onClickSubmit()
	}

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value })
	}

	onClickSubmit = () => {
		if (moment(this.state.startDate).isAfter(this.state.endDate)) {
			this.props.showNotification('Error', 'To date is greater than From date.', TOAST.TYPE_ERROR)
		} else {
			const data = {
				Labadmin_Code: getLabadminCode(),
				Firm_No: store.get('userSession').Message[0].Firm_No,
				Review_Code: this.state.reviewType,
				Rating_No: this.state.rating,
				Rating_Action_Type: this.state.ratingType,
				Rated_By: this.state.ratedBy,
				Date_From: moment(this.state.startDate).format('YYYY/MM/DD'),
				Date_To: moment(this.state.endDate).format('YYYY/MM/DD'),
			}
			this.setState({ showLoading: true })
			this.props.getRating(data, result => {
				this.setState({ showLoading: false })
				if (result.Code === 200) {
					let dataArr = []

					result.Message[0].Rating_Detail.forEach(function (item) {
						dataArr.push({
							Branch_Name: item.Branch_Name,
							Booking_Type_Desc: item.Booking_Type_Desc,
							Booking_Date: item.Booking_Date,
							Booking_No: item.Booking_No,
							Rated_By: item.Rated_By,
							Rating_Service_In_Number: item.Rating_Service_In_Number,
							Rating_Phlebotomist_In_Number: item.Rating_Phlebotomist_In_Number,
							Rating_Patient_In_Number: item.Rating_Patient_In_Number,
							Review_Desc: item.Review_Desc,
							Feedback_Patient: item.Feedback_Patient,
							Rating_Service_TimeStamp: item.Rating_Service_TimeStamp,
							Rating_Phlebotomist_TimeStamp: item.Rating_Phlebotomist_TimeStamp,
							Rating_Patient_TimeStamp: item.Rating_Patient_TimeStamp,
							Review_TimeStamp: item.Review_TimeStamp,
							Feedback_Patient_TimeStamp: item.Feedback_Patient_TimeStamp,
						})
					})
					this.setState({ dataArr })
				} else {
					let dataArr = []
					this.setState({ dataArr })
				}
			})
		}
	}

	render() {
		return (
			<div className='main-content overflow-auto pb-3'>
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-12 p-0'>
							<div className='bg-white p-3 rounded'>
								<div className='d-flex justify-content-between mb-2'>
									<h4>Rating / Feedback</h4>
								</div>
								<div className='filter-product  bg-dark p-4'>
									<div className='row col-sm-12 p-0 fs-13'>
										<div className='col-sm-2'>
											<div className='form-group'>
												<h6>From</h6>
												<div className='dropdown-select warning'>
													<FormGroup>
														<DatePicker
															name='startDate'
															value={this.state.startDate}
															onChange={e =>
																this.setState({
																	startDate: moment(e).isValid()
																		? moment(e).format('YYYY-MM-DD')
																		: moment(new Date()).format('YYYY-MM-DD'),
																	// endDate: moment(e).isValid()
																	// 	? moment(e).format('YYYY-MM-DD')
																	// 	: moment(new Date()).format('YYYY-MM-DD'),
																})
															}
															maxDate={moment(new Date()).format('YYYY-MM-DD')}
															dateFormat='DD/MM/YYYY'
															showClearButton={false}
														/>
													</FormGroup>
												</div>
											</div>
										</div>
										<div className='col-sm-2'>
											<div className='form-group'>
												<h6>To</h6>
												<div className='dropdown-select warning'>
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
															maxDate={moment(new Date()).format('YYYY-MM-DD')}
															minDate={moment(this.state.startDate).format('YYYY-MM-DD')}
															dateFormat='DD/MM/YYYY'
															showClearButton={false}
														/>
													</FormGroup>
												</div>
											</div>
										</div>
										<div className='col-sm-1'>
											<div className=''>
												<div className='dropdown-filter'>
													<h6>Rated By</h6>
													<FormGroup>
														<Input
															type='select'
															id='filter'
															placeholder='Select'
															name='ratedBy'
															onChange={e => this.handleChange(e)}
														>
															<option value=''>All</option>
															{this.props.ratedByList ? (
																this.props.ratedByList.map(function (item, i) {
																	return (
																		<option value={item.Rated_By_Code} key={i}>
																			{item.Rated_By_Desc}
																		</option>
																	)
																})
															) : (
																<option value=''>All</option>
															)}
														</Input>
													</FormGroup>
												</div>
											</div>
										</div>
										<div className='col-sm-2'>
											<div className=''>
												<div className='dropdown-filter'>
													<h6>Rating Type</h6>
													<FormGroup>
														<Input
															type='select'
															id='filter'
															placeholder='Select'
															name='ratingType'
															onChange={e => this.handleChange(e)}
														>
															<option value=''>All</option>
															{this.props.ratingActionTypeList ? (
																this.props.ratingActionTypeList.map(function (item, i) {
																	return (
																		<option value={item.Rating_Action_Code} key={i}>
																			{item.Rating_Action_Desc}
																		</option>
																	)
																})
															) : (
																<option value=''>All</option>
															)}
														</Input>
													</FormGroup>
												</div>
											</div>
										</div>
										<div className='col-sm-1'>
											<div className=''>
												<div className='dropdown-filter'>
													<h6>Rating</h6>
													<FormGroup>
														<Input
															type='select'
															id='filter'
															placeholder='Select'
															name='rating'
															onChange={e => this.handleChange(e)}
														>
															<option value='0'>All</option>
															{this.props.ratingByStarList ? (
																this.props.ratingByStarList.map(function (item, i) {
																	return (
																		<option value={item.Rating_Star_Code} key={i}>
																			{item.Rating_Star_Desc}
																		</option>
																	)
																})
															) : (
																<option value=''>All</option>
															)}
														</Input>
													</FormGroup>
												</div>
											</div>
										</div>
										<div className='col-sm-2'>
											<div className=''>
												<div className='dropdown-filter'>
													<h6>Review Type</h6>
													<FormGroup>
														<Input
															type='select'
															id='filter'
															placeholder='Select'
															name='reviewType'
															onChange={e => this.handleChange(e)}
														>
															<option value=''>All</option>
															{this.props.reviewTypeList ? (
																this.props.reviewTypeList.map(function (item, i) {
																	return (
																		<option value={item.Review_Code} key={i}>
																			{item.Review_Desc}
																		</option>
																	)
																})
															) : (
																<option value=''>All</option>
															)}
														</Input>
													</FormGroup>
												</div>
											</div>
										</div>
										<div className='col-sm-1 d-flex align-items-center'>
											<div className='form-group m-0 mb-2'>
												<button
													className='btn btn-sm btn-primary ml-sm-0 mt-lg-0 mt-md-0 mt-3'
													onClick={() => this.onClickSubmit()}
												>
													Search
												</button>
											</div>
										</div>
										<div className='col-sm-1 d-flex align-items-center'>
											<div className='form-group m-0 mb-2'>
												{this.state.dataArr.length !== 0 ? (
													<CSVLink
														filename={`Ratings_${moment(new Date()).format('DDMMYYYY_HHMMSS')}.csv`}
														data={this.state.dataArr}
														className='btn btn-sm btn-success w-100'
													>
														Download
													</CSVLink>
												) : (
													<button className='btn btn-sm btn-success ml-sm-0 mt-lg-0 mt-md-0 w-100' disabled>
														Download
													</button>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className='row' style={{ minHeight: '400px' }}>
									<div className='col-12'>
										<div className='box bg-white rounded-lg ' />
										<div className='box'>
											<div className=' col-12 p-3'>
												{this.props.ratingList.length !== 0 && !this.state.showLoading ? (
													<Table responsive>
														<thead>
															<tr>
																<th style={{ textAlign: 'left' }}>#</th>
																<th style={{ textAlign: 'left' }}>Location</th>
																<th style={{ textAlign: 'left', minWidth: '150px' }}>Booking Type</th>
																<th style={{ textAlign: 'left', minWidth: '150px' }}>Booking Date</th>
																<th style={{ textAlign: 'left', minWidth: '150px' }}>Booking No</th>
																<th style={{ textAlign: 'left', minWidth: '150px' }}>Rated By</th>
																<th style={{ minWidth: '150px', textAlign: 'left' }}>Rating Service</th>
																<th style={{ minWidth: '200px', textAlign: 'left' }}>Rating Phlebotomist</th>
																<th style={{ minWidth: '150px', textAlign: 'left' }}>Rating Patient</th>
																<th style={{ textAlign: 'left' }}>Review</th>
																<th style={{ textAlign: 'left' }}>Feedback</th>
																<th style={{ textAlign: 'left', minWidth: '200px' }}>Service Rated Date</th>
																<th style={{ textAlign: 'left', minWidth: '250px' }}>Phlebotomist Rated Date</th>
																<th style={{ textAlign: 'left', minWidth: '200px' }}>Patient Rated Date</th>
																<th style={{ textAlign: 'left', minWidth: '150px' }}>Review Date</th>
																<th style={{ textAlign: 'left', minWidth: '150px' }}>Feedback Date</th>
															</tr>
														</thead>
														<tbody>
															{this.props.ratingList.map(function (item, i) {
																return <Card key={i} {...item} sNo={i + 1} />
															})}
														</tbody>
													</Table>
												) : this.state.showLoading ? (
													<tr style={{ height: '70px' }}>
														<td colSpan='13'>
															<Spinner size='lg' className='ml-2 m-1 spinner' />
														</td>
													</tr>
												) : (
													<p className='align-center mt-5'>No data found</p>
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
		ratingList: state.ratingState.ratingList,
		reviewTypeList: state.ratingState.reviewTypeList,
		ratingActionTypeList: state.ratingState.ratingActionTypeList,
		ratingByStarList: state.ratingState.ratingByStarList,
		ratedByList: state.ratingState.ratedByList,
	}
}

Rating.propTypes = {
	ratingList: PropTypes.array,
	reviewTypeList: PropTypes.array,
	ratingActionTypeList: PropTypes.array,
	ratingByStarList: PropTypes.array,
	ratedByList: PropTypes.array,
	getRatedBy: PropTypes.func,
	getRatingActionType: PropTypes.func,
	getRating: PropTypes.func,
	getRatingByStar: PropTypes.func,
	getReviewType: PropTypes.func,
	showNotification: PropTypes.func,
}

export default Layout(Rating, mapStateToProps, {
	getRatedBy,
	getRatingActionType,
	getRating,
	getRatingByStar,
	getReviewType,
	showNotification,
})
