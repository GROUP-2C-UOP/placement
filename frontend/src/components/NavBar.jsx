import "../styles/NavBar.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AllNotifications from "./AllNotifications";
import api from "../api";

function NavBar() {
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef(null);

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => { //when showAllNotifcations changes
    function handleClickOutside(event) { 
      if (
        notificationsRef.current && //if the referenced div (all notifications component) is present
        !notificationsRef.current.contains(event.target) //and doesn't contains the event target (the click)
      ) {
        setShowAllNotifications(false); //set showAllNotifications to false
      }
    }

    if (showAllNotifications) { //when showAllNotifications changes if showAllNotifications is true an event listener is added which 
      document.addEventListener("mousedown", handleClickOutside); //waits for mousedown event and on mousedown runs the handleClickOutside function
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // remove the event listener
    };
  }, [showAllNotifications]);

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
          <img src="../src/assets/react.svg" alt="logo"></img>
          Career Compass
        </div>
        <div id="header-container">
          <Link to="/">Dashboard</Link>
          <Link to="/placements">Placements</Link>
          <Link to="/statistics">Statistics</Link>
          <Link to="/todo">To-Do</Link>
          <Link to="/profile">Profile</Link>
          <button
            id="noti-button"
            onClick={() => setShowAllNotifications(true)}
          >
            <img src="src/assets/noti.svg" alt="notifications" />
          </button>
          {notifications.length > 0 && <div id="got-notis">.</div>}
        </div>
      </div>

      {showAllNotifications && (
        <div ref={notificationsRef}> {/* wrap AllNotifications in a div with ref */}
          <AllNotifications
            setShowAllNotifications={setShowAllNotifications}
            notifications={notifications}
            getNotifications={getNotifications}
          />
        </div>
      )}
    </div>
  );
}

export default NavBar;
