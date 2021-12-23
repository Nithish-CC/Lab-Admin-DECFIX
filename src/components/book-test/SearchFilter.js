import React, { Component } from 'react'
import { FormGroup, Input } from 'reactstrap'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getTestSearchDetails, getTestListDetails } from '../../actions/bookTestAction'
import { showNotification } from '../../actions/commonAction'
import { getLabadminCode } from '../../utils/Utility'
import { Spinner } from 'reactstrap'

class SearchFilter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			searchText: '',
			searchFieldCode: 'PI',
			searching: false,
		}
	}

	componentDidMount() {
		this.props.onLoadTrue()
		const searchData = {
			Search_Type_Code: 'P',
		}
		this.props.getTestSearchDetails(searchData, result => {
			this.props.onLoadFalse()
			if (result) {
				console.log('')
			} else {
				console.log('')
			}
		})
	}

	handleChange = event => {
		if (event.target.name === 'searchFieldCode') {
			this.setState({ [event.target.name]: event.target.value, searchText: '' })
		} else {
			if (this.state.searchFieldCode === 'PM') {
				const re = /^[0-9\b]+$/

				if (re.test(event.target.value) || event.target.value === '') {
					this.setState({ [event.target.name]: event.target.value.trim('') })
				}
			} else {
				this.setState({ [event.target.name]: event.target.value })
			}
		}
	}

	onClickSubmit = () => {
		const { searchFieldCode, searchText } = this.state
		const data = {
			Labadmin_Code: getLabadminCode(),
			Search_Text: searchText ? searchText : '',
			Search_Field_Code: searchFieldCode,
		}
		if (!searchText) {
			this.props.showNotification('Warning', 'Please enter search text', 'warning')
		} else {
			this.setState({ searching: true })
			this.props.getTestListDetails(data, result => {
				this.props.onLoadFalse()
				if (result) {
					console.log('')
				} else {
					console.log('')
				}
				this.setState({ searching: false })
			})
		}
	}

	render() {
		const { searchText } = this.state
		return (
			<div className='filter-product  bg-dark p-4 '>
				<div className='row col-sm-12'>
					<div className='col-sm-2'>
						<div className='d-flex flex-row '>
							<div className='dropdown-filter'>
								<h6>Filter</h6>
								<FormGroup>
									<Input
										type='select'
										id='filter'
										placeholder='Select'
										name='searchFieldCode'
										onChange={e => this.handleChange(e)}
									>
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
					<div className='col-sm'>
						<h6>Search</h6>
						<input
							type='text'
							className='form-control form-search border-0'
							placeholder='Search by PID, Name, Mobile'
							title='Search by PID, Name, Mobile'
							id='form-search'
							value={searchText}
							name='searchText'
							onChange={e => this.handleChange(e)}
						/>
					</div>
					<div className='col-sm-4 col-md-6 col-lg-1 d-flex align-self-center'>
						<div className='form-group m-0 mt-2'>
							<button
								disabled={this.state.searching}
								className='btn btn-sm btn-primary br-5'
								onClick={() => this.onClickSubmit()}
							>
								{this.state.searching ? <Spinner size='sm' /> : 'Search'}
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

SearchFilter.propTypes = {
	getTestSearchDetails: PropTypes.func,
	getTestListDetails: PropTypes.func,
	onLoadTrue: PropTypes.func,
	onLoadFalse: PropTypes.func,
	showNotification: PropTypes.func,
	filterList: PropTypes.array,
}

export default connect(null, { getTestSearchDetails, getTestListDetails, showNotification })(SearchFilter)
