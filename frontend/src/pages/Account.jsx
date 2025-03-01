import api from "../api";
import { useState, useEffect } from "react";
import "../styles/Account.css";

const Account = () => {
  const [profile, setProfile] = useState("");
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationTime, setNotificationTime] = useState("");

  useEffect(() => {
    getProfilePicture();
    getName();
    getEmail();
    getNotificationStatus();
  }, []);

  const getProfilePicture = () => {
    api
      .get("/api/account/picture/")
      .then((res) => res.data)
      .then((data) => {
        const profilePic = data.profile_picture;
        setProfile(profilePic);
        console.log(profilePic);
      })
      .catch((err) => alert(err));
  };

  const getName = () => {
    api
      .get("/api/account/name/")
      .then((res) => res.data)
      .then((data) => {
        const name = `${data.first_name} ${data.last_name}`
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize first letter of each word
        setName(name);
        console.log(name);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const getEmail = () => {
    api
      .get("/api/account/email/")
      .then((res) => res.data)
      .then((data) => {
        const email = data.email;
        setEmail(email);
        console.log(email);
      })
      .catch((err) => alert(err));
  };

  const getNotificationStatus = () => {
    api
      .get(`/api/account/notification/status/`)
      .then((res) => res.data)
      .then((data) => {
        const status = data.notification_enabled;
        setNotificationStatus(status);
        console.log(status);
      })
      .catch((err) => alert(err));
  };

  const updateField = (field, value, url) => {
    console.log(value);
    api
      .patch(url, { [field]: value })
      .then((res) => {
        if (res.status === 200 || res.status === 204) {
          console.log(`${field} Updated`);
        } else {
          alert("Something went wrong, try again.");
        }
      })
      .catch((error) => {
        console.error("Update failed", error);
        alert("Failed, check console");
      });
  };

  const changeFirstName = () =>
    updateField("first_name", newFirstName, `/api/account/update/`);
  const changeLastName = () =>
    updateField("last_name", newLastName, `/api/account/update/`);
  const changeEmail = () =>
    updateField("email", newEmail, `/api/account/update/`);

  const changeNotificationStatus = () => {
    setNotificationStatus((prevStatus) => {
      //pass notificationstatus state as prevstatus as it is about to be changed (done automatically by react)
      const newStatus = !prevStatus; // newStatus is inverse of previous
      updateField(
        //call updatefield function to set notification enabled with new status as new value
        "notification_enabled",
        newStatus,
        `/api/account/notification/update/`
      );
      console.log("Updated notification status:", newStatus);
      return newStatus; // return new status so that it is also set as the notification status in reacts use state
    });
  };

  const changeNotificationTime = () => updateField("notification_time", notificationTime, `/api/account/notification/update/`)

  const changePassword = () => {
    console.log(newPassword);
    api
      .patch(`/api/account/password/update/`, { password: newPassword })
      .then((res) => {
        if (res.status === 200 || res.status === 204) {
          console.log("password Updated");
        } else alert("Something went wrong, try again.");
      })
      .catch((error) => {
        console.error("Update failed", error);
        alert("Failed, check console");
      });
  };

  const changeProfilePicture = (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    api
      .patch(`/api/account/update/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 204) {
          console.log("Profile Picture Updated");
          setProfile(file);
          getProfilePicture();
        } else alert("Something went wrong, try again.");
      })
      .catch((error) => {
        console.error("Update failed", error);
        alert("Failed, check console");
      });
  };

  const changeNotificationDuration = () => {
    f;
  };

  return (
    <div>
      <h1 id="profile-header">Account</h1>
      <div id="profile-container">
      <img src={profile || "src/assets/prof.svg"} alt="Profile" />
      </div>
      <label htmlFor="prof-input" id="prof-button" className="no-select">
        {" "}
        {/*hide profile input and use the label to act as a button. "htmlfor" makes it so when the label is clicked it will have the same functionality of input */}
        Change Profile Picture
      </label>
      <input
        type="file"
        id="prof-input"
        onChange={(e) => changeProfilePicture(e.target.files[0])}
      />
      <p id="name">{name}</p>
      <input
        type="text"
        name="first-name"
        value={newFirstName}
        onChange={(e) => setNewFirstName(e.target.value)}
      />
      <button onClick={changeFirstName}>
        {/* <img src="src/assets/edit.svg" /> */}Submit
      </button>
      <input
        type="text"
        name="last-name"
        value={newLastName}
        onChange={(e) => setNewLastName(e.target.value)}
      />
      <button onClick={changeLastName}>
        {/* <img src="src/assets/edit.svg" /> */}Submit
      </button>
      <p id="email">{email}</p>
      <input
        type="email"
        name="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />
      <button onClick={changeEmail}>
        {/* <img src="src/assets/edit.svg" /> */}Submit
      </button>
      <p id="password">Change Password?</p>
      <input
        type="password"
        name="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={changePassword}>
        {/* <img src="src/assets/edit.svg" /> */}submit
      </button>
      <p id="notification">Notifications On?</p>
      <label htmlFor="notification-enabled">Turn on notification</label>
      <input
        type="checkbox"
        id="notification-enabled"
        checked={notificationStatus}
        onChange={changeNotificationStatus}
      />
      <p id="notification">Change Notification Timing?</p>
      <label htmlFor="notification-time">Days Before Deadline</label>
      <input
        type="number"
        name="notification-time"
        id="notification-time"
        onChange={(e) => setNotificationTime(e.target.value)}
        value={notificationTime}
        min="1"
        max="7"
      />
      <button onClick={changeNotificationTime}>submit</button>
    </div>
  );
};

export default Account;
