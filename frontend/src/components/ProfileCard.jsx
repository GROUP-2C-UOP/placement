import { useParams } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams();
  return <div>Profile Page for User {userId}</div>;
};

export default Profile;
