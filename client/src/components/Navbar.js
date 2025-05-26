import React, { useContext } from "react";
import { UserContext } from "../App";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  const renderlist = () => {
    if (state) {
      return [
       
        <li >
          <Link to="/profile" >
            My Profile
          </Link>
        </li>,
        <li>
          <button
            className="btn waves-effect waves-light #7b1fa2 purple darken-2"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              navigate("/login");
            }}
          >
            signout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/login">Login</Link>
        </li>,
        <li>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  return (
    // add_to_queue
    <nav>
      <div class="nav-wrapper white">
       <Link to={state?"/":"/login"} class="brand-logo  left">
          Flicksee
        </Link>
        <ul id="nav-mobile" className="right ">
          {renderlist()}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
