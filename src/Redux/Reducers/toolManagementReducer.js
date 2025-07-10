import {
    FETCH_TOOLS_REQUEST,
    FETCH_TOOLS_SUCCESS,
    FETCH_TOOLS_FAILURE,
    ADD_TOOL_REQUEST,
    ADD_TOOL_SUCCESS,
    ADD_TOOL_FAILURE,
    UPDATE_TOOL_REQUEST,
    UPDATE_TOOL_SUCCESS,
    UPDATE_TOOL_FAILURE,
  } from "../Actions/toolManagementActions";
  
  const initialState = {
    loading: false,
    tools: [],
    error: null,
  };
  
  export const toolManagementReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_TOOLS_REQUEST:
      case ADD_TOOL_REQUEST:
      case UPDATE_TOOL_REQUEST:
        return { ...state, loading: true };
  
      case FETCH_TOOLS_SUCCESS:
        return { ...state, loading: false, tools: action.payload, error: null };
  
      case ADD_TOOL_SUCCESS:
        return {
          ...state,
          loading: false,
          tools: [...state.tools, action.payload],
          error: null,
        };
  
      case UPDATE_TOOL_SUCCESS:
        return {
          ...state,
          loading: false,
          tools: state.tools.map((tool) =>
            tool._id === action.payload._id ? action.payload : tool
          ),
          error: null,
        };
  
      case FETCH_TOOLS_FAILURE:
      case ADD_TOOL_FAILURE:
      case UPDATE_TOOL_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export default toolManagementReducer;