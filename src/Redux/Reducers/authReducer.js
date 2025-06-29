const initialState={
    isAuthenticated: false,
    token: null,
    userData: null,
    loading: false
    // error: null
}

const authReducer=(state= initialState, action)=>{
    switch(action.type){
        // case 'LOGIN_REQUEST':
        //     return {...state, loading: true};
        case 'LOGIN_SUCCESS':
            return {...state, token: action.payload.token, userData: action.payload.userData, isAuthenticated: true, loading: false};
        case 'LOGOUT':
            return {...state, token: null, userData: null, isAuthenticated: false};
        // case 'UPDATE_USER':
        //     return { ...state, userData: { ...state.userData, ...action.payload }};
        // case 'LOGIN_FAILURE':
        //     return {...state, loading: false};
        // case 'LOGOUT':
        //     return {...state, token: null, userData: null, isAuthenticated: false}
        default:
            return state;
    }
}

export default authReducer;