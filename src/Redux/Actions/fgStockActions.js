import axios from 'axios';
import { max, min } from 'date-fns';

export const GET_FG_STOCK = 'GET_FG_STOCK';
export const ADD_FG_STOCK = 'ADD_FG_STOCK';
export const EDIT_FG_STOCK = 'EDIT_FG_STOCK';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

export const getAllFgStock = (date, setMessage) => async (dispatch, getState) => {
  const [year, month, day] = date.split('-');
  try {
    const token = getState().auth.token;

    const response = await axios.get(
      `${BACKEND_API}/get_daily_Fg_stock_monitoring_sheets/${year}/${month}/${day}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: GET_FG_STOCK, payload: response.data.entries });
    console.log(response.data.message);
    if (
      response.data.message ==
      'No monthly config found for 2025-08. Please submit monthly data first.'
    ) {
      setMessage('No monthly config found for this date. Please submit monthly data first.');
    }
  } catch (error) {
    console.log(error);
  }
};

export const addFgStock = (data, onSuccess, onError) => async (dispatch, getState) => {
  const token = getState().auth.token;
  try {
    const response = await axios.post(
      `${BACKEND_API}/submit_Fg_stock_monitoring_sheet_entry`,
      data,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    dispatch({ type: ADD_FG_STOCK, payload: { _id: response.data.id, ...data } });
    // alert('Item Added Successfull')
    if (onSuccess) onSuccess(response?.data?.message || 'Fg Stock Added Successfully'); // clear form or close modal
    // console.log(response.data)
  } catch (error) {
    if (onError) onError(error?.response?.data?.detail || 'Failed to add Fg Stock');
    console.log(error);
  }
};

export const editFgStock = (edit, date, onSuccess, onError) => async (dispatch, getState) => {
  const token = getState().auth.token;
  const [selectedYear, selectedMonth, selectedDay] = date.split('-');

  try {
    const allowedFields = {
      item_description: edit.item_description,
      item_code: edit.item_code,
      minimum: edit.minimum,
      current: edit.current,
      dispatched: edit.dispatched,
      balance:
        edit.schedule && edit.dispatched
          ? Number(edit.schedule) - Number(edit.dispatched)
          : undefined,
      next_action: edit.next_action,
      todays_planning: edit.todays_planning,
      resp_person: edit.resp_person,
      timestamp: edit.timestamp,
      _id: edit._id,
      maximum: edit.maximum,
      schedule: edit.schedule,
    };

    const response = await axios.put(
      `${BACKEND_API}/update_Fg_stock_monitoring_sheet_entry/${edit._id}`,
      allowedFields,
      {
        params: {
          year: selectedYear,
          month: selectedMonth,
          date: selectedDay,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update in Redux
    dispatch({ type: EDIT_FG_STOCK, payload: allowedFields });

    // Call success callback
    if (onSuccess) onSuccess(response?.data?.message || 'Fg Stock Updated Successfully');

    // 🔄 Immediately refresh stock list after update
    await dispatch(getAllFgStock(date, () => {}));
  } catch (error) {
    if (onError) onError(error?.response?.data?.message || 'Failed to update Fg Stock');
    console.log(error);
  }
};
