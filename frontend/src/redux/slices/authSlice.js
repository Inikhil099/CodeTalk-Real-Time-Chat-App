import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  uservalue:undefined
}

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   setUserInfo:(state,action)=>{
    state.uservalue = action.payload
   }
  },
})

export const {setUserInfo} = AuthSlice.actions

export default AuthSlice.reducer

