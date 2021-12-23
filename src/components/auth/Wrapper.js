import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getAppSettings } from '../../actions/commonAction'
import { connect } from 'react-redux'
import packageJson from '../../../package.json'

const Wrapper = ({ children, getAppSettings }) => {
	const [clientLogo, setClientLogo] = useState('')

	useEffect(() => {
		getAppSettings((success, clientLogo) => {
			if (success) {
				setClientLogo(clientLogo)
			}
		})
	}, [])

	return (
		<div className='wrapper'>
			<div className='d-flex flex-column align-items-center h-100 login justify-content-center'>
				<div className='align-self-center mt-3 mobile-width p-4 curved w-25 bg-white'>
					<img src={clientLogo} alt='' className='mx-auto img-fluid w-50 d-table mt-4 mb-3' />
					<hr className='mt-4 mb-4' />
					{children}
				</div>
				<div className='d-flex justify-content-between mt-2 fs-13'>
					<span className='mr-5'>Version {packageJson.version}</span>
					<span className='ml-3'>Powered by SUKRAA</span>
				</div>
			</div>
		</div>
	)
}

/**
 * Type of the props used in the component
 */
Wrapper.propTypes = {
	children: PropTypes.object,
	clientLogo: PropTypes.string,
	getAppSettings: PropTypes.func,
}

export default connect(null, { getAppSettings })(Wrapper)
