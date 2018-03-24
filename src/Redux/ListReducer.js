import * as AT from './actions';


const initialState = {
    list: null,
    idToSelect: null,
    loading: false,
    error: null,
};

const listReducer = (state = initialState, action) => {
    switch (action.type) {
        case AT.LIST_LOAD_STARTED:
            return {
                ...state,
                list: null,
                idToSelect: null,
                loading: true,
                error: null,
            };

        case AT.LIST_LOAD_SUCCESS:
            return {
                ...state,
                list: action.list,
                idToSelect: action.idToSelect,
                loading: false,
                error: null,
            };

        case AT.LIST_LOAD_FAILED:
            return {
                ...state,
                list: null,
                idToSelect: null,
                loading: false,
                error: action.error,
            };

        case AT.DELETE_ITEMS_STARTED:
            return {
                ...state,
                list: null,
                idToSelect: null,
                loading: true,
                error: null,
            };

        case AT.DELETE_ITEMS_SUCCESS:
            return {
                ...state,
                list: null,
                idToSelect: null,
                loading: false,
                error: null,
            };

        case AT.DELETE_ITEMS_FAILED:
            return {
                ...state,
                list: null,
                idToSelect: null,
                loading: false,
                error: action.error,
            };

        default:
            return state;
    }
};

export default listReducer;