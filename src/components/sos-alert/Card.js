import React from 'react'
import profile from '../../assets/media/images/image.png'
import PropTypes from 'prop-types'

const Card = props => {
	const getSlicedAddress = () => {
		let fullAddress = ''
		if (props.SOS_Full_Address) fullAddress += props.SOS_Full_Address
		let sliced = fullAddress.slice(0, 65)
		if (fullAddress.length > 60) sliced += '...'
		return sliced
	}
	return (
		<div className='box_sec w-25 px-2 mb-3'>
			<div
				className='amazon_products bg-white rounded-right pt-3'
				style={{ borderLeft: `6px solid ${props.User_Type_Color_Code}` }}
			>
				<div className='row pl-3'>
					<div className='col-sm-12 col-md-4 col-lg-4 text-center text-lg-left text-md-left'>
						<img
							height='95'
							width='95'
							src={props.User_Profile_Picture ? props.User_Profile_Picture : profile}
							alt=''
						/>
						<p className='mt-2 text-center text-truncate' title={props.Name_Of_the_User}>
							{props.Name_Of_the_User}
						</p>
						<small className='mt-1 text-center text-truncate'>Age - {props.User_Age}</small>
					</div>
					<div className='col-sm-12 col-md-8 col-lg-8 text-center text-lg-left text-md-left'>
						<div className='d-flex flex-row justify-content-center justify-content-lg-start'>
							<div className=''>
								<p className='m-0'>
									<i className='far fa-mars pr-1' />
									{props.Alert_DateTime_Desc}
								</p>
							</div>
						</div>
						<p className='m-0 pt-2' title={props.SOS_Full_Address}>
							<i className='far fa-map-marker-alt pr-1' />
							{getSlicedAddress()}
						</p>
						<button
							className='btn btn-sm btn-link'
							onClick={() => props.showModal({ lat: props.SOS_Latitude, lng: props.SOS_Longitude })}
						>
							{props.SOS_Latitude}, {props.SOS_Longitude}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

Card.propTypes = {
	User_Type_Desc: PropTypes.string,
	User_Profile_Picture: PropTypes.string,
	Name_Of_the_User: PropTypes.string,
	Alert_DateTime_Desc: PropTypes.string,
	SOS_Full_Address: PropTypes.string,
	SOS_Latitude: PropTypes.string,
	SOS_Longitude: PropTypes.string,
	SOS_Location: PropTypes.string,
	showModal: PropTypes.func,
	User_Type_Color_Code: PropTypes.string,
	User_Age: PropTypes.string,
}

export default Card
