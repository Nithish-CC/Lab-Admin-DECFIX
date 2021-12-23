/* eslint-disable no-undef */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import MapWithADirectionsRenderer from '../Map'

class ViewModal extends Component {
	state = {}

	render() {
		return (
			<Modal isOpen toggle={() => this.props.onClickClose()} size='lg'>
				{/* <ModalHeader toggle={() => this.props.onClickClose()} className='w-100' /> */}
				<ModalBody>
					<MapWithADirectionsRenderer directions={this.props.coordinates} />
				</ModalBody>
				<ModalFooter>
					<button
						onClick={() =>
							window.open(
								`https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${this.props.coordinates.lat},${this.props.coordinates.lng}`
							)
						}
						className='btn btn-sm btn-primary'
					>
						Open in Map
					</button>
				</ModalFooter>
			</Modal>
		)
	}
}

ViewModal.propTypes = {
	onClickClose: PropTypes.func,
	coordinates: PropTypes.object,
}

export default connect(null, null)(ViewModal)
