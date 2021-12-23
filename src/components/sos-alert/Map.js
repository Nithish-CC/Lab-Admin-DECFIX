/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
import React from 'react'
import PropTypes from 'prop-types'
import { GOOGLE_MAP_KEY } from '../../config'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps'
import { geolocated } from 'react-geolocated'

const MapWithADirectionsRenderer = compose(
	withProps({
		googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&v=3.exp&libraries=geometry,drawing,places`,
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: `400px` }} />,
		mapElement: <div style={{ height: `100%` }} />,
	}),
	withScriptjs,
	withGoogleMap,
	lifecycle({
		componentDidMount() {
			const DirectionsService = new google.maps.DirectionsService()
			console.log('props', this.props)
			if (this.props.coords) {
				DirectionsService.route(
					{
						origin: new google.maps.LatLng(this.props.coords.latitude, this.props.coords.longitude),
						destination: new google.maps.LatLng(this.props.directions.lat, this.props.directions.lng),
						travelMode: google.maps.TravelMode.DRIVING,
						unitSystem: google.maps.UnitSystem.METRIC,
					},
					(result, status) => {
						if (status === google.maps.DirectionsStatus.OK) {
							this.setState({
								directions: result,
							})
						} else {
							console.error(`error fetching directions ${result}`)
						}
					}
				)
			}
		},
	})
)(props => (
	<GoogleMap defaultZoom={7} defaultCenter={new google.maps.LatLng(props.directions.lat, props.directions.lng)}>
		{props.directions && <DirectionsRenderer directions={props.directions} />}
	</GoogleMap>
))

MapWithADirectionsRenderer.propTypes = {
	defaultDelta: PropTypes.object,
}

export default geolocated({
	positionOptions: {
		enableHighAccuracy: true,
		timeout: Infinity,
		maximumAge: 0,
	},
	userDecisionTimeout: 5000,
	geolocationProvider: navigator.geolocation,
	suppressLocationOnMount: false,
	isOptimisticGeolocationEnabled: true,
})(MapWithADirectionsRenderer)
