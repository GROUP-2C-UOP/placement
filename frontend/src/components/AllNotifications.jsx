import "../styles/AllNotifications.css";
import Notification from "./Notification";

function AllNotifications({ setShowAllNotifications }) {
  const arr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  return (
    <div id="cont">
      <div id="button-cont">
        <button id="close" onClick={() => {setShowAllNotifications(false)}}>
          <img src="src/assets/close.svg" />
        </button>
      </div>
      <div id="noti-cont">
        {arr.map((item, index) => (
          <Notification key={index} />
        ))}
      </div>
    </div>
  );
}

export default AllNotifications;
