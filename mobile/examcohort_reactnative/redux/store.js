import { configureStore } from '@reduxjs/toolkit'
import currentUserReducer from '../features/currentUserSlice'

let store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
  }
})

export default store