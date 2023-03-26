import { configureStore } from '@reduxjs/toolkit';
import cardReducer from '../features/counter/cardSlice'
export const store = configureStore({
  reducer: {
    card: cardReducer,
  },
});
