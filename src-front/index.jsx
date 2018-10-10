import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import '$sass/main';
import React from 'react';
import ReactDOM from 'react-dom';

import promise from 'redux-promise';
import multi from 'redux-multi';
import thunk from 'redux-thunk';

import App from './main/app';
import rootReducer from './main/redux-store/reducers';

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const store = applyMiddleware(thunk, multi, promise)(createStore)(rootReducer, devTools);
ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>
    , document.getElementById('app')
);