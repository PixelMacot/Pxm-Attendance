import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import usersReducer from '../features/users/userSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    users:usersReducer
  },
})