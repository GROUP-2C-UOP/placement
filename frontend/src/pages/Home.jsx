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
  const [deadline, setDeadline] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [status, setStatus] = useState("");
  const [cv, setCv] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [contact, setContact] = useState("");
  const [statusChoices, setStatusChoices] = useState([]);

  useEffect(() => {
    getPlacements();
    //getStatusChoices();
  }, []);

  const getPlacements = () => {
    api
      .get("/api/placements/")
      .then((res) => res.data)
      .then((data) => {
        setPlacements(data);
      })
      .catch((err) => alert(err));
  };

  const getStatusChoices = () => {
    api
      .get("/api/status-choices")
      .then((res) => res.data)
      .then((data) => {
        setStatusChoices(data);
      })
      .catch((err) => alert("i am being triggered"));
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
    
    console.log({
      company,
      role,
      salary,
      starting_date: startingDate,
      duration,
      deadline,
      applicationLink,
      dateApplied,
      contact
    });

    api
      .post("/api/placements/", {
        company,
        role,
        salary,
        starting_date: startingDate,
        duration,
        next_stage_deadline: deadline,
        placement_link: applicationLink,
        date_applied: dateApplied,
        // status,
        // cv,
        // coverLetter,
        contact,
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
          <label htmlFor="deadline">Deadline</label>
          <br />
          <input
            type="date"
            id="deadline"
            name="deadline"
            onChange={(e) => setDeadline(e.target.value)}
            value={deadline}
          />
          <br />
          <label htmlFor="applicationLink">Application Link</label>
          <br />
          <input
            type="url"
            id="applicationLink"
            name="applicationLink"
            onChange={(e) => setApplicationLink(e.target.value)}
            value={applicationLink}
          />
          <br />
          <label htmlFor="dateApplied">Date Applied</label>
          <br />
          <input
            type="date"
            id="dateApplied"
            name="dateApplied"
            onChange={(e) => setDateApplied(e.target.value)}
            value={dateApplied}
          />
          <br />
          {/* <label htmlFor="status">Status</label>
          <br />
          <select
            id="status"
            name="status"
            onChange={(e) => setStatus(e.target.value)}
            value={status}
            required
          >
            <option value="">Select a status</option>
            {statusChoices.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <br /> */}
          {/* <label htmlFor="cv">CV Used</label>
          <br />
          <input
            type="file"
            id="cv"
            name="cv"
            onChange={(e) => setCv(e.target.files[0])}
          />
          <br />
          <label htmlFor="coverLetter">Cover Letter Used</label>
          <br />
          <input
            type="file"
            id="coverLetter"
            name="coverLetter"
            onChange={(e) => setCoverLetter(e.target.files[0])}
          /> */}
          <br />
          <label htmlFor="contact">Their Contact</label>
          <br />
          <input
            type="text"
            id="contact"
            name="contact"
            onChange={(e) => setContact(e.target.value)}
            value={contact}
          />
          <br />
          <br />
          <button className="add-button" type="submit">
            Add Placement
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
