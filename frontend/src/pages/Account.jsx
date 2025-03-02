import api from "../api";
import { useState, useEffect } from "react";
import "../styles/Account.css";
import NavBar from "../components/NavBar";
import { Link } from "react-router";

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
    getProfileDetails();
    getNotificationStatus();
    getNotificationTime();
  }, []);

  const getProfileDetails = () => {
    api
      .get("/api/account/details/")
      .then((res) => res.data)
      .then((data) => {
        setProfile(data.profile_picture);

        const name = `${data.first_name} ${data.last_name}`
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize first letter of each word
        setName(name);

        setEmail(data.email);
      })
      .catch((err) => alert(err));
  };

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

  const getNotificationTime = () => {
    api
      .get(`/api/account/notification/time/`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const updateField = (field, value, url, refresh) => {
    console.log(value);
    api
      .patch(url, { [field]: value })
      .then((res) => {
        if (res.status === 200 || res.status === 204) {
          console.log(`${field} Updated`);
          refresh();
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
    updateField("first_name", newFirstName, `/api/account/update/`, getName);
  const changeLastName = () =>
    updateField("last_name", newLastName, `/api/account/update/`, getName);
  const changeEmail = () =>
    updateField("email", newEmail, `/api/account/update/`, getEmail);

  const changeNotificationStatus = () => {
    setNotificationStatus((prevStatus) => {
      //pass notificationstatus state as prevstatus as it is about to be changed (done automatically by react)
      const newStatus = !prevStatus; // newStatus is inverse of previous
      updateField(
        //call updatefield function to set notification enabled with new status as new value
        "notification_enabled",
        newStatus,
        `/api/account/notification/update/`,
        getNotificationStatus
      );
      console.log("Updated notification status:", newStatus);
      return newStatus; // return new status so that it is also set as the notification status in reacts use state
    });
  };

  const changeNotificationTime = () =>
    updateField(
      "notification_time",
      notificationTime,
      `/api/account/notification/update/`,
      getNotificationTime
    );

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

  return (
    <div id="profile-general-container">
      <h1 id="profile-header">{name ? name.split(" ")[0] : ""}'s Account</h1>
      <hr />
      <div id="profile-details-container">
        <h1 id="profile-subheader">Profile</h1>
        <div id="four-grid">
          <div id="pic-container">
            <div id="profile-container">
              <img src={profile || "src/assets/prof.svg"} />
            </div>
            <label htmlFor="prof-input" id="prof-button" className="no-select">
              {" "}
              {/*hide profile input and use the label to act as a button. "htmlfor" makes it so when the label is clicked it will have the same functionality of input */}
              Change Profile
            </label>
            <input
              type="file"
              id="prof-input"
              onChange={(e) => changeProfilePicture(e.target.files[0])}
            />
          </div>
          <div id="name-container">
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
          </div>
          <div id="email-container">
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
          </div>
          <div id="password-container">
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
          </div>
        </div>
      </div>
      <hr />
      <div id="notification-details-container">
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
          onBlur={(e) => {
            let value = parseInt(e.target.value, 10) || 1;
            if (value < 1) value = 1;
            if (value > 7) value = 7;
            setNotificationTime(value);
          }}
          value={notificationTime}
          min="1"
          max="7"
        />

        <button onClick={changeNotificationTime}>submit</button>
      </div>
      <hr />
      <Link to="/logout">
        <button>Logout</button>
      </Link>
    </div>
  );
};

export default Account;
