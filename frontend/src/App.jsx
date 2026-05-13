import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import AuthPage from "./pages/auth/AuthPage"
import Profile from './pages/profile/Profile'
import ChatPage from './pages/chat/ChatPage'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import axios from 'axios'
import { setUserInfo } from './redux/slices/authSlice'
import { backend_url } from './assets/constants'

const PrivateRoute = ({children})=>{
  const user = useSelector((state)=> state.Auth.uservalue)
  const isAuthenticated =  !!user
  return isAuthenticated ? children : <Navigate to={"/auth"}/>
}

const AuthRoute = ({children})=>{
  const user = useSelector((state)=> state.Auth.uservalue)
  const isAuthenticated =  !!user
  return isAuthenticated ? <Navigate to={"/chat"}/> : children
}


function App() {
  const user = useSelector((state)=> state.Auth.uservalue)
  const dispatch = useDispatch()
  const [loading, setloading] = useState(true)
  const getUserData = async()=>{
      try {
        const res = await backend_url.get(`/user/userinfo`)
        if(res.status == 200 && res.data.id){
          dispatch(setUserInfo(res.data))
        }

      } catch (error) {
        dispatch(setUserInfo(undefined))
      } finally{
        setloading(false)
      }

    }
  useEffect(() => {
    if (!user) {
      getUserData()
    }

    else{
      setloading(false)
    }


  }, [user,setUserInfo])
  
  if(loading){
    return <div>Loading...</div>
  }

  return (
    <>
    <BrowserRouter>
     <Routes>
      <Route path='/*' element={<Navigate to={"/auth"}/>}/>
      <Route path='/auth' element={<AuthRoute> <AuthPage/></AuthRoute>}/>
      <Route path='/chat' element={<PrivateRoute><ChatPage/></PrivateRoute>}/>
      <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>}/>
     </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;
