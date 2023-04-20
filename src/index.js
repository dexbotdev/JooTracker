import React from 'react'
import ReactDOM from 'react-dom'
import { createHashHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
// import { logger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'

import StylesLoader from './stylesLoader'
import reducers from './redux/reducers'
import sagas from './redux/sagas'
import Localization from './localization'
import Router from './router'
import * as serviceWorker from './serviceWorker'
import Parse from 'parse/node';
// mocking api
import 'services/axios/fakeApi'

// middlewared
const history = createHashHistory()
const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(history)
const middlewares = [sagaMiddleware, routeMiddleware]
// if (process.env.NODE_ENV === 'development') {
//   middlewares.push(logger)
// }
const store = createStore(reducers(history), compose(applyMiddleware(...middlewares)))
sagaMiddleware.run(sagas)

Parse.initialize("oJytYzvQKkUFTmqiqXUH5ABDLoR59wVTkobJDVwa", "nW1KByk1gvijsxXpKbYYv7Encj36wLtyKLB6ltW1");
Parse.serverURL = "https://parseapi.back4app.com/";

ReactDOM.render(
  <Provider store={store}>
    <StylesLoader>
      <Localization>
        <Router history={history} />
      </Localization>
    </StylesLoader>
  </Provider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
export { store, history }
