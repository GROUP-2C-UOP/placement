import { getMargin } from "react-range/lib/utils";
import api from "../api";
import { useState, useEffect } from "react";

const Account = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    getName();
    getEmail();
  }, []);

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
  
  const changeFirstName = () => updateField('first_name', newFirstName);
  const changeLastName = () => updateField('last_name', newLastName);
  const changeEmail = () => updateField('email', newEmail);
  
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

  const changeNotificationDuration = () => {
    f;
  };

  return (
    <div>
      <h1 id="profile-header">Account</h1>
      {/* <img src="src/assets/prof.svg" /> */}
      {/* <button>Change Profile</button> */}
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
