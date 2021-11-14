import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import DashboardPage from '../components/DashboardPage';
import LogsPage from '../components/LogsPage';
import AccountPage from '../components/AccountPage';
import { connect } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';

const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/login' component={LoginForm} />
                <Route path='/signup' component={SignUpForm} />
                <ProtectedRoute exact path='/' component={DashboardPage} ></ProtectedRoute>
                <ProtectedRoute path='/account' component={AccountPage}></ProtectedRoute>
                <ProtectedRoute path='/logs' component={LogsPage}></ProtectedRoute>
            </Switch>
        </BrowserRouter>
    )
}

export default connect()(Router);