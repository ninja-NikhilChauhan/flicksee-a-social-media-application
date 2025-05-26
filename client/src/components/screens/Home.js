import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import fillheart from "../../assets/fillheart.png";
import { Link } from "react-router-dom";
import threedots from "../../assets/threedots.png";
import heart from "../../assets/heart1.png";
import send from "../../assets/send.png";
import Navlink from "./navlink";


function Home() {
  const { state, dispatch } = useContext(UserContext);
  const [commentCount, setCommentCount] = useState();
  const [data, setData] = useState([]);
  const [visibleCommentsPostId, setVisibleCommentsPostId] = useState(null);

  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
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

  const handleShowComments = (id) => {
    if (visibleCommentsPostId === id) {
      setVisibleCommentsPostId(null); // Hide comments if already visible
    } else {
      setVisibleCommentsPostId(id); // Show comments for the selected post
    }
  };

  return (
    <>
      <div>
        <Navlink />
      </div>

      <div
        style={{
          marginBottom: "10px",
          flex: "2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {data &&
          data.map((item) => {
            return (
              <div className="post" key={item._id}>
                <div className="post-header">
                  <img  src={item.postedby.pic} height={34} width={35} style={{borderRadius:"50px"}}/>
                  {item.postedby && (
                    <span className="card-title">
                      <Link
                        to={
                          state._id === item.postedby._id
                            ? "/profile"
                            : `/profile/${item.postedby._id}`
                        }
                      >
                        {item.postedby.name.toUpperCase()}
                      </Link>
                    </span>
                  )}
                </div>
                <div className="post-photo">
                  <img src={item.photo} alt="post" />
                </div>
                <div className="post-description">
                  <p style={{fontWeight:'550'}}>  <text className="post-description-usernametext"  >{"@"+item.postedby.username}</text> "{item.body}"</p>
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
                    <p style={{ marginTop: "0px" }}>{item.likes.length} likes</p>
                  </div>
                  <div>
                    <img
                      src="/comments.png"
                      height="24px"
                      width="24px"
                      onClick={() => handleShowComments(item._id)}
                      alt="comments"
                    />
                    <p style={{ marginTop: "0px" }}>
                      {item.comments.length} comments
                    </p>
                  </div>
                </div>
                <div className="post-add-comment">
                  <div>
                    {visibleCommentsPostId === item._id &&
                      item.comments.map((record) => {
                        return (
                          <div
                            style={{ display: "flex", gap: "5px" }}
                            key={record._id}
                          >
                            <p style={{ fontSize: "17px", margin: "0px 0px" }}>
                              {record.postedby && record.postedby.name} :{" "}
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
                      padding: "5px",
                    }}
                  >
                    <form
                      style={{ display: "flex", alignItems: "center" }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        const comment = e.target[0].value;
                        makecomment(comment, item._id);
                        e.target[0].value = "";
                      }}
                    >
                      <input type="text" placeholder="add a comment" />
                      <button type="submit">
                        <img src={send} height={20} alt="send" />
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
