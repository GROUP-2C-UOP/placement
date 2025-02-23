import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

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
      .then((response) => setProfile(response.data))
      .catch((error) => console.error("Error fetching profile:", error));
  }, [id]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>{profile.user}'s Profile</h1>
      <p>
        <strong>Location:</strong> {profile.location}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Username:</strong> {profile.name}
      </p>
    </div>
  );
};

export default Profile;
