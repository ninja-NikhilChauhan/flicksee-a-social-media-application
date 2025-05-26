import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import fillheart from "../../assets/fillheart.png";
import { Link ,useNavigate} from "react-router-dom";
import opps from '../../assets/oops.png'
import heart from "../../assets/heart1.png";
import send from "../../assets/send.png";
import Navlink from "./navlink";
function Home() {
  const { state, dispatch } = useContext(UserContext);
  const [commentCount, setCommentCount] = useState();
  const [data, setData] = useState([]);
  const [showComments, setShowComments] = useState(false);
const navigate= useNavigate()
  useEffect(() => {
    fetch("/allsubscribedpost", {
      headers: {
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setData(result.post);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const likepost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        console.log(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikepost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        console.log(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makecomment = (text, postId) => {
    fetch("/comments", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("result", result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        console.log("new data", newData);

        setData(newData);
        let count = newData[0].comments.length;
        setCommentCount(count);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Navlink />
      {/* {data && data.map((item) => {
        return (
          <div className="card-container">
            <div className="row">
              <div className="col s12 m7">
                <div className="card">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                   
                    {item.postedby && (
                    

                   
                     <span className="card-title"> <Link to={ state._id ===item.postedby._id ? "/profile": `/profile/${item.postedby._id}`}>{item.postedby.name.toUpperCase()}</Link> </span>
              
                  
                    )}
                    <img
                      alt="threedots"
                      src={threedots}
                      width={"45px"}
                      height={"10px"}
                    />
                  </div>
                  <div className="card-image">
                    <img src={item.photo} height='250px' width='100px' />
                  </div>
                  <div className="card-content post-body">
                
                    <p>{item.body}</p>
                  </div>
                  <div className="card-action">
                    <div style={{ display: "flex", gap: "15px" }}>
                      <div>
                        {item.likes.includes(state._id) ? (
                          <img
                            width={"22px"}
                            height={"24px"}
                            alt="like"
                            onClick={() => unlikepost(item._id)}
                            src={fillheart}
                            style={{  }}
                          />
                        ) : (
                          <img
                            style={{ color: "red" }}
                            width={"22px"}
                            height={"24px"}
                            alt="like"
                            onClick={() => likepost(item._id)}
                            src={heart}
                          />
                        )}
                        <p className="black-text">{item.likes.length} likes</p>
                      </div>
                      <div>
                        <img
                          src="/comments.png"
                          height="24px"
                          width="24px"
                          onClick={() => setShowComments(true)}
                        />
                        <p className="black-text">
                          {item.comments.length} comments
                        </p>
                      </div>
                    </div>
                    {showComments && item.comments.map((record) => {
                      return (
                        <div style={{display:'flex',gap:'5px'}} key={record._id}>
                          <p style={{fontSize:'17px'}}>
                            
                            {record.postedby && record.postedby.name} :{" "}
                            </p>
                            <p style={{fontSize:'15px',marginTop:'3px',color:'grey'}}>

                          {record.text}
                            </p>
                        </div>
                      );
                    })}

                    <div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const comment = e.target[0].value;
                          makecomment(comment, item._id);
                          e.target[0].value = "";
                        }}
                      >
                        <input type="text" placeholder="add a comment" />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })} */}

      <div style={{ marginBottom: "10px" }}>
        {data.length===0? 
        <div style={{display:'flex',flexDirection:'column', justifyContent:'center' , alignItems:'center'}}>
        <img  src={opps} height={300} width={400} />
          <h5 className="showing-nopost-message-followers">Looks like your followers haven't posted anything yet!</h5> 
          
          <p className="explore-text" onClick={()=>navigate('/')} >Explore</p>

        </div> : data &&
          data.map((item) => {
            return (
              <div className="post">
                <div className="post-header">
                  {item.postedby && (
                    <span className="card-title">
                      {" "}
                      <Link
                        to={
                          state._id === item.postedby._id
                            ? "/profile"
                            : `/profile/${item.postedby._id}`
                        }
                      >
                        {item.postedby.name.toUpperCase()}
                      </Link>{" "}
                    </span>
                  )}
                </div>
                <div className="post-photo">
                  <img src={item.photo} />
                </div>
                <div className="post-description">
                  <p>{item.body}</p>
                </div>
                <div className="post-actions">
                  <div>
                    {item.likes.includes(state._id) ? (
                      <img
                        width={"22px"}
                        height={"24px"}
                        alt="like"
                        onClick={() => unlikepost(item._id)}
                        src={fillheart}
                        style={{}}
                      />
                    ) : (
                      <img
                        style={{ color: "red" }}
                        width={"22px"}
                        height={"24px"}
                        alt="like"
                        onClick={() => likepost(item._id)}
                        src={heart}
                      />
                    )}
                    <p style={{ marginTop: "0px" }}>
                      {item.likes.length} likes
                    </p>
                  </div>
                  <div>
                    <img
                      src="/comments.png"
                      height="24px"
                      width="24px"
                      onClick={() => setShowComments(true)}
                    />
                    <p style={{ marginTop: "0px" }}>
                      {item.comments.length} comments
                    </p>
                  </div>
                </div>
                {/* <div className="post-comments">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
              <strong>{username}</strong> {comment}
              </div>
            ))}
          </div> */}
                <div className="post-add-comment">
                  <div>
                    {showComments &&
                      item.comments.map((record) => {
                        return (
                          <div
                            style={{ display: "flex", gap: "5px" }}
                            key={record._id}
                          >
                            <p style={{ fontSize: "17px", margin: "0px 0px" }}>
                              {record.postedby && record.postedby.name}
                            </p>
                            <p
                              style={{
                                fontSize: "15px",
                                color: "grey",
                                margin: "0px 0px",
                              }}
                            >
                              {record.text}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <form style={{display:'flex', alignItems:'center'}}
                      onSubmit={(e) => {
                        e.preventDefault();
                        const comment = e.target[0].value;
                        makecomment(comment, item._id);
                        e.target[0].value = "";
                      }}
                    >
                      <input type="text" placeholder="add a comment" />
                     <button type='submit'>
                       <img
                      
                      src={send}
                      height={20}
                      />
                      </button>
                    </form>
                    
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      
    </>
  );
}

export default Home;


