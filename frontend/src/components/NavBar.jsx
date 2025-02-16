import "../styles/NavBar.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AllNotifications from "./AllNotifications";
import api from "../api";

function NavBar() {
  useEffect(() => {
    getNotifications();
  }, []);

  const [showAllNotificions, setShowAllNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);


  const getNotifications = () => {
    api
      .get("/api/notifications/")
      .then((res) => res.data)
      .then((data) => {
        const unreadNotifications = data.filter(
          (notification) => !notification.read
        );
        setNotifications(unreadNotifications);
      })
      .catch((err) => alert(err));
  };

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
          {notifications.length > 0 && (
        <div id="got-notis">.</div>
      )}
        </div>
      </div>
      {showAllNotificions && (
        <AllNotifications
          setShowAllNotifications={setShowAllNotifications}
          notifications={notifications}
          getNotifications={getNotifications}
        ></AllNotifications>
      )}
    </div>
  );
}

export default NavBar;
