import * as AT from './actions';


const initialState = {
    value: null,
    saving: false,
    error: null,
};

const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case AT.SAVE_ITEM_STARTED:
            return {
                ...state,
                value: action.value,
                saving: true,
                error: null,
            };

        case AT.SAVE_ITEM_SUCCESS:
            return {
                ...state,
                saving: false,
                error: false,
            };

        case AT.SAVE_ITEM_FAILED:
            return {
                ...state,
                saving: false,
                error: action.error,
            };

        default:
            return state;
    }
};

export default formReducer;