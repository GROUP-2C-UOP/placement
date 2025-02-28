import api from "../api";
import { useState, useEffect } from "react";
import "../styles/Account.css";

const Account = () => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    getName();
    getEmail();
    getProfilePicture();
  }, []);

  const getProfilePicture = () => {
    api
      .get("/api/account/picture/")
      .then((res) => res.data)
      .then((data) => {
        setProfile(data);
        console.log(data);
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

  const updateField = (field, value) => {
    console.log(value);
    api
      .patch(`/api/account/update/`, { [field]: value })
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

  const changeFirstName = () => updateField("first_name", newFirstName);
  const changeLastName = () => updateField("last_name", newLastName);
  const changeEmail = () => updateField("email", newEmail);

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
        <img src={profile ? profile.profile_picture : "src/assets/prof.svg"} />
      </div>
      <label htmlFor="prof-input" id="prof-button">
        {" "}
        {/*hide profile input and use the label to act as a button. "htmlfor" makes it so when the label is clicked it will have the same functionality of input */}
        Upload CV
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
      <p id="notification">Change Notification Timing?</p>
      <button>
        kk
        {/* <img src="src/assets/prof.svg" /> */}
      </button>
    </div>
  );
};

export default Account;
