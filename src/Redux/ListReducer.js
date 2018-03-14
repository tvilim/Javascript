import * as AT from './actions';


const initialState = {
    list: null,
    loading: false,
    error: null,
}

const listReducer = (state = initialState, action) => {
    switch (action.type) {
        case AT.LIST_LOAD_STARTED:
            return {
                ...state,
                list: null,
                loading: true,
                error: null,
            };

        case AT.LIST_LOAD_SUCCESS:
            return {
                ...state,
                list: action.list,
                loading: false,
                error: null,
            };

        case AT.LIST_LOAD_FAILED:
            return {
                ...state,
                list: null,
                loading: false,
                error: action.error,
            };

        default:
            return state;
    }
}

export default listReducer;