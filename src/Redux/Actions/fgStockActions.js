import axios from "axios";

export const GET_FG_STOCK= 'GET_FG_STOCK';
export const ADD_FG_STOCK= 'ADD_FG_STOCK';
export const EDIT_FG_STOCK= 'EDIT_FG_STOCK';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;



export const getAllFgStock=(date)=> async(dispatch, getState)=>{
    const [year, month, day] = date.split("-");
    try {
        const token = getState().auth.token;

        const response = await axios.get(
            `${BACKEND_API}/get_daily_dispatch_stock_monitoring_sheets/${year}/${month}/${day}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          dispatch({type: GET_FG_STOCK, payload: response.data})
          console.log(response.data)
    } catch (error) {
        console.log(error)
    }
} 

export const addFgStock=({data, onSuccess})=> async(dispatch, getState)=>{
    const token= getState().auth.token;
    try {
        const response= await axios.post(`${BACKEND_API}/submit_dispatch_stock_monitoring_sheet_entry`, data,
            {
              headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            }
          );
          dispatch({type: ADD_FG_STOCK, payload: {_id: response.data.id, ...data}})
          // alert('Item Added Successfull')
          if (onSuccess) onSuccess(); // clear form or close modal
          // console.log(response.data)
    } catch (error) {
        console.log(error)
    }
}

export const editFgStock=(edit)=> async(dispatch, getState)=>{
  const token= getState().auth.token;
    try {
      const response = await axios.put(
        `${BACKEND_API}/update_dispatch_stock_monitoring_sheet_entry/${edit._id}`,
        edit,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({type: EDIT_FG_STOCK, payload: edit})
      console.log(response)
    } catch (error) {
      console.log(error)
    }
}