import { ADD_FG_STOCK, EDIT_FG_STOCK, GET_FG_STOCK } from "../Actions/fgStockActions"

const initialState={
    fgStockArr: [],
    loading: false,
    error: null
}

export const fgStockReducer=(state= initialState, action)=>{
    switch(action.type){
        case GET_FG_STOCK:
            return {...state, fgStockArr: action.payload}
        case ADD_FG_STOCK:
            return {...state, fgStockArr: [...state.fgStockArr, action.payload]};
        case EDIT_FG_STOCK:
            return {
                ...state,
                fgStockArr: state.fgStockArr.map(item =>
                  item._id === action.payload._id ? action.payload : item
                ),
              };
        default:
            return state;
    }
}