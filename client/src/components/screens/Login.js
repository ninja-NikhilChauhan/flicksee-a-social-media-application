import React, { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import {UserContext} from '../../App'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {state,dispatch}=useContext(UserContext)
  const navigate = useNavigate();
 
  const postdata = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)||!password) {
      M.toast({ html: "Please enter valid email and password", classes: "#c62828 red darken-3" });
      
      return;
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.token);
        if (data.error) {
          M.toast({ html:data.error, classes: "#c62828 red darken-3" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user",JSON.stringify(data.user))
          dispatch({type:"USER",payload:data.user})
          M.toast({ html:"successfully Signed in", classes: "#43a047 green darken-1" });
          navigate("/");
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
          className="brand-logo"
          style={{ marginBottom: "70px", fontSize: "55px" }}
        >
          Flicksee
        </h2>

        <input
          style={{ marginBottom: "30px" }}
          type="text"
          placeholder="email"
          onChange={(e)=>setEmail(e.target.value)}
        />
        <div style={{display:'flex',flexDirection:'column'}}>

        <input
          style={{ marginBottom: "30px" }}
          type="password"
          placeholder="password"
          onChange={(e)=>setPassword(e.target.value)}
          />
     <Link to='/resetpassword' style={{color:'blue'}}>  <text style={{float:'left',color:'blue'}}> forgot your password?</text></Link>
          </div>
        <button
          style={{ marginBottom: "50px", marginTop: "30px" }}
          onClick={() => postdata()}
          
          className="btn waves-effect waves-light #7b1fa2 purple darken-2"
        >
          login
        </button>
        <p>
          New to <span style={{fontSize:'30px'}}>Flicksee</span>?
          <Link to="/signup" className="link">
            SignUp
          </Link>
        </p>
        
      </div>
    </div>
    
  </>
  );
}

export default Login;
