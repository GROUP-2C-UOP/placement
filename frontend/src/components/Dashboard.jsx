import "../styles/Dashboard.css";
import api from "../api";
import { useState, useEffect } from "react";

function Dashboard() {
  useEffect(() => {
    getUser();
  }, []);

  const [name, setName] = useState("");

  const getUser = () => {
    api
      .get("/api/user/getname/")
      .then((res) => res.data)
      .then((data) => {
        const firstName = data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1)
        setName(firstName);
      })
      .catch((err) => alert(err));
  };

  return (
    <div id="container">
      <header id="welcome">Welcome {name}</header>
      <header id="dashboard">Your Dashboard</header>
      <div id="main-container">
        <header id="deadlines-header">Upcoming deadlines</header>
        <header id="applications-header">Applications To Do</header>
        <div id="div-container">
          <div id="placement-container"></div>
          <div id="todo-container"></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
