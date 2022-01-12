/* eslint-disable no-undef */
/*************************************************
 * LIS
 * @file Config.js
 * @author Sasidharan // on 08/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
let REACT_APP_BACKEND_URL = 'http://110.44.126.145:9090/SamyakApp_Stage/API/Labadmin'
// Public IP :  http://110.44.126.145:3051/SamyakApp/API/Labadmin
// Local IP  : http://192.168.10.143/SamyakApp/API/Labadmin

let apiBaseUrl = REACT_APP_BACKEND_URL
let oAuthBaseUrl = `${REACT_APP_BACKEND_URL}/Ladadmin_Login`
let isDevelopment = true

if (window.location.hostname === 'localhost') {
	apiBaseUrl = `http://110.44.126.145:9090/SamyakApp_Stage/API/Labadmin`
	oAuthBaseUrl = 'http://110.44.126.145:9090/SamyakApp_Stage/API/Labadmin/Ladadmin_Login'
	// apiBaseUrl = `http://110.44.126.145/SamyakApp/API/Labadmin`
	// oAuthBaseUrl = 'http://110.44.126.145/SamyakApp/API/Labadmin/Ladadmin_Login'
	isDevelopment = true
} else if (window.location.hostname === '183.82.246.18') {
	apiBaseUrl = `${REACT_APP_BACKEND_URL}`
	oAuthBaseUrl = `${REACT_APP_BACKEND_URL}/Ladadmin_Login`
	isDevelopment = false
} else if (window.location.hostname === '34.209.211.19') {
	apiBaseUrl = `http://183.82.246.18:9080/SukraaApp/API/Labadmin`
	oAuthBaseUrl = 'http://183.82.246.18:9080/SukraaApp/API/Labadmin/Ladadmin_Login'
	isDevelopment = false
} else {
	apiBaseUrl = `${REACT_APP_BACKEND_URL}`
	oAuthBaseUrl = `${REACT_APP_BACKEND_URL}/Ladadmin_Login`
	isDevelopment = false
}

export const IS_DEVELOPMENT = isDevelopment
export const API_BASE_URL = apiBaseUrl
export const OAUTH_BASE_URL = oAuthBaseUrl
export const GOOGLE_MAP_KEY = 'AIzaSyBA95X58xYmj0DNs4K5yX2VkA5EoUuqGRo'
/**
 * REST API endpoints
 */

export const API_ENDPOINT = {
	LOGIN: '/Labadmin_Login',
	OTP_SEND: '/OTP_Send',
	SET_PASSWORD: '/SetPassword',
	GET_BOOKING_DETAILS: '/Order_Booking_List',
	GET_BOOKING_DETAILS_SEARCH: '/Get_Search_Filters',
	GET_BOOKING_STATUS_SEARCH: '/Get_Search_Filters',
	GET_PATIENT_FILTER_SEARCH: '/Get_Search_Filters',
	GET_APP_SETTINGS: '/App_Settings',
	GET_SOS_FILTER: '/Get_Search_Filters',
	GET_TEST_LIST_DETAILS: '/Search_Patients',
	GET_PHLEBOTOMIST_DETAILS: '/Get_Collector',
	GET_BOOKING_TYPE_DETAILS: '/Get_Booking_Types',
	GET_TRACKING_OF_BOOKINGS: '/Tracking_Of_Bookings',
	GET_BOOKING_DETAILED: '/Order_Booking_Detail',
	GET_TEST_DETAILS: '/Fetch_Services_For_Order',
	ACTION_ON_BOOKING: '/Action_On_Booking',
	GET_PATIENT_GENDER: '/Get_Gender',
	GET_PATIENT_RELATIONSHIP: '/Get_Relationship',
	GET_ADDRESS_TYPE: '/Get_Address_Type',
	ADD_PATIENT: '/Add_Patient',
	GET_PATIENT: 'Get_Patient',
	GET_PATIENT_LIST: 'Get_Patient_List',
	GET_USER_ADDRESS_LIST: 'Get_User_Address',
	GET_PROMOTION: 'Get_Promotion',
	ADD_PROMOTION: 'Add_Promotion',
	MODIFY_PROMOTION: 'Modify_Promotion',
	APPLY_PROMOTION: 'Apply_Promotion',
	SEARCH_PATIENTS_TO_LINK: 'Search_Patients_ToLink',
	GET_PATIENT_DETAILS: 'Get_Patient_NonLinked',
	VIEW_PRESCRIPTION: 'View_Prescription',
	VIEW_INVOICE: 'InvoiceDownload',
	BOOK_TEST: 'Booking_Order',
	BOOKING_UPDATE: 'Update_Ordered_Booking',
	ADD_GROUP_TEST: 'Add_Package',
	GET_GROUP_TEST: 'Package_List',
	GET_SOS: 'SOS_Alert_List',
	GET_NOTIFICATIONS: 'User_Notify_In_List',
	GET_NOTIFICATION_COUNT: 'User_Notify_In_Count',
	NOTIFICATION_UPDATE: 'User_Notify_Update',
	SEARCH_FILTERS_RATINGS: 'Search_Filters_Ratings',
	VIEW_RATING: 'View_Ratings_Feedbacks',
	GET_BOOKING_SLOT: 'Get_Booking_Slot_Daywise',
	GET_COLLECTION_CHARGES: 'Get_Sample_Collection_Charge',
	OTP_SEND_PATIENT: 'OtpSend_Patient',
	OTP_VERIFICATION_PATIENT: 'OtpVerification_Patient',
}
