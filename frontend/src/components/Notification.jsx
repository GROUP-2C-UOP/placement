import "../styles/Notification.css";
import { statusLabels } from "../constants";
import api from "../api";

/**
 * single notification component to display for a single upcoming application /todo
 *
 * Props:
 * - notification: Object containing notification data 
 * - getNotifications: function to refresh notifications after an update
 *
 * - displays application status with company name and due date
 * - displays creation timestamp
 * - delete functionality to mark notification as read
 */
function Notification({ notification, getNotifications }) {

  /**
   * sneds a patch request to update a notifications values in order for it to be declared as read and emailed to be ignored in the future
   */
  const deleteNotification = (notification) => {
    api
      .patch(`/api/notifications/update/${notification.id}/`, { read: true, emailed: true })
      .then((response) => {
        getNotifications();
        console.log("Single Notification updated:", response.data);
      })
      .catch((err) => {
        console.error("Axios error:", err.response?.data || err.message);
      });
  };

  //helper function to format the time
  const formatDateTime = (rawDateTime) => {
    const date = new Date(rawDateTime);
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      .replace(",", " -");
  };

  return (
    <div id="single-noti-cont">
      <div id="noti-text-cont">
        <div>
          {statusLabels[notification.status] ? statusLabels[notification.status] : "Application"} for {notification.company} due{" "}
          {notification.days === 0
            ? "today"
            : `in ${notification.days} day${
                notification.days === 1 ? "" : "s"
              }`}
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
