import "../styles/NotificationsPopUp.css";
import api from "../api";
import { statusLabels } from "../constants";
import { useState } from "react";

/**
 * Popup component for displaying placement notifications
 *
 * Props:
 * - setShowSingleNoti: fucntion controlling the visibility of a single notification
 * - singleNotification: Object containing data for a single notification
 * - toShowNotifications: Array of notifications to display 
 * - setShowNoti: function to control visibility of the notification popup
 */

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
  const [fadeOutPopUp, setFadeOutPopUp] = useState(false);


   /**
   * Triggers fade-out animation and closes after delay
   * Updates notification status in backend after closing
   */
  const closeNoti = () => {
    setFadeOutPopUp(true);
    setTimeout(() => {
      if (type) {
        setShowNoti(false);
      } else {
        setShowSingleNoti(false);
      }
      updateNotiShown();
    }, 200);
  };

    /**
   * Updates notification status in backend when dismissed through api call changing the notification's shown attribute to true
   * done seperately for multiple and single notifications through dictating whether the type param is present
   */
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
    <div id="notification-cont" className={fadeOutPopUp ? "fade-out-pop-up" : ""}>
      <div id="notification-content-cont">
        <div id="noti-title">
          <h2>Notification</h2>
        </div>
        <div id="text-cont">
          {!type && (
            <p>
              Your {statusLabels[status] ? statusLabels[status] : "Application"} with {company} for {role} is due in{" "}
              {days} {days === 1 ? "day" : "days"}

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
