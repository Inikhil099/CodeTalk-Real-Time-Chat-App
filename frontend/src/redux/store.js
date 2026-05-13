import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from './slices/authSlice'
import chatSlide from './slices/chatSlice'

export const store = configureStore({
  reducer: {
    Auth:AuthReducer,
    chat:chatSlide
  },
})