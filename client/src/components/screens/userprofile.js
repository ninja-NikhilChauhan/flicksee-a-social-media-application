import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../../App";
import profileimage from "../../assets/profile.png";

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((result) => {
        setUserProfile(result);
        console.log("result", result);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);
  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
       
        console.log(data)
   dispatch({ type:"UPDATE", payload: { following: data.following, followers: data.followers } });
   localStorage.setItem("user",JSON.stringify(data))
   setUserProfile((prevstate)=>{
    return{
      ...prevstate
      ,
      user:{
        ...prevstate.user,
          followers:[...prevstate.user.followers,data._id]
        
      }
    }
   })
      });
  };
  const unfollowUser = ()=>{
    fetch('/unfollow',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"bearer "+localStorage.getItem('jwt')
        },
        body:JSON.stringify({
            unfollowId:userid
        })
    }).then(res=>res.json())
    .then(data=>{
        
        dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
         localStorage.setItem("user",JSON.stringify(data))
        
         setUserProfile((prevState)=>{
            const newFollower = prevState.user.followers.filter(item=>item != data._id )
             return {
                 ...prevState,
                 user:{
                     ...prevState.user,
                     followers:newFollower
                    }
             }
         })
       
         
    })
}

  // const unfollowUser = (userId) => {
  //   fetch(`/unfollow/${userId}`, { // Potentially use DELETE method based on API
  //     method: "put", // Adjust based on API documentation
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "bearer " + localStorage.getItem("jwt"),
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
  //       localStorage.setItem("user", JSON.stringify(data));
  //       setUserProfile((prevState) => ({
  //         ...prevState,
  //         user: {
  //           ...prevState.user,
  //           followers: prevState.user.followers.filter((id) => id !== userId),
  //         },
  //       }));
  //     });
  // };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "600px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "20px 0",
              gap: "5px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                alt="profile photo"
                src={userProfile.user.pic}
                height="165px"
                width="165px"
                className="profile-photo"
              />
            </div>

            <div>
              <div
                style={{
                  
                  gap: "50px",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <h4>{userProfile.user.name} </h4>
               
                 {userProfile.user.followers &&  !userProfile.user.followers.includes(state._id)?<text onClick={followUser} style={{color:'blue',padding:'3px 6px',border:'1px solid blue',fontWeight:'500',marginTop:'1px' , borderRadius:'30px',cursor:'pointer'}}>  follow</text> :
                 <div style={{display:'flex' ,justifyContent:"flex-start",gap:'10px' , }}>
                   <text style={{color:'green' , fontSize:'20px'}}> • following</text>
                   <text onClick={unfollowUser} style={{color:'blue' ,padding:'2px 5px',border:'1px solid blue',fontWeight:'500',marginTop:'1px' , borderRadius:'30px' ,cursor:'pointer'}}>  unfollow</text>
                  </div>
}
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                  gap:'5px'
                }}
              >
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user ? userProfile.user.followers.length :null} follower</h6>
                <h6> {userProfile.user.following.length} following</h6>
              </div>
            </div>
          </div>
          <div className="Gallery">
            {userProfile.posts.length === 0 ? (
              <h3>No Posts Yet!</h3>
            ) : (
              userProfile.posts.map((item) => {
                return (
                  <img
                    key={item._id}
                    src={item.photo}
                    alt={item.title}
                    height="210px"
                    width="250px"
                    className="item"
                  />
                );
              })
            )}
          </div>
        </div>
      ) : (
        <h4 style={{ textAlign: "center" }}>loading...</h4>
      )}
    </>
  );
}

export default UserProfile;
