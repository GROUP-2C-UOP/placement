import React, { useEffect, useState } from "react";
import axios from "axios";

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/profiles/") // Django API endpoint
      .then((response) => setProfiles(response.data))
      .catch((error) => console.error("Error fetching profiles:", error));
  }, []);

  return (
    <div>
      <h1>Profiles Page</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>{profile.name}</li> // Adjust based on API response
        ))}
      </ul>
    </div>
  );
};

export default Profiles;
