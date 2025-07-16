const initialState = {
  complaints: [],
  complaintsLoading: false,
  complaintError: null,
};

const complaintReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_COMPLAINTS_REQUEST":
      return { ...state, complaintsLoading: true, complaintError: null };
    case "FETCH_COMPLAINTS_SUCCESS":
      return { ...state, complaints: action.payload, complaintsLoading: false, complaintError: null };
    case "FETCH_COMPLAINTS_FAILURE":
      return { ...state, complaintsLoading: false, complaintError: action.payload };
    case "ADD_COMPLAINT_REQUEST":
      return { ...state, complaintsLoading: true, complaintError: null };
    case "ADD_COMPLAINT_SUCCESS":
      return { ...state, complaints: [...state.complaints, action.payload], complaintsLoading: false, complaintError: null };
    case "ADD_COMPLAINT_FAILURE":
      return { ...state, complaintsLoading: false, complaintError: action.payload };
    case "UPDATE_COMPLAINT_REQUEST":
      return { ...state, complaintsLoading: true, complaintError: null };
    case "UPDATE_COMPLAINT_SUCCESS":
      return {
        ...state,
        complaints: state.complaints.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
        complaintsLoading: false,
        complaintError: null
      };
    case "UPDATE_COMPLAINT_FAILURE":
      return { ...state, complaintsLoading: false, complaintError: action.payload };
    // ...existing code...
    default:
      return state;
  }
};

export default complaintReducer;