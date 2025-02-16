import "../styles/Notification.css";
import { statusLabels } from "../constants";
import api from "../api";

function Notification({ notification, getNotifications }) {
  const deleteNotification = (notification) => {
    api
      .patch(`/api/notifications/update/${notification.id}/`, { read: true })
      .then((response) => {
        getNotifications();
        console.log("Single Notification updated:", response.data);
      })
      .catch((err) => {
        console.error("Axios error:", err.response?.data || err.message);
      });
  };

  return (
    <div id="single-noti-cont">
      <div>
        {statusLabels[notification.status]} for {notification.company} due in{" "}
        {notification.days} days
      </div>
      <div id="button-cont">
        <button
          id="delete"
          onClick={() => {
            deleteNotification(notification);
          }}
        >
          <img src="src/assets/bin.svg" />
        </button>
      </div>
    </div>
  );
}

export default Notification;
