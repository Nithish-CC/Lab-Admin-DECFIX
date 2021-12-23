/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Component } from 'react'
import BookedCard from './BookedCard'
import SearchFilter from './SearchFilter'
import PropTypes from 'prop-types'
import { Layout } from '../common/Layout'
import { Link } from 'react-router-dom'
import { PATH } from '../../config/routes'
import { resetToInitialState } from '../../actions/commonAction'
import { Spinner } from 'reactstrap'

class BookTest extends Component {
	state = {
		showLoading: false,
	}

	componentDidMount = () => {
		this.props.resetToInitialState()
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
					<div className='row'>
						<div className='col-12 p-0'>
							<div className='bg-white p-3 rounded'>
								<div className='d-flex justify-content-between mb-2'>
									<h4>Book Test</h4>
									<Link to={PATH.REGISTER_PATIENT}>
										<button className='btn btn-sm btn-success br-5'>Register New Patient</button>
									</Link>
								</div>
								<SearchFilter
									filterList={this.props.filterList}
									onLoadTrue={this.onLoadTrue}
									onLoadFalse={this.onLoadFalse}
								/>
								<div className='row'>
									<div className='col-12'>
										<div className='box bg-white rounded-lg ' />
										<div className='box'>
											<div className=' col-12 p-3'>
												<div className='d-flex flex-wrap mr-n4 ml-n3 '>
													{showLoading ? (
														<Spinner size='lg' className='ml-2 m-1 spinner' />
													) : (
														<>
															{this.props.bookTestList.length !== 0 ? (
																this.props.bookTestList.map(function (item, i) {
																	return <BookedCard key={i} {...item} />
																})
															) : (
																<p className='align-center'>No data found</p>
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
		bookTestList: state.bookTestState.bookTestList,
		filterList: state.bookTestState.bookTestFilter,
	}
}

BookTest.propTypes = {
	bookTestList: PropTypes.array,
	filterList: PropTypes.array,
	resetToInitialState: PropTypes.func,
}

export default Layout(BookTest, mapStateToProps, { resetToInitialState })
