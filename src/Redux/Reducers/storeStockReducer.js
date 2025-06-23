const initialState={
    storeStockArr: [],
    storeStockloading: false,
    storeStockerror: null
}

export const storeStockReducer=(state= initialState, action)=>{
    switch(action.type){
        case "FETCH_STORE_STOCK_REQUEST":
            return {...state, storeStockloading: true, storeStockerror: null};
        case "FETCH_STORE_STOCK_SUCCESS":
            return {...state, storeStockArr: action.payload, storeStockloading: false, storeStockerror: null};
        case "FETCH_STORE_STOCK_FAILURE":
            return {...state, storeStockloading: false, storeStockerror: action.payload};
        case "ADD_STORE_STOCK_REQUEST":
            return {...state, storeStockloading: true, storeStockerror: null};
        case "ADD_STORE_STOCK_SUCCESS":
            return {...state, storeStockArr: [...state.storeStockArr, action.payload], storeStockloading: false, storeStockerror: null};
        case "ADD_STORE_STOCK_FAILURE":
            return {...state, storeStockloading: false, storeStockerror: action.payload};
        case "UPDATE_STORE_STOCK_REQUEST":
            return {...state, storeStockloading: true, storeStockerror: null};
        case "UPDATE_STORE_STOCK_SUCCESS":
            return {
                ...state,
                storeStockArr: state.storeStockArr.map(item =>
                  item._id === action.payload._id ? action.payload : item
                ),
                storeStockloading: false,
                storeStockerror: null
            };
        case "UPDATE_STORE_STOCK_FAILURE":
            return {...state, storeStockloading: false, storeStockerror: action.payload};
        default:
            return state;
    }
}