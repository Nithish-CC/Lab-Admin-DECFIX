import React, { Component } from 'react'
import { Layout } from '../common/Layout'
import { getNotificationDetails, notificationUpdate } from '../../actions/notificationAction'
import PropTypes from 'prop-types'
import { FormGroup } from 'reactstrap'
import DatePicker from 'reactstrap-date-picker'
import moment from 'moment'
import store from 'store'
import { Spinner } from 'reactstrap'
import View from './modal/View'
import { CSVLink } from 'react-csv'
import { showNotification } from '../../actions/commonAction'
import { TOAST } from '../../utils/Constants'

class Notification extends Component {
	constructor(props) {
		super(props)
		this.state = {
			fromDate: moment(new Date()).format('YYYY-MM-DD'),
			toDate: moment(new Date()).format('YYYY-MM-DD'),
			showLoading: false,
			modalData: {},
			showModal: false,
			dataArr: [],
		}
	}

	componentDidMount = () => {
		this.onClickSubmit()
	}

	onClickSubmit = () => {
		if (moment(this.state.fromDate).isAfter(this.state.toDate)) {
			this.props.showNotification('Error', 'To date is greater than From date.', TOAST.TYPE_ERROR)
		} else {
			this.setState({ showLoading: true })
			const filteredData = {
				Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
				Date_from: moment(this.state.fromDate).format('YYYY/MM/DD'),
				Date_To: moment(this.state.toDate).format('YYYY/MM/DD'),
			}
			this.props.getNotificationDetails(filteredData, result => {
				this.setState({ showLoading: false })
				if (result) {
					let dataArr = []
					this.props.notificationList.forEach(function (item) {
						dataArr.push({
							Notify_Date: item.Notify_Date,
							Notify_Time: item.Notify_Time,
							Notify_Message: item.Notify_Message,
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

	onClickReadMore = data => {
		this.setState({ modalData: data, showModal: true })
		const filteredData = {
			Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
			Notify_Status: 'R',
			Notify_Id: data.Notification_Id,
		}
		this.props.notificationUpdate(filteredData, result => {
			this.onClickSubmit()
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})
	}

	onClickClose = () => {
		this.setState({ showModal: false })
	}

	render() {
		return (
			<>
				<div className='main-content bg-white'>
					<div className='container-fluid'>
						<div className='row'>
							{this.state.showModal && <View onClickClose={() => this.onClickClose()} {...this.state.modalData} />}
							<div className='col-12'>
								<div className='p-3 mt-lg-0'>
									<div className='d-flex flex-wrap align-items-center'>
										<div className='d-flex align-self-center flex-grow-1'>
											<h4 className='mb-0 flex-grow-1'>Notification</h4>
											<button
												className='btn btn-sm show-side-box d-none btn-light rounded-pill show-side-box justify-content-end'
												type='button'
												data-toggle='tooltip'
												data-placement='bottom'
												title=''
												data-original-title='Filter'
											>
												<i className='fas fa-filter' />
											</button>
										</div>
										<div className='d-flex mobile-filter d-flex mr-2 align-items-center'>
											<h6 className='mt-2 mr-3 font-weight-bold'>FROM</h6>
											<div className='dropdown-select warning'>
												<FormGroup className='m-0'>
													<DatePicker
														name='fromDate'
														value={this.state.fromDate}
														onChange={e =>
															this.setState({
																fromDate: moment(e).isValid()
																	? moment(e).format('YYYY-MM-DD')
																	: moment(new Date()).format('YYYY-MM-DD'),
																// toDate: moment(e).isValid()
																// 	? moment(e).format('YYYY-MM-DD')
																// 	: moment(new Date()).format('YYYY-MM-DD'),
															})
														}
														// maxDate={moment(this.state.toDate).format('YYYY-MM-DD')}
														maxDate={moment(new Date()).format('YYYY-MM-DD')}
														dateFormat='DD/MM/YYYY'
														showClearButton={false}
													/>
												</FormGroup>
											</div>
										</div>
										<div className='d-sm-flex mobile-filter d-flex align-items-center'>
											<h6 className='mt-2 mr-3 font-weight-bold'>TO</h6>
											<div className='dropdown-select warning'>
												<FormGroup className='m-0'>
													<DatePicker
														name='toDate'
														value={this.state.toDate}
														onChange={e =>
															this.setState({
																toDate: moment(e).isValid()
																	? moment(e).format('YYYY-MM-DD')
																	: moment(this.state.fromDate).format('YYYY-MM-DD'),
															})
														}
														maxDate={moment(new Date()).format('YYYY-MM-DD')}
														minDate={moment(this.state.fromDate).format('YYYY-MM-DD')}
														dateFormat='DD/MM/YYYY'
														showClearButton={false}
													/>
												</FormGroup>
											</div>
										</div>
										<div className='usr-profile mobile-filter mb-0 mt-1 mr-2'>
											<button
												className='btn btn-sm btn-primary ml-lg-3 ml-md-3 ml-sm-0 mt-lg-0 mt-md-0 mt-3 w-100'
												onClick={() => this.onClickSubmit()}
											>
												Search
											</button>
										</div>
										<div className='usr-profile mobile-filter mb-0 mt-1'>
											{this.state.dataArr.length !== 0 ? (
												<CSVLink
													filename={`Notifications_${moment(new Date()).format('DDMMYYYY_HHMMSS')}.csv`}
													data={this.state.dataArr}
													className='btn btn-sm btn-success ml-lg-3 ml-md-3 ml-sm-0 mt-lg-0 mt-md-0 mt-3 w-100'
												>
													Download
												</CSVLink>
											) : (
												<button
													className='btn btn-sm btn-success ml-lg-3 ml-md-3 ml-sm-0 mt-lg-0 mt-md-0 mt-3 w-100'
													disabled='true'
												>
													Download
												</button>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='main-content overflow-auto pb-3 bg-white vh-100'>
					<div className='container-fluid'>
						<div className='row'>
							<div className='col-12'>
								<div className='px-lg-3'>
									<div className='bg-dark mb-4'>
										{this.state.showLoading ? (
											<div className='col-12 d-flex flex-wrap justify-content-center'>
												<Spinner size='lg' className='ml-2 m-1 spinner mt-3' />
											</div>
										) : (
											<>
												{this.props.notificationList.length !== 0 ? (
													this.props.notificationList.map((item, i) => {
														return (
															<div className='card-body' key={i}>
																<div className='row'>
																	<div className='d-flex'>
																		<div className='d-flex bd-highlight align-self-start mr-3 ml-3'>
																			{/* <div className='user-logo'>
																				<img src={profile} alt='' />
																			</div> */}
																			<div className='ml-3 align-self-center'>
																				<div className='row'>
																					<div className='col-lg-8 col-sm-12'>
																						<p className='mb-0'>{item.Notify_Message.substring(0, 40)}...</p>
																						{/* <p className='mb-0 font-weight-bold'>Mr.Alex</p> */}
																					</div>
																					<div className='col-lg-4 col-sm-12'>
																						<div className='d-flex align-items-start'>
																							<button
																								onClick={() => this.onClickReadMore(item)}
																								style={{ color: 'cornflowerblue' }}
																								className='ml-lg-3 ml-md-0 ml-sm-0 text-nowrap btn btn-text'
																							>
																								<small>Read More</small>
																							</button>
																							{item.IsNew === '1' && item.IsRead !== '1' && (
																								<badge className='badge badge-warning ml-3 mt-2'>New</badge>
																							)}
																							{item.IsRead === '1' && (
																								<badge className='badge badge-secondary ml-3 mt-2'>Older</badge>
																							)}
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																	<div className='d-flex mr-3 align-self-center justify-content-lg-end mt-lg-0 mt-md-0 mt-3 ml-sm-3 flex-grow-1'>
																		<div className='user-date/time ml-3'>
																			<p className='text-break mb-0 font-weight-lighter'>{item.Time_Diff_Desc}</p>
																			<p className='mb-0 font-weight-bold'>{item.Notify_Date}</p>
																		</div>
																	</div>
																</div>
															</div>
														)
													})
												) : (
													<div className='col-12 d-flex flex-wrap justify-content-center'>
														<p className='align-center pt-4'>No data found</p>
													</div>
												)}
											</>
										)}

										<hr className='m-0' />
									</div>
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
		notificationList: state.notificationReducer.notificationList,
	}
}

Notification.propTypes = {
	notificationList: PropTypes.array,
	getNotificationDetails: PropTypes.func,
	notificationUpdate: PropTypes.func,
	showNotification: PropTypes.func,
}

export default Layout(Notification, mapStateToProps, {
	getNotificationDetails,
	notificationUpdate,
	showNotification,
})
