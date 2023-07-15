// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import formSlice  from './reducers';

const store = configureStore({
  reducer: {
    form: formSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
