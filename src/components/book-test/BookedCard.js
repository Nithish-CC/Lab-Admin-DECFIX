import React from 'react'
import profile from '../../assets/media/images/image.png'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { PATH } from '../../config/routes'

const BookedCard = props => {
	return (
		<div className='box_sec w-25 px-2 mb-3'>
			<div className='amazon_products bg-white rounded-lg pt-3'>
				<div className='row pl-3'>
					<div className='col-sm-4 col-4'>
						<img
							style={{ width: '100%', height: '100px' }}
							src={props.Pt_Profile_Picture || props.User_Image_Url || profile}
							alt=''
						/>
						<p className='mt-2 text-truncate' title={props.Pt_Name}>
							{props.Pt_Name}
						</p>
						<p className='mt-2'>Age - {props.Pt_First_Age}</p>
					</div>
					<div className='col-sm-8 col-8'>
						<div className='d-flex flex-row'>
							<div>
								<p className='m-0'>
									<i className='far fa-mars pr-1' />
									{props.Pt_Gender}
								</p>
							</div>
							<div className='pl-3'>
								<p className='m-0'>
									<i className='far fa-mobile pr-1' />
									{props.Pt_Mobile_No}
								</p>
							</div>
						</div>
						<p className='m-0 pt-2'>
							{props.Pt_Location && (
								<>
									<i className='far fa-map-marker-alt pr-1' /> `${props.Pt_Location}, `
								</>
							)}
							<br />
							{props.Street ? `${props.Street}, ` : ''}
						</p>
						<br />
						<button type='button' className='btn btn-dark rounded mr-2'>
							<Link
								style={{ textDecoration: 'none' }}
								className='text-white'
								to={{
									pathname: PATH.BOOK_TEST_BOOK,
									//pathname : '/book-test/BookNewone',
									state: {
										patientCode: props.Pt_Code,
										User_Login_Name: props.User_Login_Name,
									},
								}}
							>
								Book
							</Link>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

BookedCard.propTypes = {
	PinCode: PropTypes.string,
	Street: PropTypes.string,
	Pt_Name: PropTypes.string,
	Pt_First_Age: PropTypes.string,
	Pt_Gender: PropTypes.string,
	Pt_Mobile_No: PropTypes.string,
	Pt_Location: PropTypes.string,
	Pt_Code: PropTypes.string,
	User_Image_Url: PropTypes.string,
	Pt_Profile_Picture: PropTypes.string,
	User_Login_Name: PropTypes.string,
}

export default BookedCard
