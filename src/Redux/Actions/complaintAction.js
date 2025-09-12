import axios from 'axios';

// Action Types
export const FETCH_COMPLAINTS_REQUEST = 'FETCH_COMPLAINTS_REQUEST';
export const FETCH_COMPLAINTS_SUCCESS = 'FETCH_COMPLAINTS_SUCCESS';
export const FETCH_COMPLAINTS_FAILURE = 'FETCH_COMPLAINTS_FAILURE';
export const ADD_COMPLAINT_REQUEST = 'ADD_COMPLAINT_REQUEST';
export const ADD_COMPLAINT_SUCCESS = 'ADD_COMPLAINT_SUCCESS';
export const ADD_COMPLAINT_FAILURE = 'ADD_COMPLAINT_FAILURE';
export const UPDATE_COMPLAINT_REQUEST = 'UPDATE_COMPLAINT_REQUEST';
export const UPDATE_COMPLAINT_SUCCESS = 'UPDATE_COMPLAINT_SUCCESS';
export const UPDATE_COMPLAINT_FAILURE = 'UPDATE_COMPLAINT_FAILURE';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

// Fetch Complaints (Changed to Quarterly)
export const fetchComplaints = (selectedYear, selectedQuarter, token) => async (dispatch) => {
  dispatch({ type: FETCH_COMPLAINTS_REQUEST });
  try {
    const response = await axios.get(
      `${BACKEND_API}/get_quarterly_customer_complaint_sheets/${selectedYear}/${selectedQuarter}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({
      type: FETCH_COMPLAINTS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    dispatch({
      type: FETCH_COMPLAINTS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Add Complaint
export const addComplaint = (complaintData, onSuccess, onError) => async (dispatch, getState) => {
  dispatch({ type: ADD_COMPLAINT_REQUEST });
  try {
    const token = getState().auth.token;
    const response = await axios.post(
      `${BACKEND_API}/submit_customer_complaint_sheet_entry`,
      complaintData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const successMessage = response?.data?.message || 'Complaint added successfully';
    if (onSuccess) onSuccess(successMessage);

    dispatch({
      type: ADD_COMPLAINT_SUCCESS,
      payload: { id: response.data.id, ...complaintData },
    });
  } catch (error) {
    console.error('Error adding complaint:', error);
    const errorMessage = error?.response?.data?.message || 'Failed to add complaint';

    dispatch({
      type: ADD_COMPLAINT_FAILURE,
      payload: errorMessage,
    });

    if (onError) onError(errorMessage);
  }
};

// Update Complaint
export const updateComplaint =
  (complaintId, complaintData, onSuccess, onError) => async (dispatch, getState) => {
    dispatch({ type: UPDATE_COMPLAINT_REQUEST });
    try {
      const token = getState().auth.token;
      const response = await axios.put(
        `${BACKEND_API}/update_customer_complaint_sheet_entry/${complaintData.id}`,
        complaintData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const successMessage = response?.data?.message || 'Complaint updated successfully';
      if (onSuccess) onSuccess(successMessage);

      dispatch({
        type: UPDATE_COMPLAINT_SUCCESS,
        payload: { id: response.data.id, ...complaintData },
      });
    } catch (error) {
      console.error('Error updating complaint:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to update complaint';

      dispatch({
        type: UPDATE_COMPLAINT_FAILURE,
        payload: errorMessage,
      });

      if (onError) onError(errorMessage);
    }
  };
