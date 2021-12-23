import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

class CancelModal extends Component {
	state = {
		reason: '',
		error: false,
	}

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value })
		this.setState({ error: false })
	}

	onClickSubmit = () => {
		if (this.state.reason) {
			this.props.onCancelSubmit(this.state.reason)
		} else {
			this.setState({ error: true })
		}
	}

	render() {
		const { error } = this.state
		return (
			<Modal isOpen toggle={() => this.props.onClickClose()} size='lg'>
				<ModalHeader toggle={() => this.props.onClickClose()} className='w-100'>
					<div className='d-flex w-100'>
						<div className='p-2'>Cancel Booking</div>
					</div>
				</ModalHeader>
				<ModalBody>
					<div className='row'>
						<div className='col-sm-12'>
							<div className='d-flex w-100'>
								<div className='p-2 w-100'>
									<h5 className='title'>Reason : </h5>
									<textarea
										className='form-control'
										placeholder='Enter reason'
										name='reason'
										onChange={e => this.handleChange(e)}
									/>
								</div>
							</div>
							{error && (
								<div>
									<small className='text-danger'>Reason Required</small>
								</div>
							)}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button type='button' className='btn btn-dark rounded mr-2' onClick={() => this.onClickSubmit()}>
						Submit
					</button>
					<button type='button' className='btn btn-light rounded mr-2' onClick={() => this.props.onClickClose()}>
						Close
					</button>
				</ModalFooter>
			</Modal>
		)
	}
}

CancelModal.propTypes = {
	onClickClose: PropTypes.func,
	onCancelSubmit: PropTypes.func,
}

export default connect(null, {})(CancelModal)
