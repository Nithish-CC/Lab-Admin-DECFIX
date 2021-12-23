/*************************************************
 * LIS
 * @file index.js
 * @author Sasidharan // on 08/10/2020
 * @copyright © 2020 LIS. All rights reserved.
 *************************************************/
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import reduxThunk from 'redux-thunk'
import ReactNotification from 'react-notifications-component'

import reducers from './reducers'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { IS_DEVELOPMENT } from './config/index'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

/**
 * Creating Redux store for application
 */
const store = createStore(
	reducers,
	IS_DEVELOPMENT ? composeEnhancers(applyMiddleware(reduxThunk)) : applyMiddleware(reduxThunk)
)

ReactDOM.render(
	<Provider store={store}>
		<ReactNotification />
		<App />
	</Provider>,
	document.querySelector('#root')
)

serviceWorker.unregister()
