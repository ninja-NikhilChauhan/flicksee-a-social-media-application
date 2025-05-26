import React,{useState} from "react";
import { Link,useNavigate} from "react-router-dom";
import M from 'materialize-css'


function Channel() {
  const [name, setName] = useState("");
  const [description, setdescription] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const postdata=()=>{
    fetch('/signup',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        description,
        
      })
    }).then(res =>res.json()).then(data=>{
      if(data.error){
        M.toast({html: data.error,classes:"#c62828 red darken-3"})
      }else{  
        M.toast({html: data.message,classes:"#43a047 green darken-1"})
      navigate('/home')
      }
    })
  }
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2
         style={{ marginBottom: "70px", fontSize: "40px" }}
        >
         Create a Channel
        </h2>
        <input
          style={{ marginBottom: "30px" }}
          type="text"
          placeholder="Please Give the Name of the Channel"

          onChange={(e) => setName(e.target.value)}
        />
        
        <textarea 
        rows="8"
          style={{ marginBottom: "30px",minWidth:"363px",maxWidth:"363px",minHeight:"200px",maxHeight:"200px" }}
          type="text"
          placeholder="Give the Description about your Channel"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          style={{ marginBottom: "50px", marginTop: "30px" }}
          className="btn waves-effect waves-light #7b1fa2 purple darken-2"
        onClick={()=>postdata()}
        >
          create
        </button>
    {/* <p>already have an account?<Link to='/login' className="link" style={{color:"blue"}}>Login</Link></p> */}
      </div>
    </div>
  );
}

export default Channel;
