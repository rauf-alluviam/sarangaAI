import {GET_CAMERAS, ADD_CAMERA_REQUEST, ADD_CAMERA_SUCCESS, ADD_CAMERA_FAILURE, REMOVE_CAMERA_SUCCESS} from '../Actions/cameraAction';

const initialState={
    cameras: {},
    loading: false,
    error: null
}

export const cameraReducer=(state= initialState, action)=>{
    switch(action.type){
        case GET_CAMERAS:
            return {...state, cameras: action.payload};
        case ADD_CAMERA_REQUEST:
            return {...state, loading: false, error: null};
        // case ADD_CAMERA_SUCCESS:
        //     return {cameras: [...state.cameras, action.payload], loading: true};
        case ADD_CAMERA_SUCCESS: {
            const { category, ...cameraData } = action.payload;
      
            return {
              ...state,
              loading: false,
              cameras: {
                ...state.cameras,
                [category]: [
                  ...(state.cameras[category] || []), // existing cameras in that category
                  cameraData // new camera without category key (or you can keep if needed)
                ]
              }
            };
          }
          case REMOVE_CAMERA_SUCCESS: {
            const { cameraId, category } = action.payload;
          
            return {
              ...state,
              loading: false,
              cameras: {
                ...state.cameras , [category]: state.cameras[category].filter(camera => camera.camera_id !== cameraId)
              }
            };
          }
        default:
            return state;
    }
}

export default cameraReducer;