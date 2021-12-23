import React, { Component } from 'react'
import profile from '../../../assets/media/images/image.png'
import PropTypes from 'prop-types'

class Head extends Component {
	state = {}
	render() {
		return (
			<div className='main-content bg-white'>
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-12'>
							<div className='p-3'>
								<div className='d-sm-flex flex-wrap'>
									<div className='mb-2 d-flex align-self-center flex-grow-1'>
										<h4 className='mb-0'>Book Test</h4>
									</div>
									<div className='usr-profile mb-0 d-sm-flex '>
										<img
											src={this.props.image || profile}
											className='img-fluid rounded-circle float-sm-left mr-3'
											alt=''
											style={{ height: '50px', width: '50px' }}
											title='profile'
										/>
										<div className='profile-content'>
											<p className='mb-0 text-color'>
												{this.props.name}, {this.props.age}
											</p>
											<span className='text-color'>{this.props.gender}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
Head.propTypes = {
	name: PropTypes.string,
	age: PropTypes.string,
	gender: PropTypes.string,
	image: PropTypes.string,
}

export default Head
