import React, { useState,useContext } from "react";
import { Link, useNavigate ,useParams} from "react-router-dom";
import M from "materialize-css";


function NewPassword() {

  const [password, setPassword] = useState("");
 
  const navigate = useNavigate();
 const {token}= useParams()
 console.log(token)
  const postdata = () => {

    fetch("/newpassword", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      token,
        password,
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
        <h4
          
          style={{ marginBottom: "70px", fontSize: "40px" }}
        >
          New Password
        </h4>


        <input
          style={{ marginBottom: "30px" }}
          type="password"
          placeholder="New password"
          onChange={(e)=>setPassword(e.target.value)}
          />
        <button
          style={{ marginBottom: "50px", marginTop: "30px" }}
          onClick={() => postdata()}
          
          className="btn waves-effect waves-light #7b1fa2 purple darken-2"
          >
         update password
        </button>
            </div>
        
      </div>
    
    
  </>
  );
}

export default NewPassword;
