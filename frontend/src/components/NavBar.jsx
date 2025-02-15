import "../styles/NavBar.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import AllNotifications from "./AllNotifications";

function NavBar() {
  const [showAllNotificions, setShowAllNotifications] = useState(false);

  return (
    <div>
      <div id="navbar-container">
        <div id="title-container">
          <img src="../src/assets/react.svg"></img>
          Career Compass
        </div>
        <div id="header-container">
          <Link to="/">Dashboard</Link>
          <Link to="/placements">Placements</Link>
          <a href="#">To-Do</a>
          <a href="#">Statistics</a>
          <a href="#">Profile</a>
          <button
            id="noti-button"
            onClick={() => {
              setShowAllNotifications(true);
            }}
          >
            <img src="src/assets/noti.svg" />
          </button>
        </div>
      </div>
      {showAllNotificions && (
        <AllNotifications setShowAllNotifications={setShowAllNotifications}></AllNotifications>
      )}
    </div>
  );
}

export default NavBar;
