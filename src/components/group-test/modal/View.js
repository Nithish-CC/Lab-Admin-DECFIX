import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal as Popup, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'

class Modal extends Component {
	state = {}

	render() {
		return (
			<Popup isOpen toggle={() => this.props.onClickClose()} size='lg'>
				<ModalHeader toggle={() => this.props.onClickClose()} className='w-100'>
					<div className='p-2'>
						{this.props.Package_Name}, {`(${this.props.Package_Code})`}
					</div>
				</ModalHeader>
				<ModalBody>
					<div className='row'>
						<div className='col-sm-12'>
							<div className='d-flex w-100'>
								<div className='p-2'>
									<h4>Service List</h4>
									<div className='col-12'>
										{this.props.Service_List &&
											this.props.Service_List.map((item, i) => {
												return (
													<p style={{ color: '#106690' }} key={i}>
														<i className='far fa-check pr-2' />
														{item.Service_Name}
													</p>
												)
											})}
									</div>
									{this.props.Effective_From && this.props.Effective_To && (
										<div>
											<h4>Date</h4>
											<p style={{ color: '#106690' }}>
												{moment(this.props.Effective_From).format('DD-MM-YYYY')} To{' '}
												{moment(this.props.Effective_To).format('DD-MM-YYYY')}
											</p>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<div className='row'>
						<div className='col-sm-12'>
							<button type='button' className='btn btn-light rounded mr-2' onClick={() => this.props.onClickClose()}>
								Close
							</button>
						</div>
					</div>
				</ModalFooter>
			</Popup>
		)
	}
}

Modal.propTypes = {
	onClickClose: PropTypes.func,
	Service_List: PropTypes.array,
	Package_Code: PropTypes.string,
	Package_Name: PropTypes.string,
	Effective_From: PropTypes.string,
	Effective_To: PropTypes.string,
}

export default connect(null, {})(Modal)
