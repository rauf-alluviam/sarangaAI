import axios from "axios";

// Action Types
export const FETCH_TOOLS_REQUEST = "FETCH_TOOLS_REQUEST";
export const FETCH_TOOLS_SUCCESS = "FETCH_TOOLS_SUCCESS";
export const FETCH_TOOLS_FAILURE = "FETCH_TOOLS_FAILURE";

export const ADD_TOOL_REQUEST = "ADD_TOOL_REQUEST";
export const ADD_TOOL_SUCCESS = "ADD_TOOL_SUCCESS";
export const ADD_TOOL_FAILURE = "ADD_TOOL_FAILURE";

export const UPDATE_TOOL_REQUEST = "UPDATE_TOOL_REQUEST";
export const UPDATE_TOOL_SUCCESS = "UPDATE_TOOL_SUCCESS";
export const UPDATE_TOOL_FAILURE = "UPDATE_TOOL_FAILURE";

const BACKEND_API= import.meta.env.VITE_BACKEND_API;


// Action Creators

// Fetch Tools
export const fetchTools = (year, month, token) => async (dispatch) => {
  dispatch({ type: FETCH_TOOLS_REQUEST });
  try {
    const response = await axios.get(
      `${BACKEND_API}/get_daily_tool_management_sheets/${year}/${month}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    // Determine the correct data source
    const toolsData = Array.isArray(response.data)
      ? response.data
      : response.data?.entries || [];

    // console.log(response)
    dispatch({ type: FETCH_TOOLS_SUCCESS, payload: toolsData });
  } catch (error) {
    dispatch({ type: FETCH_TOOLS_FAILURE, payload: error.message });
  }
};

// Add Tool
// export const addTool = (toolData, token, onSuccess, onError) => async (dispatch) => {
//   dispatch({ type: ADD_TOOL_REQUEST });
//   try {
//     const response = await axios.post(
//       `${BACKEND_API}/submit_tool_management_sheet_entry`,
//       toolData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     dispatch({ type: ADD_TOOL_SUCCESS, payload: response.data });
//     if (onSuccess) onSuccess(response?.data?.message || 'Tool added successfully');
//   } catch (error) {
//     dispatch({ type: ADD_TOOL_FAILURE, payload: error.message });
//     if (onError) onError(error?.response?.data?.message || 'Failed to add Tool');
//   }
// };

export const addTool = (toolData, token, onSuccess, onError) => async (dispatch) => {
  dispatch({ type: ADD_TOOL_REQUEST });
  try {
    const response = await axios.post(
      `${BACKEND_API}/submit_tool_management_sheet_entry`,
      toolData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Dispatch success action
    dispatch({ type: ADD_TOOL_SUCCESS, payload: response.data });

    // Trigger the success callback
    if (onSuccess) onSuccess(response?.data?.message || "Tool added successfully");
    console.log(response.data)
  } catch (error) {
    // Dispatch failure action
    dispatch({ type: ADD_TOOL_FAILURE, payload: error.message });

    // Trigger the error callback
    if (onError) onError(error?.response?.data?.message || "Failed to add Tool");
    console.log(error.message)
  }
};

// Update Tool
export const updateTool = (toolId, toolData, token, onSuccess, onError) => async (dispatch) => {
  dispatch({ type: UPDATE_TOOL_REQUEST });
  try {
    const response = await axios.put(
      `${BACKEND_API}/update_tool_management_sheet_entry/${toolId}`,
      toolData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response)
    dispatch({ type: UPDATE_TOOL_SUCCESS, payload: {id: response.data.id, ...toolData} });
    if(onSuccess) onSuccess(response?.data?.message || 'Tool Updated Successfully'); // clear form or close modal
  } catch (error) {
    dispatch({ type: UPDATE_TOOL_FAILURE, payload: error.message });
    if (onError) onError(error.response?.data?.message || "Failed to update Tool"); // Pass error message
  }
};