import "../styles/NotificationsPopUp.css";
import api from "../api";
import { statusLabels } from "../constants";

function NotificationsPopUp({
  setShowSingleNoti,
  singleNotification,
  toShowNotifications,
  setShowNoti,
  company,
  role,
  days,
  status,
  type,
}) {
  const closeNoti = () => {
    if (type) {
      setShowNoti(false);
    } else {
      setShowSingleNoti(false);
    }
    updateNotiShown();
  };

  const updateNotiShown = () => {
    if (type) {
      const updatedNotifications = toShowNotifications.map((notification) => ({
        id: notification.id,
        shown: true,
      }));

      api
        .patch("/api/notifications/bulkupdate/", updatedNotifications)
        .then((response) => {
          console.log("Notifications updated: response.data");
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    } else {
      if (!singleNotification) return;

      const notificationId = singleNotification.id;

      api
        .patch(`/api/notifications/update/${notificationId}/`, { shown: true })
        .then((response) => {
          console.log("Single Notification updated:", response.data);
        })
        .catch((err) => {
          console.error("Axios error:", err.response?.data || err.message);
        });
    }
  };

  return (
    <div id="notification-cont">
      <div id="notification-content-cont">
        <div id="noti-title"><h2>Notification</h2></div>
        <div id="text-cont">
          {!type && (
            <p>
              Your {statusLabels[status]} with {company} for {role} is due in {days} days.
            </p>
          )}
          {type && <p>Multiple placement notifications.</p>}
        </div>
        <button id="close-noti" onClick={closeNoti}>
          CLOSE
        </button>
      </div>
    </div>
  );
}

export default NotificationsPopUp;
