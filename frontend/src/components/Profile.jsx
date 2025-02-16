import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = ({ userId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/profile/${userId}/`)
      .then((response) => setProfile(response.data))
      .catch((error) => console.error("Error fetching profile:", error));
  }, [userId]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>{profile.user}'s Profile</h2>
      <p>Location: {profile.location}</p>
      <p>Applications: {profile.application_count}</p>
      <p>Created At: {new Date(profile.created_at).toLocaleString()}</p>
      <p>Updated At: {new Date(profile.updated_at).toLocaleString()}</p>
    </div>
  );
};

export default Profile;
