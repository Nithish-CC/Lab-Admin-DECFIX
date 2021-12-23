/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Component } from 'react'
import { Layout } from '../common/Layout'
import BookedCard from './BookedCard'
import SearchFilter from './SearchFilter'
import PropTypes from 'prop-types'
import {
	getPhlebotomistDetails,
	getBookingTypeDetails,
	getBookingDepthDetails,
	actionOnBooking,
	getBookingDetails,
} from '../../actions/bookingDetailsAction'
import { showNotification } from '../../actions/commonAction'
import store from 'store'
import ViewModal from './modal/View'
import CancelModal from './modal/Cancel'
import { Spinner } from 'reactstrap'
import { getLabadminCode } from '../../utils/Utility'
import { resetToInitialState } from '../../actions/commonAction'
import { TOAST } from '../../utils/Constants'

class BookingDetails extends Component {
	constructor(props) {
		super(props)
		this.state = {
			searchText: '',
			showViewModal: false,
			showCancelModal: false,
			cancelData: {},
			showLoading: false,
			showModalLoading: false,
			modalName: '',
			branchName: '',
		}
	}

	componentDidMount() {
		this.props.resetToInitialState()
		this.setState({ showLoading: true })
		this.props.getPhlebotomistDetails({}, result => {
			this.setState({ showLoading: false })
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})

		this.setState({ showLoading: true })
		this.props.getBookingTypeDetails({}, result => {
			this.setState({ showLoading: false })
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})
	}

	onClickView = (bookingNo, type, firmNo, bookingDate, name, branchName) => {
		this.setState({ showModalLoading: true, modalName: name, branchName: branchName })
		const filteredData = {
			Labadmin_Code: store.get('userSession').Message[0].Labadmin_Code,
			Booking_Type: type,
			Firm_No: firmNo,
			Booking_Date: bookingDate,
			Booking_No: bookingNo,
		}
		this.props.getBookingDepthDetails(filteredData, result => {
			console.log(result)
			this.setState({ showModalLoading: false })
			if (result) {
				this.setState({ showViewModal: true })
			} else {
				this.props.showNotification('Not found', 'Booking Not found', TOAST.TYPE_ERROR)
			}
		})
	}

	onClickCancel = (bookingNo, type, firmNo, bookingDate) => {
		const filteredData = {
			Labadmin_Code: getLabadminCode(),
			Booking_Type: type,
			Firm_No: firmNo,
			Booking_Date: bookingDate,
			Booking_No: bookingNo,
		}
		this.setState({ showCancelModal: true, cancelData: filteredData })
	}

	onClickClose = () => {
		this.setState({ showViewModal: false, showCancelModal: false })
	}

	onLoadTrue = () => {
		this.setState({ showLoading: true })
	}

	onLoadFalse = () => {
		this.setState({ showLoading: false })
	}

	onCancelSubmit = reason => {
		const filteredData = {
			...this.state.cancelData,
			Reason: reason,
		}
		this.props.actionOnBooking(filteredData, result => {
			this.setState({ showCancelModal: false })
			if (result) {
				this.props.showNotification('Success', 'Booking cancelled successfully', TOAST.TYPE_SUCCESS)
				this.onLoadTrue()
				this.props.getBookingDetails(this.props.filterDataList, result => {
					this.onLoadFalse()
					if (result) {
						console.log('')
					} else {
						console.log('')
					}
				})
			} else {
				console.log('')
			}
		})
	}

	render() {
		const { showViewModal, showCancelModal, showLoading } = this.state
		return (
			<div className='main-content overflow-auto pb-3'>
				{showViewModal && (
					<ViewModal
						bookingDetail={this.props.bookingDetails}
						phlebotomistList={this.props.phlebotomistList}
						visitType={this.props.bookingTypeList}
						testList={this.props.testList}
						onClickClose={() => this.onClickClose()}
						loading={this.state.showModalLoading}
						modalName={this.state.modalName}
						branchName={this.state.branchName}
						labAdminCode={store.get('userSession').Message[0].Labadmin_Code}
					/>
				)}
				{showCancelModal && (
					<CancelModal
						onClickClose={() => this.onClickClose()}
						onCancelSubmit={reason => this.onCancelSubmit(reason)}
					/>
				)}
				<div className='container-fluid  '>
					<div className='row'>
						<div className='col-12 p-0'>
							<div className='bg-white p-3 rounded vh-100'>
								<h4>Booking Details</h4>
								<hr className='mb-3 mt-0' />
								<SearchFilter
									filterList={this.props.filterList}
									statusList={this.props.statusList}
									labAdminCode={store.get('userSession').Message[0].Labadmin_Code}
									onLoadTrue={this.onLoadTrue}
									onLoadFalse={this.onLoadFalse}
									bookTypeList={this.props.bookingTypeList}
								/>
								<div className='row'>
									<div className='col-12'>
										<div className='box bg-white rounded-lg ' />
										<div className='box'>
											<div className=' col-12 py-3 px-0'>
												<div className='d-flex flex-wrap'>
													{showLoading ? (
														<div className='col-12 d-flex flex-wrap justify-content-center'>
															<Spinner size='lg' className='ml-2 m-1 spinner' />
														</div>
													) : (
														<>
															{this.props.bookingsList.length !== 0 ? (
																this.props.bookingsList.map((item, i) => {
																	return (
																		<BookedCard
																			key={i}
																			{...item}
																			onClickView={(bookingNo, type, firmNo, bookingDate, name, branchName) =>
																				this.onClickView(bookingNo, type, firmNo, bookingDate, name, branchName)
																			}
																			onCancelView={(bookingNo, type, firmNo, bookingDate) =>
																				this.onClickCancel(bookingNo, type, firmNo, bookingDate)
																			}
																		/>
																	)
																})
															) : (
																<div className='col-12 d-flex flex-wrap justify-content-center'>
																	<p className='align-center'>No data found</p>
																</div>
															)}
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
		bookingsList: state.bookingDetailsState.bookingDetailsList,
		filterList: state.bookingDetailsState.bookingDetailsSearch,
		statusList: state.bookingDetailsState.bookingDetailsStatus,
		phlebotomistList: state.bookingDetailsState.phlebotomistList,
		bookingTypeList: state.bookingDetailsState.bookingTypeList,
		bookingFilterList: state.bookingDetailsState.bookingFilterList,
		bookingDetails: state.bookingDetailsState.bookingDetailed,
		testList: state.bookingDetailsState.testList,
		filterDataList: state.bookingDetailsState.filterDataList,
	}
}

BookingDetails.propTypes = {
	filterDataList: PropTypes.array,
	bookingsList: PropTypes.array,
	filterList: PropTypes.array,
	statusList: PropTypes.array,
	phlebotomistList: PropTypes.array,
	bookingTypeList: PropTypes.array,
	bookingDetails: PropTypes.string,
	getPhlebotomistDetails: PropTypes.func,
	getBookingTypeDetails: PropTypes.func,
	getBookingDepthDetails: PropTypes.func,
	showNotification: PropTypes.func,
	testList: PropTypes.array,
	actionOnBooking: PropTypes.func,
	getBookingDetails: PropTypes.func,
	resetToInitialState: PropTypes.func,
	bookingFilterList: PropTypes.object,
}

export default Layout(BookingDetails, mapStateToProps, {
	getPhlebotomistDetails,
	getBookingTypeDetails,
	getBookingDepthDetails,
	showNotification,
	actionOnBooking,
	getBookingDetails,
	resetToInitialState,
})
