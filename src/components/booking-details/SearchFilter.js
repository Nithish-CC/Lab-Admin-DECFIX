/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Component } from 'react'
import { FormGroup, Input } from 'reactstrap'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
	getBookingDetails,
	getBookingStatusDetails,
	getBookingDetailsSearch,
	getBookingFilterDetails,
	getBookingTypeDetails,
} from '../../actions/bookingDetailsAction'
import DatePicker from 'reactstrap-date-picker'
// import OutsideClickHandler from 'react-outside-click-handler'

class SearchFilter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			searchText: '',
			searchFieldCode: 'PI',
			bookingDate: true,
			scheduleDate: false,
			dateOfSearch: moment(new Date()).format('YYYY-MM-DD'),
			showBookingStatusDropdown: false,
			bookingStatus: '',
			bookingStatusDesc: '',
		}
	}

	componentDidMount() {
		this.props.onLoadTrue()
		const searchData = {
			Search_Type_Code: 'B',
		}
		this.props.getBookingDetailsSearch(searchData, result => {
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})

		const statusData = {
			Search_Type_Code: 'S',
		}
		this.props.getBookingStatusDetails(statusData, result => {
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})

		this.props.getBookingTypeDetails({}, result => {
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})

		const { searchText, searchFieldCode, dateOfSearch, bookType, bookingStatus } = this.state
		const data = {
			Labadmin_Code: this.props.labAdminCode,
			Date_Filter_Type: this.state.bookingDate ? 'B' : 'S',
			Date_Of_Search: moment(dateOfSearch).format('YYYY/MM/DD'),
			Search_Text: searchText ? searchText : '',
			Search_Field_Code: searchFieldCode,
			Booking_Type: bookType ? bookType : '',
			Booking_Status_Code: bookingStatus ? bookingStatus : '',
		}
		this.props.getBookingDetails(data, result => {
			this.props.onLoadFalse()
			if (result) {
				this.props.getBookingFilterDetails(data, result => {
					if (result) {
						console.log('')
					}
				})
			} else {
				console.log('')
			}
		})
	}

	handleChange = event => {
		if (event.target.name === 'searchFieldCode') {
			this.setState({ [event.target.name]: event.target.value, searchText: '' })
		} else if (event.target.name === 'searchText') {
			if (this.state.searchFieldCode === 'PM') {
				const re = /^[0-9\b]+$/

				if (re.test(event.target.value) || event.target.value === '') {
					this.setState({ [event.target.name]: event.target.value.trim('') })
				}
			} else {
				this.setState({ [event.target.name]: event.target.value })
			}
		} else {
			this.setState({ [event.target.name]: event.target.value })
		}
	}

	getBookingDetails = () => {
		this.props.onLoadTrue()
		const { searchText, searchFieldCode, dateOfSearch, bookType, bookingStatus } = this.state
		const data = {
			Labadmin_Code: this.props.labAdminCode,
			Date_Filter_Type: this.state.bookingDate ? 'B' : 'S',
			Date_Of_Search: moment(dateOfSearch).format('YYYY/MM/DD'),
			Search_Text: searchText ? searchText : '',
			Search_Field_Code: searchFieldCode,
			Booking_Type: bookType ? bookType : '',
			Booking_Status_Code: bookingStatus ? bookingStatus : '',
		}
		this.props.getBookingDetails(data, result => {
			this.props.onLoadFalse()
			if (result) {
				this.props.getBookingFilterDetails(data, result => {
					if (result) {
						console.log('')
					}
				})
			} else {
				console.log('')
			}
		})
	}

	handleChangeBookingStatus = (code, desc) => {
		this.setState({ bookingStatus: code, showBookingStatusDropdown: false, bookingStatusDesc: desc })
	}

	render() {
		const { searchText, dateOfSearch, showBookingStatusDropdown, searchFieldCode } = this.state
		return (
			<div className='filter-product bg-dark p-4 fs-13'>
				<div className='row d-flex'>
					<div className='col-sm'>
						<div className='form-group'>
							<h6>Filter</h6>
							<div className='dropdown-select warning'>
								<FormGroup>
									<select
										className='form-control form-search border-0'
										name='searchFieldCode'
										value={searchFieldCode}
										onChange={e => this.handleChange(e)}
									>
										{this.props.filterList &&
											this.props.filterList.map((item, i) => {
												return (
													<option value={item.Filter_Code} key={i}>
														{item.Filter_Desc}
													</option>
												)
											})}
									</select>
								</FormGroup>
							</div>
						</div>
					</div>
					<div className='col-sm-4 mt-lg-0 mt-md-0 mt-3'>
						<h6>Search</h6>
						<input
							type='text'
							className='form-control form-search border-0'
							placeholder='Search by PID, Patient Name, Mobile, Booking Id'
							title='Search by PID, Patient Name, Mobile, Booking Id'
							id='form-search'
							value={searchText}
							name='searchText'
							onChange={e => this.handleChange(e)}
						/>
					</div>
					<div className='col-sm-2 mt-lg-0'>
						{/* <div className='overflow-auto text-nowrap'> */}
						<div className='form-check form-check-inline mb-1'>
							<input
								className='form-check-input'
								type='radio'
								name='bookingDateType'
								id='bookingDate'
								value='B'
								onChange={() => {
									this.setState({ scheduleDate: false, bookingDate: true })
								}}
								checked={this.state.bookingDate}
							/>
							<label className='form-check-label' htmlFor='bookingDate'>
								Booking Date
							</label>
						</div>
						<div className='form-check form-check-inline mb-1'>
							<input
								className='form-check-input'
								type='radio'
								id='scheduleDate'
								value='S'
								onChange={() => {
									this.setState({ scheduleDate: true, bookingDate: false })
								}}
								checked={this.state.scheduleDate}
							/>
							<label className='form-check-label' htmlFor='scheduleDate'>
								Schedule Date
							</label>
						</div>
						{/* </div> */}
						<div className='dropdown-select warning'>
							<FormGroup>
								<DatePicker
									name='dateOfSearch'
									value={dateOfSearch}
									onChange={e => {
										this.setState({
											dateOfSearch: moment(e).format('YYYY-MM-DD'),
										})
									}}
									dateFormat='DD/MM/YYYY'
									showClearButton={false}
								/>
							</FormGroup>
						</div>
					</div>
					<div className='col-sm-1 mt-lg-0 mt-3'>
						<div className='dropdown-filter'>
							<h6>Book Type</h6>
							<div className='dropdown-select warning'>
								<FormGroup>
									<Input type='select' name='bookType' placeholder='Select' onChange={e => this.handleChange(e)}>
										<option value=''>All</option>
										{this.props.bookTypeList &&
											this.props.bookTypeList.map((item, i) => {
												// Remove Direct Visit Type
												if (item.Booking_Type_Code !== 'L') {
													return (
														<option value={item.Booking_Type_Code} key={i}>
															{item.Type_Of_Booking}
														</option>
													)
												}
											})}
									</Input>
								</FormGroup>
							</div>
						</div>
					</div>
					<div className='col-sm mt-lg-0 mt-3'>
						<div className='dropdown-filter'>
							<h6>Booking Status</h6>
							{/* <OutsideClickHandler
								onOutsideClick={() => {
									this.setState({ showBookingStatusDropdown: false })
								}}
							> */}
							<FormGroup>
								<div className='dropdown-select warning'>
									{/* eslint-disable-next-line */}
									<a
										className='select'
										onClick={() => this.setState({ showBookingStatusDropdown: !showBookingStatusDropdown })}
									>
										{this.state.bookingStatusDesc ? this.state.bookingStatusDesc : 'All'}
									</a>
									<ul className='option-list' style={{ display: showBookingStatusDropdown ? 'block' : 'none' }}>
										<li className='d-flex' onClick={() => this.handleChangeBookingStatus('', 'All')}>
											<span className='filter-box' style={{ backgroundColor: '#fff' }} />
											{/* eslint-disable-next-line */}
											<a>All</a>
										</li>
										{this.props.statusList &&
											this.props.statusList.map((item, i) => {
												return (
													<li
														className='d-flex'
														key={i}
														onClick={() => this.handleChangeBookingStatus(item.Filter_Code, item.Filter_Desc)}
													>
														<span className='filter-box' style={{ backgroundColor: item.Filter_Color }} />
														{/* eslint-disable-next-line */}
														<a> {item.Filter_Desc} </a>
													</li>
												)
											})}
									</ul>
								</div>
							</FormGroup>
							{/* </OutsideClickHandler> */}
						</div>
					</div>
					<div className='col-sm-1 d-flex align-items-center'>
						<div className='form-group m-0 mb-2'>
							<button className='btn btn-sm btn-primary br-5' onClick={() => this.getBookingDetails()}>
								Search
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

SearchFilter.propTypes = {
	onLoadTrue: PropTypes.func,
	onLoadFalse: PropTypes.func,
	getBookingDetails: PropTypes.func,
	getBookingDetailsSearch: PropTypes.func,
	getBookingStatusDetails: PropTypes.func,
	getBookingTypeDetails: PropTypes.func,
	getBookingFilterDetails: PropTypes.object,
	statusList: PropTypes.array,
	filterList: PropTypes.array,
	bookTypeList: PropTypes.array,
	labAdminCode: PropTypes.string,
}

export default connect(null, {
	getBookingDetails,
	getBookingDetailsSearch,
	getBookingStatusDetails,
	getBookingFilterDetails,
	getBookingTypeDetails,
})(SearchFilter)
