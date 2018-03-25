import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import listReducer from './Redux/ListReducer';
import formReducer from './Redux/FormReducer';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reducer = combineReducers({
    list: listReducer, 
    form: formReducer,
});

const store = createStore(reducer, composeEnhancers(compose(applyMiddleware(thunk))));

const app = (
    <Provider store={store} >
        <App />
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
