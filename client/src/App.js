import React, { useEffect,useContext, createContext, useReducer } from "react";
import Navbar from "./components/Navbar";
import "./App.css";

import { BrowserRouter, Route, Routes} from "react-router-dom";
import { useNavigate,useLocation } from "react-router-dom";
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import {reducer,initialState} from './reducers/userReducers'

import UserProfile from "./components/screens/userprofile";

import Modals from "./components/screens/modal";
import Navlink from "./components/screens/navlink";
import MyFollowingPost from "./components/screens/myfollowingpost";
import Resetpassword from "./components/screens/resetpassword";
import NewPassword from "./components/screens/newpassword";
export const UserContext = createContext();

const Routing = () => {
  const navigate=useNavigate()
  const location = useLocation()
  const {state,dispatch} =useContext(UserContext)
  // useEffect(()=>{
  //   const user=JSON.parse(localStorage.getItem("user"))
  //   if(user){
  //     dispatch({type:"USER",payload:user})
     
  //   }else{
  //     if(!location.pathname.startsWith('/resetpassword'))
  //     navigate('/login')
  //   }
  // },[])
  // "framer-motion": "^11.0.25",
 
  return(

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route exact  path="/Profile" element={<Profile />} />
      <Route path="/createpost" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/modal" element={<Modals />} />
      <Route path="/myfollowerpost" element={<MyFollowingPost />} />
      <Route  exact path="/resetpassword" element={<Resetpassword />} />
      <Route path="/resetpassword/:token" element={<NewPassword />} />
   
    </Routes>
  
  )
};

function App() {
 const [state,dispatch] =useReducer(reducer,initialState) 
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
   

      <Navbar />
      
      <Routing/>

    </BrowserRouter>
</UserContext.Provider>
  );
}

export default App;
