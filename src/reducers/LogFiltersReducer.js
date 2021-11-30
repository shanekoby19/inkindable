const defaultState = {
    currentChildNameValue: ` `,
    currentLogTypeValue: ``,
    currentStatusValue: `Pending`,
};

export default (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_CHILD_NAME_FILTER':
            return {
                ...state,
                currentChildNameValue: action.filterValue
            }
        case 'UPDATE_LOG_TYPE_FILTER':
            return {
                ...state,
                currentLogTypeValue: action.filterValue
            }
        case 'UPDATE_STATUS_FILTER':
            return {
                ...state,
                currentStatusValue: action.filterValue
            }
        default:
             return {
                ...state
            }
    }
}