import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SearchFilter from './SearchFilter'
import { Layout } from '../common/Layout'
import TrackingMap from './Map'
import { getTrackingList, dispatchTrackingList } from '../../actions/trackingAction'
import ResultItem from './ResultItem'
import { Spinner } from 'reactstrap'

class Tracking extends Component {
	state = {
		defaultDelta: {},
		showLoading: false,
	}

	componentDidMount = () => {}

	handleToggleInfoBox = index => {
		let trackingList = this.props.trackingList
		let arrayToDispatch = []
		trackingList.forEach((item, i) => {
			let temp = item
			if (index === i) {
				temp.isOpen = !temp.isOpen
			} else {
				temp.isOpen = false
			}
			arrayToDispatch.push(temp)
		})
		this.props.dispatchTrackingList(JSON.parse(JSON.stringify(arrayToDispatch)))
	}
	/**
	 * Handles on click right results
	 * @param {*} index
	 */
	onClickPhelotomist = index => {
		let trackingList = this.props.trackingList
		let arrayToDispatch = []
		trackingList.forEach((item, i) => {
			let temp = item
			if (index === i) {
				temp.isOpen = true
			} else {
				temp.isOpen = false
			}
			arrayToDispatch.push(temp)
		})

		if (trackingList[index].Collector_Latitude && trackingList[index].Collector_Longitude) {
			this.props.dispatchTrackingList(JSON.parse(JSON.stringify(arrayToDispatch)))
			const defaultDelta = {
				lat: parseFloat(trackingList[index].Collector_Latitude),
				lng: parseFloat(trackingList[index].Collector_Longitude),
			}
			this.setState({ defaultDelta })
		} else {
			trackingList.forEach(item => {
				let temp = item
				temp.isOpen = false
				arrayToDispatch.push(temp)
				this.props.dispatchTrackingList(JSON.parse(JSON.stringify(arrayToDispatch)))
			})
		}
	}

	render() {
		const { trackingList } = this.props
		return (
			<div className='main-content overflow-auto pb-3'>
				<div className='container-fluid mt-3'>
					<div className='row'>
						<div className='col-12'>
							<div className='bg-white'>
								<div className='d-flex justify-content-between mb-2'>
									<h4>Tracking</h4>
								</div>
								<SearchFilter
									filterList={this.props.filterList}
									setShowLoading={bool => this.setState({ showLoading: bool })}
								/>
								<div className='d-sm-flex  flex-wrap bg-dark p-2'>
									<div className='w-75 pr-3 mb-3 py-2 mob-full-width'>
										<div className='h-iframe'>
											<TrackingMap
												handleToggleInfoBox={index => this.handleToggleInfoBox(index)}
												defaultDelta={this.state.defaultDelta}
												onClickPhelotomist={index => this.onClickPhelotomist(index)}
											/>
										</div>
									</div>
									<div className='w-25  device-width py-2'>
										<h6>Phlebotomist</h6>
										<div className='filter-option overflow-auto'>
											{trackingList.map((item, index) => {
												return (
													<ResultItem
														item={item}
														index={index}
														key={index}
														onClickPhelotomist={index => this.onClickPhelotomist(index)}
													/>
												)
											})}
											{!trackingList.length ? (
												this.state.showLoading ? (
													<Spinner size='sm' />
												) : (
													<p>No data found.</p>
												)
											) : null}
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

Tracking.propTypes = {
	bookTestList: PropTypes.array,
	filterList: PropTypes.array,
	getTrackingList: PropTypes.func,
	dispatchTrackingList: PropTypes.func,
	trackingList: PropTypes.array,
}
/**
 * Map all reducer state to the props of the component
 * @param {Object} state
 */
const mapStateToProps = state => {
	return {
		trackingList: state.trackingState.trackingList,
	}
}
export default Layout(Tracking, mapStateToProps, { getTrackingList, dispatchTrackingList })
