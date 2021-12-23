import React from 'react'
import profile from '../../assets/media/images/image.png'
import PropTypes from 'prop-types'

const BookedCard = props => {
	const getSlicedAddress = () => {
		let fullAddress = ''
		if (props.Street) fullAddress += props.Street + ', '
		if (props.Place) fullAddress += props.Place + ', '
		if (props.Land_Mark1) fullAddress += props.Land_Mark1 + ', '
		if (props.Land_Mark2) fullAddress += props.Land_Mark2 + ', '
		if (props.City) fullAddress += props.City + ', '
		if (props.PinCode) fullAddress += props.PinCode
		let sliced = fullAddress.slice(0, 55)
		if (fullAddress.length > 60) sliced += '...'
		return sliced
	}
	const getFullAddress = () => {
		let fullAddress = ''
		if (props.Street) fullAddress += props.Street + ', '
		if (props.Place) fullAddress += props.Place + ', '
		if (props.Land_Mark1) fullAddress += props.Land_Mark1 + ', '
		if (props.Land_Mark2) fullAddress += props.Land_Mark2 + ', '
		if (props.City) fullAddress += props.City + ', '
		if (props.PinCode) fullAddress += props.PinCode
		return fullAddress
	}
	return (
		<div className='box_sec w-25 px-2 mb-3'>
			<div
				className='amazon_products bg-white rounded-right pt-3'
				style={{ borderLeft: `3px solid ${props.Booking_Type_Color_Code}`, minHeight: '234px' }}
			>
				<div className='row pl-3'>
					<div className='col-sm-12 pr-0 col-md-4 col-lg-4 text-center text-lg-left text-md-left'>
						<img
							style={{ width: 'inherit' }}
							height='95'
							src={
								props.Pt_Profile_Picture && props.Pt_Profile_Picture.trim() !== '' ? props.Pt_Profile_Picture : profile
							}
							alt=''
						/>
						<p className='mt-2 text-center text-truncate m-0' title={props.Pt_Name}>
							{props.Pt_Name}
						</p>
						<small className='mt-2 text-center text-truncate'>Age - {props.Pt_First_Age}</small>
						{props.Booking_No && <small className='mt-2 text-center'>BID: {props.Booking_No}</small>}
						{props.Sid_No && props.Sid_No.trim().length ? (
							<small className='mt-2 text-center'>SID: {props.Sid_No}</small>
						) : null}
					</div>
					<div
						className='col-sm-12 col-md-8 col-lg-8 text-center text-lg-left text-md-left mb-2'
						style={{ maxHeight: '213px' }}
					>
						<div className='d-flex flex-column justify-content-between'>
							<div>
								<div className='d-flex flex-row justify-content-center justify-content-lg-start'>
									<div>
										<p className='m-0' style={{ fontWeight: 'bold' }}>
											{props.Branch_Name ? <i className='far fa-map-marker-alt pr-1' /> : null}
											{props.Branch_Name}
										</p>
									</div>
								</div>
								<div className='m-0 pt-2'>
									<div>
										<p className='m-0'>
											<i className='far fa-mars pr-1' />
											{props.Pt_Gender_Desc}
										</p>
									</div>
									<div>
										<p className='m-0'>
											{props.Pt_Mobile_No ? <i className='far fa-mobile pr-1' /> : null}
											{props.Pt_Mobile_No}
										</p>
									</div>
								</div>
								<p className='m-0' title={getFullAddress()}>
									{(props.Place || props.Land_Mark1 || props.Land_Mark2 || props.City || props.PinCode) &&
									props.Booking_Type_Code !== 'W' ? (
										<i className='far fa-map-marker-alt pr-1' />
									) : null}
									{getSlicedAddress()}
								</p>
								<div
									className='badge badge-warning mt-2 mb-2 text-wrap mr-1'
									style={{ backgroundColor: props.Booking_Status_Color_Code, color: 'white' }}
								>
									{props.Booking_Status_Desc}
								</div>
							</div>
							<div>
								<div className='mb-1'>
									<button
										type='button'
										className='btn btn-dark rounded mr-2'
										onClick={() =>
											props.onClickView(
												props.Booking_No,
												props.Booking_Type,
												props.Firm_No,
												props.Booking_Date,
												props.Pt_Name,
												props.Branch_Name
											)
										}
									>
										View
									</button>
									<button
										type='button'
										className='btn btn-light rounded'
										disabled={
											!props.Is_Cancellable ||
											props.Is_Cancellable === false ||
											props.Booking_Status_Desc === 'Cancelled Bookings'
										}
										onClick={() =>
											props.onCancelView(props.Booking_No, props.Booking_Type, props.Firm_No, props.Booking_Date)
										}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

BookedCard.propTypes = {
	PinCode: PropTypes.string,
	Booking_Type_Color_Code: PropTypes.string,
	Booking_Type: PropTypes.string,
	Firm_No: PropTypes.string,
	Booking_Date: PropTypes.string,
	Booking_No: PropTypes.string,
	City: PropTypes.string,
	Pt_Name: PropTypes.string,
	Pt_First_Age: PropTypes.string,
	Pt_Gender_Desc: PropTypes.string,
	Pt_Mobile_No: PropTypes.string,
	Place: PropTypes.string,
	Land_Mark1: PropTypes.string,
	Land_Mark2: PropTypes.string,
	Booking_Status_Color_Code: PropTypes.string,
	Booking_Status_Desc: PropTypes.string,
	Booking_Type_Code: PropTypes.string,
	Pt_Profile_Picture: PropTypes.string,
	Street: PropTypes.string,
	Branch_Name: PropTypes.string,
	Sid_No: PropTypes.string,
	onClickView: PropTypes.func,
	onCancelView: PropTypes.func,
	Is_Cancellable: PropTypes.bool,
}

export default BookedCard
