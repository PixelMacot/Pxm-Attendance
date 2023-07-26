import { createSlice } from '@reduxjs/toolkit'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const { login } =  userSlice.actions

export default userSlice.reducer