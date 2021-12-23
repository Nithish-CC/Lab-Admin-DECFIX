import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Card extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showItems: [],
		}
	}
	render() {
		return (
			<div className='col-xl-4 col-md-6 mb-4'>
				<div className='card p-2 border-0' style={{ height: '260px' }}>
					<p className='card-header bg-white p-2 row m-0' style={{ color: '#0283c2' }}>
						<span className='text-truncate col-sm'>{this.props.Package_Name}</span>
						<span className='font-weight-bold col-sm-4 text-right' style={{ float: 'right' }}>
							Rs. {this.props.Package_Amount}
						</span>
					</p>
					<div className='card-body mt-2 p-2'>
						<div className='no-gutters h-100 d-flex flex-column justify-content-between'>
							<div className=''>
								{this.props.Service_List &&
									this.props.Service_List.slice(0, 4).map((item, i) => {
										return (
											<p style={{ color: '#106690' }} key={i} className='text-truncate'>
												<i className='far fa-check pr-2' />
												{item.Service_Name}
											</p>
										)
									})}
							</div>
							<div className=''>
								<button className='float-right btn btn-sm btn-link' onClick={() => this.props.onClickOpen(this.props)}>
									see more
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Card.propTypes = {
	Package_Name: PropTypes.string,
	Package_Amount: PropTypes.string,
	Service_List: PropTypes.array,
	onClickOpen: PropTypes.func,
}

export default Card
