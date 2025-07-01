const initialState={
    complaints: [],
    complaintsLoading: false, 
    complaintError: null,
}

export const complaintReducer=(state= initialState, action)=>{
    switch(action.type){
        case "FETCH_COMPLAINTS_REQUEST":
            return {...state, complaintsLoading: true, complaintError: null};
        case "FETCH_COMPLAINTS_SUCCESS":
            return {...state, complaints: action.payload, complaintsLoading: false, complaintError: null};
        case "FETCH_COMPLAINTS_FAILURE":
            return {...state, complaintsLoading: false, complaintError: action.payload};
        case "ADD_COMPLAINT_REQUEST":
            return {...state, complaintsLoading: true, complaintError: null};
        case "ADD_COMPLAINT_SUCCESS":
            return {...state, complaints: [...state.complaints, action.payload], complaintsLoading: false, complaintError: null};
        case "ADD_COMPLAINT_FAILURE":
            return {...state, complaintsLoading: false, complaintError: action.payload};
        case "UPDATE_COMPLAINT_REQUEST":
            return {...state, complaintsLoading: true, complaintError: null};
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
            return {...state, complaintsLoading: false, complaintError: action.payload};
        
        // case GET_FG_STOCK:
        //     return {...state, fgStockArr: action.payload}
        // case ADD_FG_STOCK:
        //     return {...state, fgStockArr: [...state.fgStockArr, action.payload]};
        // case EDIT_FG_STOCK:
        //     return {
        //         ...state,
        //         fgStockArr: state.fgStockArr.map(item =>
        //           item._id === action.payload._id ? action.payload : item
        //         ),
        //       };
        default:
            return state;
    }
}