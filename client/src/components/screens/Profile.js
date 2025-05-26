import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import profileimage from "../../assets/profile.png";
import del from '../../assets/delete.png';
import M from "materialize-css";

import edit from '../../assets/edit.png' ;

function Profile() {
  const [pics, setPics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  const [loader,setloader] = useState(false)
const [Edit , setEdit]=useState(false)
  const [url, setUrl] = useState(undefined);
const navigate = useNavigate()
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log('Network response was not ok');
        }
        return res.json();
      })
      .then((result) => {
        setPics(result.mypost);
     
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    if (url) {
      fetch('/setimage', {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          pic: url
        })
      }).then(res => {
        return res.json();
      }).then(data => {
        if (data.error) {
          setloader(false)
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({ html: "Saved successfully", classes: "#43a047 green darken-1" });
          setloader(false)
          dispatch({ type: "PICUPDATE", payload: { pic: data.pic } });
          localStorage.setItem("user", JSON.stringify(data));
        setShowModal(false)
        }
      }).catch(err => {
        console.log("Error saving image in local storage:", err);
      });
    }
  }, [url]);

  const uploadImage = () => {
    setloader(true  )
    if(!image){
      M.toast({html: "Please provide a profile image ",classes:"#c62828 red darken-3"})
      setloader(false)
        }
    else{
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', "flicksee");
      data.append('cloud_name', "dpsvrdlmt");

      fetch('https://api.cloudinary.com/v1_1/dpsvrdlmt/image/upload', {
        method: "post",
        body: data
      }).then(res => {
          return res.json();
      }).then(data => {
        setUrl(data.url);
      }).catch(err => {
        console.log("Error uploading image on cloudnary:", err);
      });
    }
  }

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };
  const deletepost=(id)=>{

     fetch(`/deletepost/${id}`,{
                method:"delete",
                headers:{
                    Authorization:"bearer "+localStorage.getItem("jwt")
                }
            }).then(res=>res.json()).then(data=>{
           
              M.toast({ html: "Successfully deleted", classes: "#43a047 green darken-1" });
              setPics(data.posts);
              // const newData = data.filter(item=>{
                  // return item._id !== result._id
              // })
              // setData(newData)
            }).catch(err=>{
                console.log(err)
            })
  }

  return (
    <>
      {state && pics ? (
        <div style={{ maxWidth: "600px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "20px 0",
              gap: "28px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                alt="profile photo"
                className="profile-photo"
                onClick={handleModalOpen}
                src={state ? state.pic : 'loading'}
                
                
              />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div>

                <h4 style={{fontWeight:'bolder'}}>{state ? state.name.toUpperCase() : "loading..."}</h4>
                <h6  style={{color:'grey'}}>{state?'@ '+ state.username: "loading..."}</h6>

                </div>
               
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                }}
              >
                <h6>{pics.length} posts</h6>
                <h6>
                  {state.followers ? state.followers.length : "0"} followers
                </h6>
                <h6>
                  {state.following ? state.following.length : "0"} following
                </h6>
              </div>
            </div>
          </div>
          <div >
           
            <div style={{display:'flex',justifyContent:'flex-end',gap:'20px',marginRight:'20px',marginBottom:'10px'}}>
              <text className="create-view-profile" onClick={()=>navigate('/createpost')}> + create post </text>
              {pics.length !== 0 ?<img src={edit} height={'20px'} onClick={()=>setEdit(true)}width={'20xp'}/> :null}
            </div>
            <div className="Gallery">

            
            {pics && pics.length !== 0 ? (
              pics && 
              pics.map((item) => (
                <div className="profile-post-photo" key={item._id}>
                  <div className="image-wrapper">
                  <img
                    className="item"
                    alt={item.title}
                    src={item.photo}
                    height="210px"
                    width="250px"
                  />
                  { Edit ?<img className="delete-icon" onClick={()=>deletepost(item._id)} src={del} height={20}/> :null}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h2 style={{ marginBottom: "0px", textAlign: "center" }}>
                  Share Photos
                </h2>
                <h5 className="profile-share-photo-text">
                  When you share photos, they will appear on your profile.
                </h5>
                <Link to="/createpost" className="share-photo-link">
                  Share your first photo
                </Link>
              </div>
            )}
            </div>
          </div>
        </div>
      ) : (
        <h3>Loading...</h3>
      )}
      <Modal show={showModal} handleClose={handleModalClose}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5 style={{ float: "left",flex:'1', marginTop: "20px" }}>
              Upload a new profile image
            </h5>
            <p
              onClick={handleModalClose}
              style={{ fontSize: "25px", margin: "1px 4px" , cursor:'pointer' }}
            >
              ✕
            </p>
          </div>

          <div className="file-field input-field" style={{ display: "flex" }}>
            <div className="button">
              upload  profile image
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
          
          <button className="upload-btn" onClick={uploadImage}>{
             
             loader ?  
             <div class="preloader-wrapper small active custom-spinner">
             <div class="spinner-layer spinner-green-only">
               <div class="circle-clipper left">
                 <div class="circle"></div>
               </div><div class="gap-patch">
                 <div class="circle"></div>
               </div><div class="circle-clipper right">
                 <div class="circle"></div>
               </div>
             </div>
           </div>:"upload"

             
         }</button>
        </div>
      </Modal>
    </>
  );
}

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">{children}</section>
    </div>
  );
};

export default Profile;
