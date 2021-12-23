import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

class Card extends Component {
	state = {}
	render() {
		return (
			<tr>
				<td style={{ textAlign: 'left' }}>{this.props.sNo}</td>
				<td style={{ textAlign: 'left' }}>{this.props.Branch_Name ? this.props.Branch_Name : '-'}</td>
				<td style={{ textAlign: 'left' }}>{this.props.Booking_Type_Desc ? this.props.Booking_Type_Desc : '-'}</td>
				<td style={{ textAlign: 'left' }}>
					{this.props.Booking_Date ? moment(this.props.Booking_Date).format('DD/MM/YYYY') : '-'}
				</td>
				<td style={{ textAlign: 'left' }}>{this.props.Booking_No ? this.props.Booking_No : '-'}</td>
				<td style={{ textAlign: 'left' }}>{this.props.Rated_By ? this.props.Rated_By : '-'}</td>
				<td style={{ textAlign: 'right' }}>
					{(() => {
						const options = []
						for (var i = 0; i < this.props.Rating_Service_In_Number; i++) {
							options.push(<i className='fa fa-star' style={{ color: 'gold' }} aria-hidden='true' />)
						}
						return options.length !== 0 ? options : '-'
					})()}
				</td>
				<td style={{ textAlign: 'right' }}>
					{(() => {
						const options = []
						for (var i = 0; i < this.props.Rating_Phlebotomist_In_Number; i++) {
							options.push(<i className='fa fa-star' style={{ color: 'gold' }} aria-hidden='true' />)
						}
						return options.length !== 0 ? options : '-'
					})()}
				</td>
				<td style={{ textAlign: 'right' }}>
					{(() => {
						const options = []
						for (var i = 0; i < this.props.Rating_Patient_In_Number; i++) {
							options.push(<i className='fa fa-star' style={{ color: 'gold' }} aria-hidden='true' />)
						}
						return options.length !== 0 ? options : '-'
					})()}
				</td>
				<td style={{ textAlign: 'left' }}>{this.props.Review_Desc ? this.props.Review_Desc : '-'}</td>
				<td style={{ textAlign: 'left' }}>
					{this.props.Rated_By === 'Patient' ? this.props.Feedback_Patient : this.props.Feedback_Phlebotomist || '-'}
				</td>
				<td style={{ textAlign: 'left' }}>
					{this.props.Rating_Service_TimeStamp ? this.props.Rating_Service_TimeStamp : '-'}
				</td>
				<td style={{ textAlign: 'left' }}>
					{this.props.Rating_Phlebotomist_TimeStamp ? this.props.Rating_Phlebotomist_TimeStamp : '-'}
				</td>
				<td style={{ textAlign: 'left' }}>
					{this.props.Rating_Patient_TimeStamp ? this.props.Rating_Patient_TimeStamp : '-'}
				</td>
				<td style={{ textAlign: 'left' }}>{this.props.Review_TimeStamp ? this.props.Review_TimeStamp : '-'}</td>
				<td style={{ textAlign: 'left' }}>
					{this.props.Feedback_Patient_TimeStamp ? this.props.Feedback_Patient_TimeStamp : '-'}
				</td>
			</tr>
		)
	}
}

Card.propTypes = {
	sNo: PropTypes.string,
	Rating_Phlebotomist_TimeStamp: PropTypes.string,
	Rating_Patient_TimeStamp: PropTypes.string,
	Review_Type: PropTypes.string,
	Rating_Phlebotomist_In_Number: PropTypes.string,
	Feedback_Phlebotomist: PropTypes.string,
	Rating_Service_In_Number: PropTypes.string,
	Branch_Name: PropTypes.string,
	Booking_Type_Desc: PropTypes.string,
	Booking_Date: PropTypes.string,
	Booking_No: PropTypes.string,
	Rated_By: PropTypes.string,
	Rating_Patient_In_Number: PropTypes.string,
	Review_Desc: PropTypes.string,
	Feedback_Patient: PropTypes.string,
	Rating_Service_TimeStamp: PropTypes.string,
	Review_TimeStamp: PropTypes.string,
	Feedback_Patient_TimeStamp: PropTypes.string,
}

export default Card
