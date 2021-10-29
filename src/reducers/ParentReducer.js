const defaultState = {
    currentParent: {},
    allParents: [],
};

export default (state = defaultState, action) => {
    switch(action.type) {
        case 'CREATE_PARENT':
            return {
                currentParent: action.parent,
                allParents: [...state.allParents, action.parent]
            }
        case 'DELETE_PARENT':
            return {
                currentParent: {},
                allParents: [...state.allParents].filter(parent => parent.refId !== action.refId)
            }
        case 'LOAD_PARENT':
            return {
                currentParent: action.parent,
                allParents: [...state.allParents, action.parent]
            }
        case 'UPDATE_PARENT':
            const index = state.allParents.findIndex((parent => parent.refId === action.parent.refId));
            const copy = [...state.allParents];
            copy[index] = action.parent;
            return {
                currentParent: action.parent,
                allParents: [...copy],
            };
        default:
            return state;
    }
}