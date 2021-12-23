/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Component } from 'react'
import { FormGroup, Input } from 'reactstrap'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getFilter, getSOS } from '../../actions/sosAlertAction'
import { showNotification } from '../../actions/commonAction'
import { TOAST } from '../../utils/Constants'
import DatePicker from 'reactstrap-date-picker'
import moment from 'moment'
import { CSVLink } from 'react-csv'

class SearchFilter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			searchText: '',
			searchFieldCode: '',
			fromDate: moment(new Date()).format('YYYY-MM-DD'),
			toDate: moment(new Date()).format('YYYY-MM-DD'),
			dataArr: [],
		}
	}

	componentDidMount() {
		this.props.onLoadTrue()
		const statusData = {
			Search_Type_Code: 'O',
		}
		this.props.getFilter(statusData, result => {
			this.props.onLoadFalse()
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})
		this.onClickSubmit()
	}

	handleChange = event => {
		if (event.target.name === 'searchFieldCode' && event.target.value === '') {
			this.setState({ [event.target.name]: event.target.value, searchText: '' })
		} else {
			this.setState({ [event.target.name]: event.target.value })
		}
	}

	onClickSubmit = () => {
		this.props.onLoadTrue()

		let data = {
			Labadmin_Code: this.props.labAdminCode,
			From_Date: moment(this.state.fromDate).format('YYYY/MM/DD'),
			To_Date: moment(this.state.toDate).format('YYYY/MM/DD'),
			Search_Text: this.state.searchText,
		}
		if (this.state.searchFieldCode !== '') data.Search_Field_Code = this.state.searchFieldCode
		this.props.getSOS(data, result => {
			this.props.onLoadFalse()
			if (result.SuccessFlag !== 'false' && result.SuccessFlag !== false) {
				let dataArr = []

				result.Message[0].Users_List.forEach(function (item) {
					dataArr.push({
						Name_Of_the_User: item.Name_Of_the_User,
						User_Type_Desc: item.User_Type_Desc,
						Alert_DateTime_Desc: item.Alert_DateTime_Desc,
						SOS_Full_Address: item.SOS_Full_Address,
						SOS_Latitude: item.SOS_Latitude,
						SOS_Longitude: item.SOS_Longitude,
						User_Dob: item.User_Dob,
						User_Email_Id: item.User_Email_Id,
						User_Gender: item.User_Gender,
						User_Mobile_No: item.User_Mobile_No,
					})
				})
				this.setState({ dataArr })
			} else {
				let dataArr = []
				this.setState({ dataArr })
				if (result.Message[0].Message !== 'No data found.') {
					this.props.showNotification('Error', result.Message[0].Message, TOAST.TYPE_ERROR)
				}
			}
		})
	}

	render() {
		const { searchText } = this.state
		return (
			<div className='filter-product bg-dark p-4 '>
				<div className='row'>
					<div className='col-sm-4 col-md-6 col-lg-2'>
						<div className='form-group'>
							<h6>From</h6>
							<div className='dropdown-select warning'>
								<FormGroup>
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
										dateFormat='DD/MM/YYYY'
										maxDate={moment(this.state.toDate).format('YYYY-MM-DD')}
										// maxDate={moment(new Date()).format('YYYY-MM-DD')}
										showClearButton={false}
									/>
								</FormGroup>
							</div>
						</div>
					</div>
					<div className='col-sm-4 col-md-6 col-lg-2'>
						<div className='form-group'>
							<h6>To</h6>
							<div className='dropdown-select warning'>
								<FormGroup>
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
										minDate={moment(this.state.fromDate).format('YYYY-MM-DD')}
										maxDate={moment(new Date()).format('YYYY-MM-DD')}
										dateFormat='DD/MM/YYYY'
										showClearButton={false}
									/>
								</FormGroup>
							</div>
						</div>
					</div>
					<div className='col-sm-4 col-md-6 col-lg-2'>
						<div className='form-group'>
							<h6>Filter</h6>
							<div className='dropdown-select warning'>
								<FormGroup>
									<Input
										type='select'
										id='filter'
										placeholder='Select'
										name='searchFieldCode'
										onChange={e => this.handleChange(e)}
									>
										<option value=''>All</option>
										{this.props.filterList ? (
											this.props.filterList.map(function (item, i) {
												return (
													<option value={item.Filter_Code} key={i}>
														{item.Filter_Desc}
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
					<div className='col-sm-3 col-md-3 col-lg-3 mt-lg-0 mt-md-0 mt-3'>
						<h6>Search</h6>
						<input
							type='text'
							className='form-control form-search border-0'
							placeholder='Search by Patient, Phlebotomist'
							title='Search by Patient, Phlebotomist'
							id='form-search'
							value={searchText}
							name='searchText'
							onChange={e => this.handleChange(e)}
							disabled={this.state.searchFieldCode === ''}
						/>
					</div>
					<div className='col-sm d-flex align-self-center'>
						<div className='form-group m-0 mb-2'>
							<button
								className='btn btn-sm btn-primary ml-lg-3 ml-md-3 ml-sm-0 mt-lg-0 mt-md-0 w-100'
								onClick={() => this.onClickSubmit()}
							>
								Search
							</button>
						</div>
					</div>
					<div className='col-sm d-flex align-self-center'>
						<div className='form-group m-0 mb-2'>
							{this.state.dataArr.length !== 0 ? (
								<CSVLink
									filename={`SOS_Alert_${moment(new Date()).format('DDMMYYYY_HHMMSS')}.csv`}
									data={this.state.dataArr}
									className='btn btn-sm btn-success ml-lg-3 ml-md-3 ml-sm-0 mt-lg-0 mt-md-0 mt-3 w-100'
								>
									Download
								</CSVLink>
							) : (
								<button className='btn btn-sm btn-success ml-lg-3 ml-md-3 ml-sm-0 mt-lg-0 mt-md-0 mt-3 w-100' disabled>
									Download
								</button>
							)}
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
	getFilter: PropTypes.func,
	getSOS: PropTypes.func,
	filterList: PropTypes.array,
	labAdminCode: PropTypes.string,
	showNotification: PropTypes.func,
}

export default connect(null, {
	getFilter,
	getSOS,
	showNotification,
})(SearchFilter)
