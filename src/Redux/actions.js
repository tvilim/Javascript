
export const LOAD_LIST_ASYNC = "LOAD_LIST_ASYNC";
export const LIST_LOAD_STARTED = "LIST_LOAD_STARTED";
export const LIST_LOAD_SUCCESS = "LIST_LOAD_SUCCESS";
export const LIST_LOAD_FAILED = "LIST_LOAD_FAILED";

export const SAVE_ITEM_ASYNC = "SAVE_ITEM_ASYNC";
export const SAVE_ITEM_STARTED = "SAVE_ITEM_STARTED";
export const SAVE_ITEM_SUCCESS = "SAVE_ITEM_SUCCESS";
export const SAVE_ITEM_FAILED = "SAVE_ITEM_FAILED";

export const DELETE_ITEMS_STARTED = "DELETE_ITEMS_STARTED";
export const DELETE_ITEMS_SUCCESS = "DELETE_ITEMS_SUCCESS";
export const DELETE_ITEMS_FAILED = "DELETE_ITEMS_FAILED";



const deleteAsync = async (dispatch, ids) => {
    try {
        //UGH - firebase does not have API to delete multiple items with one call, so faking it in a loop here
        for (let i = 0; i < ids.length; i++) {
            const id = "https://javascript-ex.firebaseio.com/Data/List/" + ids[i] + ".json";
            await fetch(id,
                {
                    body: ids[i], // must match 'Content-Type' header
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                        'user-agent': window.navigator.userAgent,
                        'content-type': 'application/json',
                    },
                    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, cors, *same-origin
                    redirect: 'follow', // *manual, follow, error
                    referrer: 'no-referrer', // *client, no-referrer
                })
                .then(response => response.json()) // parses response to JSON
                .then(json => {
                    console.log("Item ", i, " = ", json);
                })
                .catch(error => {
                    console.log(error);
                    dispatch(deleteItemsFailed(error));
                    return;
                });
        }

        dispatch(deleteItemsSuccess());
        dispatch(loadListAsync());
    }
    catch (ex) {
        console.log(ex);
    }
};

export const deleteItemsAsync = (ids) => {
    return dispatch => {
        dispatch(deleteItemsStarted());
        deleteAsync(dispatch, ids);
    };
};

export const deleteItemsStarted = () => {
    return {
        type: DELETE_ITEMS_STARTED,
    };
};

export const deleteItemsSuccess = () => {
    return {
        type: DELETE_ITEMS_SUCCESS,
    };
};

export const deleteItemsFailed = (error) => {
    return {
        type: DELETE_ITEMS_FAILED,
        error: error,
    };
};



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
                dispatch(loadListAsync(json.name));
            })
            .catch(error => {
                console.log(error);
                dispatch(saveItemFailed(error));
            });
    }
    catch (ex) {
        console.log(ex);
    }
};

export const saveItemAsync = (dispatch, data) => {
    return dispatch => {
        dispatch(saveItemStarted(data));
        saveAsync(dispatch, data);
    };
};

export const saveItemStarted = (data) => {
    return {
        type: SAVE_ITEM_STARTED,
        value: data,
    };
};

export const saveItemSuccess = () => {
    return {
        type: SAVE_ITEM_SUCCESS,
    };
};

export const saveItemFailed = (error) => {
    return {
        type: SAVE_ITEM_FAILED,
        error: error,
    };
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

const fetchAsync = async (dispatch, idToSelect) => {
    try {
        const response = await fetch("https://javascript-ex.firebaseio.com/Data.json");
        const json = await response.json();

        console.log(json);

        const list = [];
        if (json !== null) {
            for (let key in json.List) {
                list.push({
                    id: key,
                    ...json.List[key],
                });
            }
        }

        dispatch(listLoadSuccess(list, idToSelect));
    }
    catch (error) {
        console.log("Exception: ", error.message);
        dispatch(listLoadFailed(error));
    }
};



export const loadListAsync = (id) => {
    return dispatch => {
        dispatch(listLoadStarted());
        fetchAsync(dispatch, id);
    };
};

export const listLoadStarted = (id) => {
    return {
        type: LIST_LOAD_STARTED,
        idToSelect: id,
    };
};

export const listLoadSuccess = (list, idToSelect) => {
    return {
        type: LIST_LOAD_SUCCESS,
        list: list,
        idToSelect: idToSelect,
    };
};

export const listLoadFailed = (error) => {
    return {
        type: LIST_LOAD_FAILED,
        error: error,
    };
};





