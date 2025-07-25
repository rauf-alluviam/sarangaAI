import axios from 'axios';

export const FETCH_STORE_STOCK_REQUEST = 'FETCH_STORE_STOCK_REQUEST';
export const FETCH_STORE_STOCK_SUCCESS = 'FETCH_STORE_STOCK_SUCCESS';
export const FETCH_STORE_STOCK_FAILURE = 'FETCH_STORE_STOCK_FAILURE';
export const ADD_STORE_STOCK_REQUEST = 'ADD_STORE_STOCK_REQUEST';
export const ADD_STORE_STOCK_SUCCESS = 'ADD_STORE_STOCK_SUCCESS';
export const ADD_STORE_STOCK_FAILURE = 'ADD_STORE_STOCK_FAILURE';
export const UPDATE_STORE_STOCK_REQUEST = 'UPDATE_STORE_STOCK_REQUEST';
export const UPDATE_STORE_STOCK_SUCCESS = 'UPDATE_STORE_STOCK_SUCCESS';
export const UPDATE_STORE_STOCK_FAILURE = 'UPDATE_STORE_STOCK_FAILURE';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

export const fetchStoreStock = (year, month, day, token) => async (dispatch) => {
  console.log('Fetching store stock for year:', year, 'month:', month, 'day:', day);
  dispatch({ type: FETCH_STORE_STOCK_REQUEST });
  try {
    const response = await axios.get(
      `${BACKEND_API}/get_daily_store_stock_monitoring_sheets/${year}/${month}/${day}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    console.log(response.data);
    dispatch({ type: FETCH_STORE_STOCK_SUCCESS, payload: response.data.entries });
  } catch (error) {
    console.log(error);
    dispatch({ type: FETCH_STORE_STOCK_FAILURE, payload: error.message });
  }
};

export const addStoreStock = (stockData, token, onSuccess, onError) => async (dispatch) => {
  dispatch({ type: ADD_STORE_STOCK_REQUEST });
  try {
    const response = await axios.post(
      `${BACKEND_API}/submit_store_stock_monitoring_sheet_entry`,
      stockData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    dispatch({ type: ADD_STORE_STOCK_SUCCESS, payload: { _id: response.data.id, ...stockData } });
    if (onSuccess) onSuccess(response?.data?.message || 'Store Stock Added Successfully'); // clear form or close modal
  } catch (error) {
    console.log(error);
    dispatch({ type: ADD_STORE_STOCK_FAILURE, payload: error.message });
    if (onError) onError(error.response?.data?.message || 'Failed to add store stock.'); // Pass error message to onError
  }
};

export const updateStoreStock = (stockData, token, onSuccess, onError) => async (dispatch) => {
  dispatch({ type: UPDATE_STORE_STOCK_REQUEST });
  try {
    const updatedStock = {
      item_description: stockData.item_description,
      minimum_STOCK: 200,
      maximum_STOCK: stockData.maximum,
      current_STOCK: stockData.current || 0,
      resp_person: stockData.resp_person || '',
      location: stockData.location || '',
      status: stockData.status || '',
      plan: stockData.plan || '',
      actual: stockData.actual || '',
      timestamp: new Date().toISOString(),
      _id: stockData._id, // Include the ID to update the specific stock entry
    };

    let locationValue = stockData.location;
    // If location is an object with p1/p2/p3, keep as object, else as string
    if (typeof locationValue === 'object' && locationValue !== null && (
      locationValue.p1 !== undefined || locationValue.p2 !== undefined || locationValue.p3 !== undefined
    )) {
      locationValue = {
        p1: locationValue.p1 || '',
        p2: locationValue.p2 || '',
        p3: locationValue.p3 || ''
      };
    } else if (typeof locationValue === 'string') {
      // keep as string
    } else {
      locationValue = '';
    }
    const updatedStock2 = {
      item_description: stockData.item_description,
      minimum: 200,
      maximum: stockData.maximum,
      current: stockData.current || 0,
      resp_person: stockData.resp_person || '',
      location: locationValue,
      status: stockData.status || '',
      plan: stockData.plan || '',
      actual: stockData.actual || '',
      timestamp: new Date().toISOString(),
      _id: stockData._id, // Include the ID to update the specific stock entry
    };

    // {
    //     "_id": "6863bd4734808737a60be94b",
    //     "item_description": "PC - 10% DIFFUSION WHITE(CLEAR)",
    //     "minimum": 200,
    //     "maximum": 2000,
    //     "current": null,
    //     "location": "",
    //     "actual": "",
    //     "plan": "",
    //     "status": "",
    //     "resp_person": "",
    //     "timestamp": "2025-07-01T10:49:43.611000",
    //     "year": 2025,
    //     "month": 7,
    //     "day": 2
    //   }

    const response = await axios.put(
      `${BACKEND_API}/update_store_stock_monitoring_sheet_entry/${stockData._id}`,
      updatedStock2,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // {
    //     "item_description": "PC GRANITE-BLACK",
    //     "minimum_STOCK": 200,
    //     "maximum_STOCK": 2500,
    //     "current_STOCK": 650,
    //     "resp_person": "Shrikant",
    //     "location": "C",
    //     "status": "string",
    //     "plan": "dsdsdsd",
    //     "actual": "sddsds",
    //     "timestamp": "2025-07-01T09:01:54.991Z"
    //   }

    console.log(response.data);
    dispatch({ type: UPDATE_STORE_STOCK_SUCCESS, payload: updatedStock2 });
    if (onSuccess) onSuccess(response?.data?.message || 'Stock Updated Successfully'); // clear form or close modal
  } catch (error) {
    console.log(error);
    dispatch({ type: UPDATE_STORE_STOCK_FAILURE, payload: error.message });
    if (onError) onError(error.response?.data?.detail || 'Failed to update store stock.'); // Pass error message
  }
};
