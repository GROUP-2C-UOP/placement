import "../styles/AllNotifications.css";
import Notification from "./Notification";
import { useEffect } from "react";

function AllNotifications({
  setShowAllNotifications,
  notifications,
  getNotifications,
}) {
  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div id="cont">
      <div id="button-container">
        <h3>Notifications</h3>
        <button
          id="close"
          onClick={() => {
            setShowAllNotifications(false);
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
