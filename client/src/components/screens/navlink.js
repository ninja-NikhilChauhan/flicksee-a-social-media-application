import React, { useEffect, useState, useRef,useContext } from "react";
import "materialize-css/dist/css/materialize.min.css";
import { UserContext } from "../../App";
import { Link, useNavigate, useLocation } from "react-router-dom";
import M from "materialize-css";
function Navlink() {
  const [clicked, setClicked] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searchDetailed, setsearchDetailed] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const [homebackground, sethomeBackground] = useState(false);
  const [postbackground, setpostBackground] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };
  useEffect(() => {
    if (location.pathname === "/") {
      sethomeBackground(true);
    } else if (location.pathname === "/myfollowerpost") {
      setpostBackground(true);
    }
  }, [location]);

  useEffect(() => {
    const fetchUser = (query) => {
      setLoader(true);

      fetch("/search-user", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          setLoader(false);
          setsearchDetailed(results.user);
          console.log(results.user);
        })
        .catch((err) => {
          console.log("searching " + err);
        });
    };

    const handler = setTimeout(() => {
      if (search) {
        fetchUser(search);
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [search]);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
          marginLeft: "30px",
          marginRight: "30px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{}}>
            <Link to="/">
              <p
                style={{
                  margin: "0px 0px",
                  border: "1px solid black",

                  color: homebackground ? "white" : "black",
                  backgroundColor: homebackground ? "black" : "white",
                  padding: "5px 15px",
                  borderRadius: "50px",
                }}
                onClick={() => setClicked(true)}
              >
                All
              </p>
            </Link>
          </div>
          <div>
            <Link to="/myfollowerpost">
              <p
                style={{
                  margin: "0px 0px",
                  border: "1px solid black",

                  backgroundColor: postbackground ? "black" : "white",
                  color: postbackground ? "white" : "black",

                  padding: "5px 15px",
                  borderRadius: "50px",
                }}
              >
                My Following
              </p>
            </Link>
          </div>
        </div>

        <div style={{ borderRadius: "20px", padding: "5px" }}>
          <button class="btn" onClick={handleModalOpen}>
            search
          </button>
        </div>
      </div>
      <Modal className="modal" show={showModal} handleClose={handleModalClose}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5 style={{ textAlign: "center", marginTop: "20px" }}>
              Search your Friend!
            </h5>
            <p
              onClick={handleModalClose}
              style={{ fontSize: "25px", margin: "1px 4px",cursor:'pointer' }}
            >
              ✕
            </p>
          </div>

          <input
            style={{ marginBottom: "30px" }}
            type="text"
            placeholder="name (e.g-John Doe)"
            onChange={(e) => setSearch(e.target.value)}
          />

          {searchDetailed && searchDetailed.length === 0 ? (
            <p style={{ textAlign: "center" }}>"No user Found"</p>
          ) : (
            <ul class="collection">
              {searchDetailed &&
                searchDetailed.map((item) => {
                  return (
                    // console.log(item)
                    <li class="collection-item">
                      <div style={{display:'flex',justifyContent:'space-between'}}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: "20px",
                          }}
                        >
                          <img
                            src={item.pic}
                            height="20px"
                            width="20px"
                            style={{ borderRadius: "100px" }}
                          />
                          <p>{item.username}</p>
                        </div>
                        <div>
                        <Link  to={
                          state._id === item._id
                            ? "/profile"
                            : `/profile/${item._id}`
                        }>    <p className="search-view-profile" >view profile </p></Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}

          <button className="upload-btn">
            {loader ? (
              <div class="preloader-wrapper small active custom-spinner">
                <div class="spinner-layer spinner-green-only">
                  <div class="circle-clipper left">
                    <div class="circle"></div>
                  </div>
                  <div class="gap-patch">
                    <div class="circle"></div>
                  </div>
                  <div class="circle-clipper right">
                    <div class="circle"></div>
                  </div>
                </div>
              </div>
            ) : (
              "search"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}
const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main-search">{children}</section>
    </div>
  );
};

export default Navlink;
