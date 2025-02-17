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

  const formatDateTime = (rawDateTime) => {
    const date = new Date(rawDateTime);
    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    }).replace(",", " -");
};

  return (
    <div id="single-noti-cont">
      <div id="noti-text-cont">
        <div>
          {statusLabels[notification.status]} for {notification.company} due in{" "}
          {notification.days} days
        </div>
        <div id="created">{formatDateTime(notification.created)}</div>
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
