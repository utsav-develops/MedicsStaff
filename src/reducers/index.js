import { combineReducers } from 'redux';
import ChangeLocationReducer from './ChangeLocationReducer.js';
import BookingReducer from './BookingReducer.js';
import RegisterReducer from './RegisterReducer.js';
import SpecialityReducer from './SpecialityReducer.js';
import PaymentReducer from './PaymentReducer.js';

const allReducers = combineReducers({
  change_location:ChangeLocationReducer,
  booking:BookingReducer,
  register:RegisterReducer,
  speciality:SpecialityReducer,
  payment:PaymentReducer,
});

export default allReducers;