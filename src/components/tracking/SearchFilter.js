import React, { Component } from 'react'
import { FormGroup, Input } from 'reactstrap'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getSearchFilters, getTrackingList } from '../../actions/trackingAction'
import store from 'store'
import { isEmptyString } from '../../utils/validations'

class SearchFilter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			searchText: '',
			selectedSearchBy: '',
			selectedFilter: '',
			showLoading: false,
			labAdminCode: store.get('userSession').Message[0].Labadmin_Code,
			searchByList: [],
			filterList: [],
			intervalId: null,
		}
	}

	componentDidMount() {
		this.props.setShowLoading(true)
		const searchData = {
			Search_Type_Code: 'H',
		}
		this.props.getSearchFilters(searchData, (result, searchByList) => {
			if (result) {
				this.setState({ searchByList })
				this.getList()
			}
		})
		const filter = {
			Search_Type_Code: 'T',
		}
		this.props.getSearchFilters(filter, (result, filterList) => {
			if (result) {
				this.setState({ filterList })
			}
		})
		this.getTrackingList()
	}
	componentWillUnmount = () => {
		clearInterval(this.state.intervalId)
	}

	handleChange = event => {
		if (event.target.name === 'searchText') {
			if (this.state.selectedSearchBy === 'BI') {
				this.setState({ [event.target.name]: event.target.value.trim() })
				if (event.target.name !== 'searchText' && event.target.name !== 'selectedFilter')
					this.setState({ searchText: '' })
			} else {
				this.setState({ [event.target.name]: event.target.value })
				if (event.target.name !== 'searchText' && event.target.name !== 'selectedFilter')
					this.setState({ searchText: '' })
			}
		} else {
			this.setState({ [event.target.name]: event.target.value })
			if (event.target.name !== 'searchText' && event.target.name !== 'selectedFilter')
				this.setState({ searchText: '' })
		}
	}

	getList = () => {
		let intervalId = setInterval(() => {
			this.getTrackingList()
		}, 10000)
		this.setState({ intervalId: intervalId })
	}

	getTrackingList = () => {
		const { searchText, labAdminCode, selectedFilter, selectedSearchBy } = this.state
		this.props.setShowLoading(true)
		this.setState({ showLoading: true })
		let data = {
			Labadmin_Code: labAdminCode,
		}
		if (!isEmptyString(searchText)) {
			data.Search_Text = searchText.trim()
		}
		if (!isEmptyString(selectedFilter)) {
			data.Booking_Status_Code = selectedFilter
		}
		if (!isEmptyString(selectedSearchBy)) {
			data.Search_Field_Code = selectedSearchBy
		}
		this.props.getTrackingList(data, result => {
			this.props.setShowLoading(false)
			this.setState({ showLoading: false })
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})
	}

	render() {
		const { searchText } = this.state
		return (
			<div className='filter-product  bg-dark p-4 '>
				<div className='row col-sm-12 mr-0'>
					<div className='col-sm-2'>
						<div className='d-flex flex-row '>
							<div className='dropdown-filter w-100'>
								<h6>Search By</h6>
								<FormGroup>
									<Input
										type='select'
										id='filter'
										placeholder='Select'
										name='selectedSearchBy'
										value={this.state.selectedSearchBy}
										onChange={e => this.handleChange(e)}
									>
										<option value=''>All</option>
										{this.state.searchByList &&
											this.state.searchByList.map((item, i) => {
												return (
													<option value={item.Filter_Code} key={i}>
														{item.Filter_Desc}
													</option>
												)
											})}
									</Input>
								</FormGroup>
							</div>
						</div>
					</div>
					<div className='col-sm'>
						<h6>Search</h6>
						<input
							type='text'
							className='form-control form-search border-0'
							placeholder='Search by Patient Name, Phlebotomist, Booking Id'
							id='form-search'
							value={searchText}
							name='searchText'
							onChange={e => this.handleChange(e)}
							disabled={isEmptyString(this.state.selectedSearchBy)}
						/>
					</div>
					<div className='col-sm'>
						<div className='d-flex flex-row '>
							<div className='dropdown-filter w-100'>
								<h6>Filter</h6>
								<FormGroup>
									<Input
										type='select'
										id='filter'
										placeholder='Select'
										name='selectedFilter'
										value={this.state.selectedFilter}
										onChange={e => this.handleChange(e)}
									>
										<option value=''>All</option>
										{this.state.filterList &&
											this.state.filterList.map((item, i) => {
												return (
													<option value={item.Filter_Code} key={i}>
														{item.Filter_Desc}
													</option>
												)
											})}
									</Input>
								</FormGroup>
							</div>
						</div>
					</div>
					<div className='col-sm-2 col-md-6 col-lg-1 d-flex align-self-center'>
						<div className='form-group m-0 mt-2'>
							<button
								className='btn btn-sm btn-primary br-5'
								onClick={() => this.getTrackingList()}
								disabled={this.state.showLoading}
							>
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
	getSearchFilters: PropTypes.func,
	getTrackingList: PropTypes.func,
	setShowLoading: PropTypes.func,
}

export default connect(null, { getSearchFilters, getTrackingList })(SearchFilter)
