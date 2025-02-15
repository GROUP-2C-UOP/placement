import "../styles/NotificationsPopUp.css";

function NotificationsPopUp({ setShowSingleNoti, company, role, days, status }) {
  return (
    <div id="notification-cont">
      <div id="notification-content-cont">
        <h2>Notification</h2>
        <div id="text-cont">
          <p>Your {status} with {company} for {role} is due in {days} days.</p>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPopUp;
