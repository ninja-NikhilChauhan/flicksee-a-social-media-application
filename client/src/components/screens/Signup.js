import React,{useState} from "react";
import { Link,useNavigate} from "react-router-dom";
import M from 'materialize-css'


function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [username, setuserName] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const postdata=()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
      return
    }
    fetch('/signup',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        email,
        password,
        username
      })
    }).then(res =>res.json()).then(data=>{
      if(data.error){
        M.toast({html: data.error,classes:"#c62828 red darken-3"})
      }else{  
        M.toast({html: data.message,classes:"#43a047 green darken-1"})
      navigate('/login')
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2
          className="brand-logo"
          style={{ marginBottom: "70px" }}
        >
        <span>Flicksee</span> 
        </h2>
        <input
          style={{ marginBottom: "30px" }}
          type="text"
          placeholder="name (e.g-John Doe)"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={{ marginBottom: "30px" }}
          type="text"
          placeholder="username (e.g-johndoe001)"
          onChange={(e) => setuserName(e.target.value)}
        />
        <input
          style={{ marginBottom: "30px" }}
          type="text"
          placeholder="email (e.g-john@duo.com)"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={{ marginBottom: "30px" }}
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          style={{  marginTop: "30px" }}
          className="btn waves-effect waves-light #7b1fa2 purple darken-2"
        onClick={()=>postdata()}
        >
          Signup
        </button>
    <p>Already have an account?<Link to='/login' className="link" style={{color:"blue"}}>Login</Link></p>
      </div>
    </div>
  );
}

export default Signup;
