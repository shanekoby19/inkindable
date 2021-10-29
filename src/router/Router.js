import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import Dashboard from '../components/Dashboard';
import Logs from '../components/Logs';
import AccountForm from '../components/AccountForm';
import { connect } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';

const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/login' component={LoginForm} />
                <Route path='/signup' component={SignUpForm} />
                <ProtectedRoute exact path='/' component={Dashboard} ></ProtectedRoute>
                <ProtectedRoute path='/account' component={AccountForm}></ProtectedRoute>
                <ProtectedRoute path='/logs' component={Logs}></ProtectedRoute>
            </Switch>
        </BrowserRouter>
    )
}

export default connect()(Router);