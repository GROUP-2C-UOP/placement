import "../styles/AllNotifications.css";
import Notification from "./Notification";
import { useEffect, useState } from "react";

/**
 * Displays a tab within the nav bar that has all the in-app notifications
 *
 * Params:
 * - setShowAllNotifications: useState function to close this tab
 * - notifications: array of notification objects to display
 * - getNotifications: function to fetch notifications
 */

function AllNotifications({
  setShowAllNotifications,
  notifications,
  getNotifications,
}) {


  /**
   * On render, the getNotifications function is called to ensure user sees latest notifications everytime the tab is opened
   */
  useEffect(() => {
    getNotifications();
  }, []);

  //State for triggering fade out animation when closing tab
  const [fadeOut, setFadeOut] = useState(false);

  /**
   * Handles closing the tab
   * Triggers fade out animation and after 200ms, hides the tab
   */
  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowAllNotifications(false);
    }, 200);
  };

  return (
    <div className={`all-notification-cont ${fadeOut ? "fade-out" : ""}`}>
      <div id="button-container">
        <h3>Notifications</h3>
        <button
          id="close"
          onClick={() => {
            handleClose();
          }}
        >
          <img src="src/assets/close.svg" />
        </button>
      </div>
      {notifications.length > 0 && (
        <div id="noti-cont">
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              getNotifications={getNotifications}
            />
          ))}
        </div>
      )}
      {notifications.length === 0 && <p>You have no notifications</p>}
    </div>
  );
}

export default AllNotifications;
