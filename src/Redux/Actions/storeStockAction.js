import axios from "axios";

export const FETCH_STORE_STOCK_REQUEST = "FETCH_STORE_STOCK_REQUEST";
export const FETCH_STORE_STOCK_SUCCESS = "FETCH_STORE_STOCK_SUCCESS";
export const FETCH_STORE_STOCK_FAILURE = "FETCH_STORE_STOCK_FAILURE";
export const ADD_STORE_STOCK_REQUEST = "ADD_STORE_STOCK_REQUEST";
export const ADD_STORE_STOCK_SUCCESS = "ADD_STORE_STOCK_SUCCESS";
export const ADD_STORE_STOCK_FAILURE = "ADD_STORE_STOCK_FAILURE";
export const UPDATE_STORE_STOCK_REQUEST = "UPDATE_STORE_STOCK_REQUEST";
export const UPDATE_STORE_STOCK_SUCCESS = "UPDATE_STORE_STOCK_SUCCESS";
export const UPDATE_STORE_STOCK_FAILURE = "UPDATE_STORE_STOCK_FAILURE";


export const fetchStoreStock = (year, week, token) => async (dispatch) => {
    console.log("Fetching store stock for year:", year, "week:", week);
    dispatch({ type: FETCH_STORE_STOCK_REQUEST });
    try {
        const response = await axios.get(
            `https://rabs.alvision.in/get_weekly_store_stock_monitoring_sheets/${year}/${week}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,   
                    Accept: "application/json",
                },
            }       
        );
        
        console.log(response.data);
        dispatch({ type: FETCH_STORE_STOCK_SUCCESS, payload: response.data });
    } catch (error) {
        console.log(error)
        dispatch({ type: FETCH_STORE_STOCK_FAILURE, payload: error.message });
    }
}

export const addStoreStock = (stockData, token, onSuccess, onError) => async (dispatch) => {
    dispatch({ type: ADD_STORE_STOCK_REQUEST });
    try {
        const response = await axios.post(
            `https://rabs.alvision.in/submit_store_stock_monitoring_sheet_entry`,
            stockData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        dispatch({ type: ADD_STORE_STOCK_SUCCESS, payload: {_id: response.data.id, ...stockData} });
        if(onSuccess) onSuccess(response?.data?.message || 'Store Stock Added Successfully'); // clear form or close modal
    } catch (error) {
        console.log(error)
        dispatch({ type: ADD_STORE_STOCK_FAILURE, payload: error.message });
        if (onError) onError(error.response?.data?.message || "Failed to add store stock."); // Pass error message to onError
    }
};

export const updateStoreStock = (stockData, token, onSuccess, onError) => async (dispatch) => {
    dispatch({ type: UPDATE_STORE_STOCK_REQUEST });
    try {
        const response = await axios.put(
            `https://rabs.alvision.in/update_store_stock_monitoring_sheet_entry/${stockData._id}`,
            stockData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }   
        );

        console.log(response.data);
        dispatch({ type: UPDATE_STORE_STOCK_SUCCESS, payload: stockData });
        if(onSuccess) onSuccess(response?.data?.message || 'Stock Updated Successfully'); // clear form or close modal
    } catch (error) {
        console.log(error)
        dispatch({ type: UPDATE_STORE_STOCK_FAILURE, payload: error.message });
        if (onError) onError(error.response?.data?.message || "Failed to update store stock."); // Pass error message
    }
};
