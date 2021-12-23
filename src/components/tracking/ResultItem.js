import React from 'react'
import PropTypes from 'prop-types'

const ResultItem = ({ item, index, onClickPhelotomist }) => {
	return (
		<div
			className={`data-filter ${item.Collector_Latitude && item.Collector_Longitude ? '' : 'disabled'}`}
			style={{ cursor: item.Collector_Latitude && item.Collector_Longitude ? 'pointer' : '' }}
			onClick={() => onClickPhelotomist(index)}
		>
			<ul className='list-group' style={{ borderLeft: `3px solid ${item.Booking_Status_Color_Code}` }}>
				<li className=' list-group-item d-flex justify-content-between align-items-center'>
					{item.Collector_Name}
					<span className='badge'>{item.Booking_No}</span>
				</li>
				<li className='list-group-item'>{item.Collector_Mobile_No}</li>
				<li className='list-group-item data-active d-flex justify-content-between align-items-center overflow-auto'>
					Patient Info
					<span className='badge'>
						{item.Pt_Name}, {item.Pt_First_Age}, {item.Pt_Gender === 'F' ? 'Female' : 'Male'}
					</span>
				</li>
			</ul>
		</div>
	)
}
ResultItem.propTypes = {
	item: PropTypes.object,
	index: PropTypes.number,
	onClickPhelotomist: PropTypes.func,
}
export default ResultItem
