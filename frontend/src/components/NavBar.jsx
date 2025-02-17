import "../styles/NavBar.css";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div id="navbar-container">
      <div id="title-container">
        <img src="../src/assets/react.svg"></img>
        Career Compass
      </div>
      <div id="header-container">
        <a href="#">Dashboard</a>
        <a href="#">Deadlines</a>
        <a href="#">To-Do</a>
        <a href="#">Statistics</a>
        <Link to="/profile/1">Profile</Link>
      </div>
    </div>
  );
}

export default NavBar;
