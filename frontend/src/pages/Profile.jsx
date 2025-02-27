import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    location: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/profile/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfile(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          location: response.data.location,
        });
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.error("No access token found.");
      return;
    }

    axios
      .put(
        `http://127.0.0.1:8000/api/profile/${id}/`,
        {
          username: formData.username,
          email: formData.email,
          location: formData.location,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        setProfile(response.data);
      })
      .catch((error) => console.error("Error updating profile:", error));
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Profile</h1>

      <div>
        <h3>Profile Picture</h3>
        {profile.image ? (
          <img
            src={`http://127.0.0.1:8000${profile.image}`}
            alt="Profile"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
        ) : (
          <p>No profile image available</p>
        )}
      </div>

      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Location:
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </label>
      <br />
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
};

export default Profile;
