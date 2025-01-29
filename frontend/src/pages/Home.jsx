import { useState, useEffect } from "react";
import api from "../api";
import { data } from "react-router";
import Placement from "../components/Placement";
import "../styles/Home.css";

function Home() {
  const [placements, setPlacements] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    getPlacements();
  }, []);

  const getPlacements = () => {
    api
      .get("/api/placements/")
      .then((res) => res.data)
      .then((data) => {
        setPlacements(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deletePlacement = (id) => {
    api
      .delete(`/api/placements/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Placement deleted successfully");
        } else alert("Error deleting placement");
        getPlacements();
      })
      .catch((err) => alert(err));
  };

  const createPlacement = (e) => {
    e.preventDefault();
    api
      .post("/api/placements/", {
        company,
        role,
        salary,
        starting_date: startingDate,
        duration,
      })
      .then((res) => {
        if (res.status === 201) {
          alert("Placement created successfully");
        } else alert("Error creating placement");
        getPlacements();
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="cont">
      <div>
        <h1 className="placement-title">Placements</h1>
        {placements.map((placement) => (
          <Placement
            placement={placement}
            onDelete={deletePlacement}
            key={placement.id}
          />
        ))}
      </div>
      <div className="add-placement">
      <h2>Add Placement</h2>
      <form onSubmit={createPlacement}>
        <label htmlFor="company">Company</label>
        <br />
        <input
          type="text"
          id="company"
          name="company"
          required
          onChange={(e) => setCompany(e.target.value)}
          value={company}
        />
        <br />
        <label htmlFor="role">Role</label>
        <br />
        <input
          type="text"
          id="role"
          name="role"
          required
          onChange={(e) => setRole(e.target.value)}
          value={role}
        />
        <br />
        <label htmlFor="salary">Salary</label>
        <br />
        <input
          type="number"
          id="salary"
          name="salary"
          onChange={(e) => setSalary(e.target.value)}
          value={salary}
        />
        <br />
        <label htmlFor="startingDate">Starting Date</label>
        <br />
        <input
          type="date"
          id="startingDate"
          name="startingDate"
          onChange={(e) => setStartingDate(e.target.value)}
          value={startingDate}
        />
        <br />
        <label htmlFor="duration">Duration</label>
        <br />
        <input
          type="number"
          id="duration"
          name="duration"
          onChange={(e) => setDuration(e.target.value)}
          value={duration}
        />
        <br />
        <br />
        <button className="add-button" type="submit">Add Placement</button>
      </form>
      </div>
    </div>
  );
}

export default Home;
