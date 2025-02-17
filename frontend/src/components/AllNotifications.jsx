import "../styles/AllNotifications.css";
import Notification from "./Notification";
import { useEffect, useState } from "react";

function AllNotifications({
  setShowAllNotifications,
  notifications,
  getNotifications,
}) {
  useEffect(() => {
    getNotifications();
  }, []);

  const [fadeOut, setFadeOut] = useState(false);

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
