/*************************************************
 * LIS
 * @file Wrapper.js
 * @author Sasidharan // on 08/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
import React from 'react'
import PropTypes from 'prop-types'

import logo from '../../assets/media/images/sukrass-logo.png'

const Wrapper = ({ children }) => {
	return (
		<div className='wrapper'>
			<div className='d-flex  h-100 login justify-content-center'>
				<div className='align-self-center mt-3 mobile-width p-4 curved w-25 bg-white'>
					<img src={logo} alt='' className='mx-auto img-fluid w-50 d-table mt-4 mb-3' />
					<hr className='mt-4 mb-4' />
					{children}
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
}

export default Wrapper
