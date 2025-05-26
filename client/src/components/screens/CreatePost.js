import React, { useState , useEffect} from "react";
import {  useNavigate } from "react-router-dom";
import M from "materialize-css";


function CreatePost(){
  const [title, setTitle] = useState("");
  const [body, setbody] = useState("");
  const [image, setImage] = useState("");
  const [url,setUrl] = useState("")
  const [loader,setloader] = useState(false)
  const navigate = useNavigate();

  useEffect(()=>{
if(url)
  {
    fetch('/createpost',{
      method:"post",
      headers:{
          "Content-Type":"application/json",
          "Authorization":"bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          title,
          body,
          pic:url
        })
      }).then(res =>
        {
          return res.json()}).then(data=>{
        if(data.error){
          setloader(false)
          M.toast({html: data.error,classes:"#c62828 red darken-3"})
        }else{  
          M.toast({html:"saved successfully",classes:"#43a047 green darken-1"})
          navigate('/')
          setloader(false)
        }
      }).catch(err=>{
        console.log(err)
      })}
    },[url])
  const postdata = () => {
    setloader(true)
    if(!image || !title || !body){
M.toast({html: "Please add all the fields",classes:"#c62828 red darken-3"})
setloader(false)
  }else{
    const data= new FormData()
      data.append('file',image)
      data.append('upload_preset',"flicksee")
    data.append('cloud_name',"dpsvrdlmt")
    fetch('https://api.cloudinary.com/v1_1/dpsvrdlmt/image/upload',{
      method:"post",
      body:data
      
    }).then(res=>res.json()).then(data=>{
      setUrl(data.url)
      
    }).catch(err=>{
      console.log(err);
    })
  }

}
  

  return (
    <>
      <div className="mycard">
        <div className="card auth-card input-field">
          <h2 style={{ marginBottom: "70px", fontSize: "40px" }}>
            Create a Post
          </h2>
          <input
            className="title-createpost"
            type="text"
            placeholder="Please Give the Title "
            onChange={(e) => setTitle(e.target.value)}
            />

          <textarea
            rows="8"
            className="textarea-createpost"
          
            type="text"
            value={body}
            placeholder="Tell others about your post."
            onChange={(e) => setbody(e.target.value)}
          />
          <div className="file-field input-field" style={{ display: "flex" }}>
            <div className="button">
              upload your post image
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              
             
              <input 
              

               className="file-path validate" type="text" />
            </div>
          </div>
          <button
            style={{ marginBottom: "50px", marginTop: "20px",paading:'0px 15px' , color:'white' }}
            className="btn waves-effect waves-light #7b1fa2 purple darken-2"
            onClick={() => postdata()}
            >
              {
              loader ?  <div class="preloader-wrapper small active">
              <div class="spinner-layer spinner-black-only">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div><div class="gap-patch">
                  <div class="circle"></div>
                </div><div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
            </div>:"Post"

              }
          </button>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
