import { createStore, combineReducers, applyMiddleware } from 'redux';
import ParentsReducer from '../reducers/ParentReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';


export default () => {
    return createStore(combineReducers({
        parent: ParentsReducer,
    }),
    composeWithDevTools(applyMiddleware(thunk)));
}