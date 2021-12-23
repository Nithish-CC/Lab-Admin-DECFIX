import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Modal extends Component {
	state = {}

	render() {
		return (
			<div className='modal fade show d-block'>
				<div className='modal-dialog w-100' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<div className='d-flex w-100'>
								<div className='p-2'>Cancel Booking</div>
							</div>

							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'
								onClick={() => this.props.onClickClose()}
							>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<div className='row'>
								<div className='col-sm-12'>
									<div className='d-flex w-100'>
										<div className='p-2'>
											{' '}
											<div className='info'>
												<h5 className='title'>{this.props.message}</h5>
											</div>
										</div>
									</div>
									<button
										type='button'
										className='btn btn-light rounded mr-2'
										onClick={() => this.props.onClickClose()}
									>
										Close
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Modal.propTypes = {
	onClickClose: PropTypes.func,
	message: PropTypes.string,
}

export default connect(null, {})(Modal)
