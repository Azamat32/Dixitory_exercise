// redux/actions.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormEntity } from '../types';

interface FormState {
  formData: FormEntity[];
}

const initialState: FormState = {
  formData: [],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addFormData: (state, action: PayloadAction<FormEntity>) => {
      state.formData.push(action.payload);
    },
    removeFormData: (state, action: PayloadAction<number>) => {
      state.formData.splice(action.payload, 1);
    },
    editFormData: (state, action: PayloadAction<{ index: number; updatedData: FormEntity }>) => {
      const { index, updatedData } = action.payload;
      state.formData[index] = updatedData;
    },
  },
});

export const { addFormData, removeFormData, editFormData } = formSlice.actions;

export default formSlice.reducer;
