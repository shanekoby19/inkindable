import { createStore, combineReducers, applyMiddleware } from 'redux';
import ParentsReducer from '../reducers/ParentReducer';
import LogFiltersReducer from '../reducers/LogFiltersReducer';
import DashboardFiltersReducer from '../reducers/DashboardFiltersReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';


export default () => {
    return createStore(combineReducers({
        parent: ParentsReducer,
        logFilters: LogFiltersReducer,
        dashboardFilters: DashboardFiltersReducer,
    }),
    composeWithDevTools(applyMiddleware(thunk)));
}