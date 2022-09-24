import { createSlice } from '@reduxjs/toolkit'

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState : {
    value: null
  },
  reducers: {
    login: (state, action) => {
      state.value = action.payload
    },
    logout: (state) => {
      state.value = null
    },  
  },
})

export const { login, logout } = currentUserSlice.actions
export default currentUserSlice.reducer