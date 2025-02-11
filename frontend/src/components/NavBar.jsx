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
        <Link to="/to-do">To-Do</Link>
        <a href="#">Statistics</a>
        <a href="#">Profile</a>
      </div>
    </div>
  );
}

export default NavBar;
