import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router/Router';
import { Provider } from 'react-redux';
import configureStore from './store/storeConfiguration';
import { AuthProvider } from './context/AuthContext';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import '../node_modules/normalize.css/normalize.css';
import 'bootstrap/dist/css/bootstrap.css';

const store = configureStore();

ReactDOM.render(
    <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Provider store={store}>  
                <Router />
            </Provider>
        </LocalizationProvider>
    </AuthProvider>, 
    document.querySelector("#app")
);