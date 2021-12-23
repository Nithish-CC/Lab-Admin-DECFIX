/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Component } from 'react'
import { Layout } from '../common/Layout'
import Card from './Card'
import SearchFilter from './SearchFilter'
import PropTypes from 'prop-types'
import { showNotification } from '../../actions/commonAction'
import store from 'store'
import { Spinner } from 'reactstrap'
import ViewModal from './modal/View'
import { geolocated } from 'react-geolocated'
import { resetToInitialState } from '../../actions/commonAction'
class BookingDetails extends Component {
	constructor(props) {
		super(props)
		this.state = {
			searchText: '',
			showViewModal: false,
			cancelData: {},
			showLoading: false,
			showModalLoading: false,
		}
	}
	componentDidMount = () => {
		this.props.resetToInitialState()
	}

	handleChange = event => {
		if (event.target.name === 'fromDate') {
			this.setState({ fromDate: event.target.value, toDate: event.target.value })
		} else {
			this.setState({ [event.target.name]: event.target.value })
		}
	}

	onLoadTrue = () => {
		this.setState({ showLoading: true })
	}

	onLoadFalse = () => {
		this.setState({ showLoading: false })
	}

	render() {
		const { showLoading } = this.state
		return (
			<div className='main-content overflow-auto pb-3'>
				<div className='container-fluid  '>
					{this.state.showViewModal ? (
						<ViewModal
							onClickClose={() => this.setState({ showViewModal: false })}
							coordinates={this.state.coordinates}
						/>
					) : null}
					<div className='row'>
						<div className='col-12'>
							<div className='p-3 mt-lg-0 mt-2'>
								<div className='d-sm-flex flex-wrap'>
									<div className='d-flex align-self-center flex-grow-1'>
										<h4 className='mb-0 flex-grow-1'>SOS Alert</h4>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className='col-12 p-0'>
							<div className='bg-white p-3 rounded'>
								<hr className='mb-3 mt-0' />
								<SearchFilter
									filterList={this.props.filterList}
									labAdminCode={store.get('userSession').Message[0].Labadmin_Code}
									onLoadTrue={this.onLoadTrue}
									onLoadFalse={this.onLoadFalse}
								/>
								<div className='row' style={{ minHeight: '500px' }}>
									<div className='col-12'>
										<div className='box bg-white rounded-lg ' />
										<div className='box'>
											<div className=' col-12 p-3'>
												<div className='d-flex flex-wrap mr-n4 ml-n3'>
													{showLoading ? (
														<div className='col-12 d-flex flex-wrap justify-content-center'>
															<Spinner size='lg' className='ml-2 m-1 spinner' />
														</div>
													) : (
														<>
															{this.props.sosList.length !== 0 ? (
																this.props.sosList.map((item, i) => {
																	return (
																		<Card
																			key={i}
																			labAdminCode={store.get('userSession').Message[0].Labadmin_Code}
																			{...item}
																			showModal={coordinates => this.setState({ coordinates, showViewModal: true })}
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
		filterList: state.sosAlertState.filterList,
		sosList: state.sosAlertState.sosList,
	}
}

BookingDetails.propTypes = {
	filterList: PropTypes.array,
	sosList: PropTypes.array,
	showNotification: PropTypes.func,
	resetToInitialState: PropTypes.func,
}

export default Layout(
	geolocated({
		positionOptions: {
			enableHighAccuracy: false,
		},
		userDecisionTimeout: 5000,
	})(BookingDetails),
	mapStateToProps,
	{
		showNotification,
		resetToInitialState,
	}
)
