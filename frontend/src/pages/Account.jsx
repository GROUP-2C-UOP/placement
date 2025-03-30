import api from "../api";
import { useState, useEffect } from "react";
import "../styles/Account.css";
import NavBar from "../components/NavBar";
import { Link } from "react-router";
import ConfirmationModal from "../components/ConfirmationModal";

const Account = () => {
  const [profile, setProfile] = useState("");
  const [name, setName] = useState(null);
  const [newName, setNewName] = useState("");
  const [email, setEmail] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [emailNotificationStatus, setEmailNotificationStatus] = useState(false);
  const [notificationTime, setNotificationTime] = useState(3);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    getProfileDetails();
    getNotificationStatus();
    getEmailNotificationStatus();
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
        setNewName(name);

        setEmail(data.email);
        setNewEmail(data.email);
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

  const getEmailNotificationStatus = () => {
    api
      .get(`/api/account/notification/emailstatus/`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data)
        const status = data.email_notification_enabled;
        setEmailNotificationStatus(status);
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
        setNotificationTime(data.notification_time);
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

  const changeName = () => {
    const nameToUse = newName.trim() || "User";

    const nameParts = nameToUse.split(" "); // split str into parts by space
    const firstName = nameParts[0]; // first part is the first name
    const lastName = nameParts.slice(1).join(" ") || ""; // everything else is the last name

    updateField("first_name", firstName, `/api/account/update/`, () => {
      updateField("last_name", lastName, `/api/account/update/`, getName);
    });
  };

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

  const changeEmailNotificationStatus = () => {
    setEmailNotificationStatus((prevStatus) => {
      //pass notificationstatus state as prevstatus as it is about to be changed (done automatically by react)
      const newStatus = !prevStatus; // newStatus is inverse of previous
      updateField(
        //call updatefield function to set notification enabled with new status as new value
        "email_notification_enabled",
        newStatus,
        `/api/account/notification/update/`,
        getEmailNotificationStatus
      );
      console.log("Updated notification status:", newStatus);
      return newStatus; // return new status so that it is also set as the notification status in reacts use state
    });
  };

  const handleEmailBlur = () => {
    const emailInput = document.getElementById("email-input");
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailPattern.test(newEmail)) {
      setShowEmailModal(true); // Show modal if email is valid
      setEmail(newEmail)
    } else {
      alert("Please enter an email");
      setShowEmailModal(false);
    }
  };

  const handlePasswordBlur = () => {
    if (newPassword) {
      setShowPasswordModal(true);
    }
  };

  const changeNotificationTime = (empty) => {
    let time
    if (empty) {
      time = 1;
    } else {
      time = notificationTime;
    }
    updateField(
      "notification_time",
      time,
      "/api/account/notification/update/",
      getNotificationTime
    );
  };

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
        <h1 className="profile-subheader">Profile</h1>
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
            <p className="profile-part">Name</p>
            <input
              type="text"
              name="name"
              className="profile-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={changeName}
            />
          </div>
          <div id="email-container">
            <p className="profile-part">Email</p>
            <input
              type="email"
              name="email"
              id="email-input"
              className="profile-input"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onBlur={() => handleEmailBlur()}
            />
          </div>
          <div id="password-container">
            <p className="profile-part">Change Password</p>
            <input
              type="password"
              name="password"
              id="password-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={() => handlePasswordBlur()}
            />
          </div>
        </div>
      </div>
      <hr />
      <div id="notification-details-container">
        <h1 className="profile-subheader">Notifications</h1>
        <div id="three-grid">
          <div id="turn-notis">
            <p id="notification" className="profile-part">
              In-App Notifications
            </p>

            <div className="switch no-select" onClick={changeNotificationStatus}>
              <div className={`slider ${notificationStatus ? "on" : "off"}`}>
                {notificationStatus ? "ON" : "OFF"}
              </div>
            </div>
          </div>

          <div id="turn-notis">
            <p id="notification" className="profile-part">
              Email Notifications
            </p>

            <div className="switch no-select" onClick={changeEmailNotificationStatus}>
              <div className={`slider ${emailNotificationStatus ? "on" : "off"}`}>
                {emailNotificationStatus ? "ON" : "OFF"}
              </div>
            </div>
          </div>

          <div id="change-time">
            <p id="notification" className="profile-part">
              Notification Timing
            </p>
            <label htmlFor="notification-time" id="notify-sentence">
              Get Notified{" "}
              <input
                type="number"
                name="notification-time"
                id="notification-time"
                onChange={(e) => setNotificationTime(e.target.value)}
                onBlur={(e) => {
                  console.log(e.target.value);
                  let value = parseInt(e.target.value, 10);
                  console.log(value);
                  if (!isNaN(value)) {
                    if (value < 1) value = 1;
                    if (value > 7) value = 7;

                    setNotificationTime(value);
                    changeNotificationTime(false);
                  } else {changeNotificationTime(true)}
                }}
                value={notificationTime}
                min="1"
                max="7"
              />
              {} Days Before the Deadline{" "}
            </label>
          </div>
        </div>
      </div>
      <hr />
      <Link to="/logout">
        <button id="logout">LOGOUT</button>
      </Link>
      {showEmailModal && (
        <ConfirmationModal
          func={changeEmail}
          method={"change"}
          type={"email"}
          message={"You will sign in with this email from now on"}
          onClose={() => {
            setShowEmailModal(false);
            setNewEmail(email);
          }}
        ></ConfirmationModal>
      )}
      {showPasswordModal && (
        <ConfirmationModal
          func={changePassword}
          method={"change"}
          type={"password"}
          message={"You will sign in with this password from now on"}
          onClose={() => {
            setShowPasswordModal(false);
            setNewPassword("");
          }}
        ></ConfirmationModal>
      )}
    </div>
  );
};

export default Account;
