import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Card extends Component {
	state = {}
	render() {
		return (
			<div className='col-xl-4 col-md-6 mb-4'>
				<div className='card p-2 border-0 h-100'>
					<div className='d-flex justify-content-between card-header bg-white'>
						<p className='font-weight-bold overflow-auto m-0'>{this.props.Promotion_Name}</p>
						<div onClick={() => this.props.fillValues()} style={{ cursor: 'pointer' }}>
							<i className='far fa-edit pl-2' />
						</div>
					</div>
					<div className='card-body mt-2 p-2'>
						<div className='row no-gutters align-items-center'>
							<div className='col'>
								<p className='mb-1'>Starts on {this.props.Start_Date}</p>
								<p>Ends on {this.props.End_Date}</p>
							</div>
							<div className='col-auto'>
								<h4>
									<span className='badge badge-primary bg-white font-weight-normal'>{this.props.Promo_Code}</span>
								</h4>
							</div>
							<div className='col-12'>
								<p>{this.props.Promotion_Description}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Card.propTypes = {
	Promotion_Name: PropTypes.string,
	Start_Date: PropTypes.string,
	End_Date: PropTypes.string,
	Promo_Code: PropTypes.string,
	Promotion_Description: PropTypes.string,
	fillValues: PropTypes.func,
}

export default Card
