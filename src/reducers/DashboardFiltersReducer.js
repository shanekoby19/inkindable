import moment from "moment";

const defaultState = {
    currentChildNameValue: ` `,
    currentLogTypeValue: ``,
    currentStatusValue: ``,
    currentStartDateValue: moment(),
    currentEndDateValue: moment(),
};

export default (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_DASHBOARD_CHILD_NAME_FILTER':
            return {
                ...state,
                currentChildNameValue: action.filterValue
            }
        case 'UPDATE_DASHBOARD_LOG_TYPE_FILTER':
            return {
                ...state,
                currentLogTypeValue: action.filterValue
            }
        case 'UPDATE_DASHBOARD_STATUS_FILTER':
            return {
                ...state,
                currentStatusValue: action.filterValue
            }
        case 'UPDATE_DASHBOARD_START_DATE_FILTER':
            return {
                ...state,
                currentStartDateValue: action.filterValue
            }
        case 'UPDATE_DASHBOARD_END_DATE_FILTER':
            return {
                ...state,
                currentEndDateValue: action.filterValue
            }
        default:
             return {
                ...state
            }
    }
}