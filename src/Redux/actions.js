
export const LOAD_LIST_ASYNC = "LOAD_LIST_ASYNC";
export const LIST_LOAD_STARTED = "LIST_LOAD_STARTED";
export const LIST_LOAD_SUCCESS = "LIST_LOAD_SUCCESS";
export const LIST_LOAD_FAILED = "LIST_LOAD_FAILED";

export const SAVE_ITEM_ASYNC = "SAVE_ITEM_ASYNC";
export const SAVE_ITEM_STARTED = "SAVE_ITEM_STARTED";
export const SAVE_ITEM_SUCCESS = "SAVE_ITEM_SUCCESS";
export const SAVE_ITEM_FAILED = "SAVE_ITEM_FAILED";


const saveAsync = async (dispatch, data) => {
    try {
        const response = await fetch("https://javascript-ex.firebaseio.com/Data/List.json",
            {
                body: JSON.stringify(data), // must match 'Content-Type' header
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    'user-agent': window.navigator.userAgent,
                    'content-type': 'application/json',
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                redirect: 'follow', // *manual, follow, error
                referrer: 'no-referrer', // *client, no-referrer
            })
            .then(response => response.json()) // parses response to JSON
            .then(json => {
                console.log(json);
                dispatch(saveItemSuccess(response));
                dispatch(loadListAsync());
            })
            .catch(error => {
                console.log(error);
                dispatch(saveItemFailed(error));
            });
    }
    catch (ex) {
        console.log(ex);
    }
}

export const saveItemAsync = (dispatch, data) => {
    return dispatch => {
        dispatch(saveItemStarted(data));
        saveAsync(dispatch, data);
    }
};

export const saveItemStarted = (data) => {
    return {
        type: SAVE_ITEM_STARTED,
        value: data,
    }
};

export const saveItemSuccess = () => {
    return {
        type: SAVE_ITEM_SUCCESS,
    }
};

export const saveItemFailed = (error) => {
    return {
        type: SAVE_ITEM_FAILED,
        error: error,
    }
};

/*
const fetchAsync2 = (dispatch) => {
    fetch("https://javascript-ex.firebaseio.com/Data.json")
        .then(response => {
            return response.json();
        })
        .then(data => {
            dispatch(listLoadSuccess(data.list));
        })
        .catch(error => {
            console.log("Exception: ", error)
            dispatch(listLoadFailed(error));
        });
}*/

const fetchAsync = async (dispatch) => {
    try {
        const response = await fetch("https://javascript-ex.firebaseio.com/Data.json");
        const json = await response.json();

        console.log(json);

        const list = [];
        for (let key in json.List) {
            list.push({
                id: key,
                ...json.List[key],
            });
        }

        dispatch(listLoadSuccess(list));
    }
    catch (error) {
        console.log("Exception: ", error.message)
        dispatch(listLoadFailed(error));
    }
}



export const loadListAsync = () => {
    return dispatch => {
        dispatch(listLoadStarted());
        fetchAsync(dispatch);
    }
}

export const listLoadStarted = () => {
    return {
        type: LIST_LOAD_STARTED,
    }
}

export const listLoadSuccess = (list) => {
    return {
        type: LIST_LOAD_SUCCESS,
        list: list,
    }
}

export const listLoadFailed = (error) => {
    return {
        type: LIST_LOAD_FAILED,
        error: error,
    }
}




