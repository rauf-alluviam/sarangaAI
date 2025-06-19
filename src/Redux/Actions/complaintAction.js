import axios from "axios";

export const FETCH_COMPLAINTS_REQUEST = "FETCH_COMPLAINTS_REQUEST";
export const FETCH_COMPLAINTS_SUCCESS = "FETCH_COMPLAINTS_SUCCESS"; 
export const FETCH_COMPLAINTS_FAILURE = "FETCH_COMPLAINTS_FAILURE";
export const ADD_COMPLAINT_REQUEST = "ADD_COMPLAINT_REQUEST";
export const ADD_COMPLAINT_SUCCESS = "ADD_COMPLAINT_SUCCESS";
export const ADD_COMPLAINT_FAILURE = "ADD_COMPLAINT_FAILURE";
export const UPDATE_COMPLAINT_REQUEST = "UPDATE_COMPLAINT_REQUEST";
export const UPDATE_COMPLAINT_SUCCESS = "UPDATE_COMPLAINT_SUCCESS";
export const UPDATE_COMPLAINT_FAILURE = "UPDATE_COMPLAINT_FAILURE";

const BACKEND_API= import.meta.env.VITE_BACKEND_API;

export const fetchComplaints = (selectedYear, selectedMonth) => async (dispatch, getState) => {
    dispatch({ type: FETCH_COMPLAINTS_REQUEST });
    try {
        const token = getState().auth.token;
        const response= await axios.get(`${BACKEND_API}/get_monthly_customer_complaint_sheets/${selectedYear}/${selectedMonth}`,
            {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
            }
        )

        dispatch({ type: FETCH_COMPLAINTS_SUCCESS, payload: response.data });
    } catch (error) {
        console.log(error)
        dispatch({ type: FETCH_COMPLAINTS_FAILURE, payload: error.message });

    }
}

export const addComplaint = (complaintData, onSuccess) => async (dispatch, getState) => {
    dispatch({ type: ADD_COMPLAINT_REQUEST });
    try {
        const token = getState().auth.token;
        const response = await axios.post(`${BACKEND_API}/submit_customer_complaint_sheet_entry`, complaintData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (onSuccess) onSuccess();
        alert(response.data.message);
        dispatch({ type: ADD_COMPLAINT_SUCCESS, payload: {id: response.data.id, ...complaintData} });
    } catch (error) {
        console.log(error);
        dispatch({ type: ADD_COMPLAINT_FAILURE, payload: error.message });
    }
}

export const updateComplaint = (complaintId, complaintData, onSuccess) => async (dispatch, getState) => {
    dispatch({ type: UPDATE_COMPLAINT_REQUEST });
    try {
        const token = getState().auth.token;
        const response = await axios.put( `${BACKEND_API}/update_customer_complaint_sheet_entry/${complaintData.id}`, complaintData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (onSuccess) onSuccess();
        dispatch({ type: UPDATE_COMPLAINT_SUCCESS, payload: {id: response.data.id, ...complaintData} });
    } catch (error) {
        console.log(error);
        dispatch({ type: UPDATE_COMPLAINT_FAILURE, payload: error.message });
    }
}

