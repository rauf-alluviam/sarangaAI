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

// Action Creators

// Fetch Tools
export const fetchTools = (year, month, token) => async (dispatch) => {
  dispatch({ type: FETCH_TOOLS_REQUEST });
  try {
    const response = await axios.get(
      `https://rabs.alvision.in/get_daily_tool_management_sheets/${year}/${month}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    dispatch({ type: FETCH_TOOLS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TOOLS_FAILURE, payload: error.message });
  }
};

// Add Tool
export const addTool = (toolData, token) => async (dispatch) => {
  dispatch({ type: ADD_TOOL_REQUEST });
  try {
    const response = await axios.post(
      `https://rabs.alvision.in/submit_tool_management_sheet_entry`,
      toolData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({ type: ADD_TOOL_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: ADD_TOOL_FAILURE, payload: error.message });
  }
};

// Update Tool
export const updateTool = (toolId, toolData, token) => async (dispatch) => {
  dispatch({ type: UPDATE_TOOL_REQUEST });
  try {
    const response = await axios.put(
      `https://rabs.alvision.in/update_tool_management_sheet_entry/${toolId}`,
      toolData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({ type: UPDATE_TOOL_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: UPDATE_TOOL_FAILURE, payload: error.message });
  }
};