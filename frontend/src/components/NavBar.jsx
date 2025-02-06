import "../styles/NavBar.css";
import { Link } from "react-router-dom";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div id="navbar-container">
      <div id="title-container">
        <img src="../src/assets/react.svg"></img>
        Career Compass
        </div>
      <div id="header-container">
        <Link to="/">Dashboard</Link>
        <Link to="/home">Deadlines</Link>
        <a href="#">To-Do</a>
        <a href="#">Statistics</a>
        <a href="#">Profile</a>
      </div>
    </div>
  );
}

export default NavBar;
