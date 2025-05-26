import React, { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import {UserContext} from '../../App'

function Resetpassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {state,dispatch}=useContext(UserContext)
  const navigate = useNavigate();
 
  const postdata = () => {
    
    fetch("/resetpassword", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
       
      }),
    })
      .then((res) => res.json())
      .then((data) => {
       
        if (data.error) {
          M.toast({ html:data.error, classes: "#c62828 red darken-3" });
        } else {
          
          M.toast({ html:data.message, classes: "#43a047 green darken-1" });
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
    <div  className="mycard">
      <div className="card auth-card input-field">
      <h2
          
          style={{ marginBottom: "70px", fontSize: "40px" }}
        >
          reset password
        </h2>
<div style={{display:'flex',flexDirection:'column'}}>

        <input
          style={{ marginBottom: "30px" }}
          type="text"
          placeholder="Enter your email"
          onChange={(e)=>setEmail(e.target.value)}
          />


          </div>
       
        <button
          style={{ marginBottom: "50px", marginTop: "30px" }}
          onClick={() => postdata()}
          
          className="btn waves-effect waves-light #7b1fa2 purple darken-2"
        >
          reset password
        </button>
       
        
      </div>
    </div>
    
  </>
  );
}

export default Resetpassword;
