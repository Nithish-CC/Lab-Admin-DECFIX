import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal as Popup, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

class Modal extends Component {
	state = {}

	render() {
		return (
			<Popup isOpen toggle={() => this.props.onClickClose()} size='lg'>
				<ModalHeader toggle={() => this.props.onClickClose()} className='w-100'>
					<div className='p-2'>Notification Details</div>
				</ModalHeader>
				<ModalBody>
					<div className='row'>
						<div className='col-sm-12'>
							<div className='d-flex w-100'>
								<div className='p-2'>
									<div className='col-12'>
										<p>{this.props.Notify_Message}</p>
									</div>
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
	Notify_Date: PropTypes.string,
	Notify_Message: PropTypes.string,
}

export default connect(null, {})(Modal)
