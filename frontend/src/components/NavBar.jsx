import "../styles/NavBar.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AllNotifications from "./AllNotifications";
import api from "../api";

/**
 * Navigation bar component used within layout component.
 * 
 * Holds the main navigation links to all pages
 * Holds the notifications dropdown box for all notifications unread
 * Has profile picture display
 *
 */
function NavBar() {
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState("");
  const notificationsRef = useRef(null);

  //on page load fetch all notifications and the profile picture of the user
  useEffect(() => {
    getNotifications();
    getProfilePicture();
  }, []);

  useEffect(() => {
    //when showAllNotifcations changes
    function handleClickOutside(event) {
      if (
        notificationsRef.current && //if the referenced div (all notifications component) is present
        !notificationsRef.current.contains(event.target) //and doesn't contains the event target (the click)
      ) {
        setShowAllNotifications(false); //set showAllNotifications to false
      }
    }

    if (showAllNotifications) {
      //when showAllNotifications changes if showAllNotifications is true an event listener is added which
      document.addEventListener("mousedown", handleClickOutside); //waits for mousedown event and on mousedown runs the handleClickOutside function
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // remove the event listener
    };
  }, [showAllNotifications]);

  //function for fetching all notifications of the user and filtering to get those marked as unread through the notifications boolean attribute "read"
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

  //function for fetching the users profile picture and setting it as the state variable setProfile
  const getProfilePicture = () => {
    api
      .get("/api/account/picture/")
      .then((res) => res.data)
      .then((data) => {
        const profilePic = data.profile_picture;
        setProfile(profilePic);
        console.log(profilePic);
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <div id="navbar-container">
        <div id="title-container">
          <Link to="/" className="no-underline"><img src="../src/assets/react.svg" alt="logo"></img>
          Career Compass</Link>
        </div>
        <div id="header-container">
          <Link to="/">Dashboard</Link>
          <Link to="/placements">Placements</Link>
          <Link to="/todo">To-Do</Link>
          <Link to="/statistics">Statistics</Link>
          <button
            id="noti-button"
            onClick={() => setShowAllNotifications(true)}
          >
            <img src="src/assets/noti.svg" alt="notifications" />
          </button>
          <Link to="/account" className="no-hover">
            <img
              src={profile || "src/assets/prof.svg"}
              id="profile-picture-header"
              className="no-select"
            />
          </Link>
          {notifications.length > 0 && <div id="got-notis">.</div>}
        </div>
      </div>

      {showAllNotifications && (
        <div ref={notificationsRef}>
          {" "}
          {/* wrap AllNotifications in a div with ref */}
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
