/*************************************************
 * LIS
 * @file Layout.js
 * @author Sasidharan // on 08/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
import React, { Component } from 'react'
import { connect } from 'react-redux'

import Header from './Header'

export const Layout = (Content, ...propsMapping) => {
	class HOC extends Component {
		/**
		 * Creates an instance of HOC.
		 * @param {any} props
		 * @memberof HOC
		 */
		constructor(props) {
			super(props)
			this.state = {}
		}

		render() {
			return (
				<React.Fragment>
					<div className='wrapper bg-white'>
						<div className='d-flex h-100'>
							<div className='main-contentainer d-flex flex-grow-1 flex-column container-fluid p-0'>
								<Header />
								<Content {...this.props} />
							</div>
						</div>
					</div>
				</React.Fragment>
			)
		}
	}

	return connect(...propsMapping)(HOC)
}
