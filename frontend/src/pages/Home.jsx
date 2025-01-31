import { useState, useEffect } from "react";
import api from "../api";
import Placement from "../components/Placement";
import { statusLabels } from "../constants";
import AddModal from "../components/AddModal";

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);

  useEffect(() => {
    getPlacements();
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

    const formData = new FormData();
    formData.append("company", company || null);
    formData.append("role", role || null);
    formData.append("salary", salary || null);
    formData.append("starting_date", startingDate || null);
    formData.append("duration", duration || null);
    formData.append("next_stage_deadline", deadline || null);
    formData.append("placement_link", applicationLink || null);
    formData.append("date_applied", dateApplied || null);
    formData.append("status", status || "Applied");
    formData.append("contact", contact || null);
    formData.append("cv", cv || null);
    formData.append("cover_letter", coverLetter || null);

    api
      .post("/api/placements/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 201) {
          alert("Placement created successfully");
          setShowAddModal(false);
          getPlacements();
        } else {
          alert("Error creating placement");
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="cont">
      <div>
        <h1 className="placement-title">Placements</h1>
        <div className="header-containerrr">
          <table>
            <thead id="headers">
              <tr className="single-row">
                <th className="main-headers">Company</th>
                <th className="main-headers">Role</th>
                <th className="main-headers">Salary</th>
                <th className="main-headers">Duration</th>
                <th className="main-headers">Stage</th>
                <th className="main-headers">Contact</th>
              </tr>
            </thead>
          </table>
        </div>

        {placements.map((placement) => (
          <Placement
            placement={placement}
            statusLabels={statusLabels}
            onDelete={deletePlacement}
            key={placement.id}
          />
        ))}
      </div>
      {showAddModal && (
        <AddModal
          company={company}
          setCompany={setCompany}
          role={role}
          setRole={setRole}
          salary={salary}
          setSalary={setSalary}
          startingDate={startingDate}
          setStartingDate={setStartingDate}
          duration={duration}
          setDuration={setDuration}
          deadline={deadline}
          setDeadline={setDeadline}
          applicationLink={applicationLink}
          setApplicationLink={setApplicationLink}
          dateApplied={dateApplied}
          setDateApplied={setDateApplied}
          status={status}
          setStatus={setStatus}
          cv={cv}
          setCv={setCv}
          coverLetter={coverLetter}
          setCoverLetter={setCoverLetter}
          contact={contact}
          setContact={setContact}
          createPlacement={createPlacement}
          toClose={() => {setShowAddModal(false); setShowAddButton(true)}}
        ></AddModal>
      )}
      {showAddButton && (
        <button
          id="add-button"
          onClick={() => {
            setShowAddModal(true);
            setShowAddButton(false);
          }}
        >
          +
        </button>
      )}
    </div>
  );
}

export default Home;
