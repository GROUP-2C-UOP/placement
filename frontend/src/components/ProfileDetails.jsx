import { useParams } from "react-router-dom";

const ProfileDetails = () => {
  const params = useParams();
  console.log("useParams output:", params);

  return <div>Profile Page for User {params.id}</div>;
};

export default ProfileDetails;
