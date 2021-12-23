/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { GoogleMap, Marker, withScriptjs, withGoogleMap, InfoWindow } from 'react-google-maps'
import { connect } from 'react-redux'
import ResultItem from './ResultItem'
import { GOOGLE_MAP_KEY } from '../../config'

const MyMapComponent = withScriptjs(
	withGoogleMap(props => (
		<GoogleMap defaultZoom={8} defaultCenter={props.defaultDelta} center={props.defaultDelta}>
			{props.trackingList &&
				props.trackingList.map((item, index) => {
					return (
						<Marker
							icon={require('../../assets/media/images/ptIcon.png')}
							key={index}
							position={{
								lat: parseFloat(item.Collector_Latitude),
								lng: parseFloat(item.Collector_Longitude),
							}}
							onClick={() => props.handleToggleInfoBox(index)}
						>
							{item.isOpen && (
								<InfoWindow onCloseClick={() => props.handleToggleInfoBox(index)}>
									<ResultItem
										dark
										item={item}
										index={index}
										key={index}
										onClickPhelotomist={index => props.onClickPhelotomist(index)}
									/>
								</InfoWindow>
							)}
						</Marker>
					)
				})}
		</GoogleMap>
	))
)

class TrackingMap extends Component {
	state = {}
	render() {
		return (
			<MyMapComponent
				isMarkerShown
				googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&v=3.exp&libraries=geometry,drawing,places`}
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `600px` }} />}
				mapElement={<div style={{ height: `100%` }} />}
				trackingList={this.props.trackingList}
				handleToggleInfoBox={i => this.props.handleToggleInfoBox(i)}
				onClickPhelotomist={i => this.props.onClickPhelotomist(i)}
				defaultDelta={
					this.props.defaultDelta && Object.keys(this.props.defaultDelta).length
						? this.props.defaultDelta
						: {
								lat: parseFloat(
									this.props.trackingList.length ? this.props.trackingList[0].Collector_Latitude : '27.7172'
								),
								lng: parseFloat(
									this.props.trackingList.length ? this.props.trackingList[0].Collector_Longitude : '85.3240'
								),
						  }
				}
			/>
		)
	}
}

TrackingMap.propTypes = {
	isMarkerShown: PropTypes.bool,
	trackingList: PropTypes.array,
	handleToggleInfoBox: PropTypes.func,
	onClickPhelotomist: PropTypes.func,
	defaultDelta: PropTypes.object,
}
/**
 * Map all reducer state to the props of the component
 * @param {Object} state
 */
const mapStateToProps = state => {
	return {
		trackingList: state.trackingState.trackingList,
	}
}
export default connect(mapStateToProps, null)(TrackingMap)
