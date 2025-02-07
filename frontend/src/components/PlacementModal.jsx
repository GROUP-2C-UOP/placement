import "../styles/PlacementModal.css";
import { statusLabels } from "../constants";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal.jsx";
import api from "../api";

function PlacementModal({
  placement,
  getPlacements,
  closeModal,
  showModal,
  statusLabels,
  onDelete,
  company,
  setCompany,
  role,
  setRole,
  salary,
  setSalary,
  startingDate,
  setStartingDate,
  duration,
  setDuration,
  deadline,
  setDeadline,
  applicationLink,
  setApplicationLink,
  dateApplied,
  setDateApplied,
  status,
  setStatus,
  cv,
  setCv,
  coverLetter,
  setCoverLetter,
  contact,
  setContact,
  description,
  isDashboard,
  setDescription,
  setShowModal,
}) {
  const [editing, setEditing] = useState(false);
  const modalType = isDashboard
    ? "dashboard-modal-screen"
    : "placement-modal-screen";
  const spacingClass = isDashboard ? "dashboard-spacing" : "home-spacing";

  const statusDropdown = [
    { label: "Applied", value: "applied" },
    { label: "Phone Interview", value: "phone_interview" },
    { label: "Face to Face Interview", value: "face_to_face_interview" },
    { label: "Assessment", value: "assessment" },
    { label: "Rejected", value: "rejected" },
    { label: "Offer Made", value: "offer_made" },
    { label: "Hired", value: "hired" },
    { label: "Withdrawn", value: "withdrawn" },
  ];

  const updatedData = {
    company,
    role,
    salary,
    starting_date: startingDate,
    duration,
    next_stage_deadline: deadline,
    status,
    placement_link: applicationLink,
    cv,
    cover_letter: coverLetter,
    contact,
    date_applied: dateApplied,
    description,
  };

  const check = () => {
    let formData = new FormData();

    for (const field in updatedData) {
      if (updatedData[field] !== "") {
        formData.append(field, updatedData[field]);
      }
    }
    return formData;
  };

  const updatePlacement = (id, getPlacements, setShowModal) => {
    const modifiedFields = check();

    api
      .patch(`/api/placements/update/${id}/`, modifiedFields, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 204) {
          alert("Placement Updated");

          setCompany("");
          setRole("");
          setSalary("");
          setStartingDate("");
          setDuration("");
          setDeadline("");
          setStatus("");
          setApplicationLink("");
          setCv("");
          setCoverLetter("");
          setContact("");
          setDateApplied("");
          setDescription("");
          getPlacements();
          setShowModal(false);
        } else alert("Something went wrong, try again.");
      })
      .catch((error) => {
        console.error("Update failed", error);
        alert("Failed, check console");
      });
  };

  return (
    <div>
      {!editing && (
        <div className={`${showModal ? "" : "hidden"} ${modalType}`}>
          <div id="modal-window">
            <button id="close-button" onClick={closeModal}>
              X
            </button>
            <h2 id="general-title">Placement Details</h2>
            <div id="modal-content" className="placement-grid">
              <div className="detail">
                <label>Company:</label>
                <br />
                {placement.company}
              </div>
              <div className="detail">
                <label>Role:</label>
                <br />
                {placement.role}
              </div>
              <div className="detail">
                <label>Salary:</label>
                <br />
                {placement.salary}
              </div>
              <div className="detail">
                <label>Starting Date:</label>
                <br />
                {placement.starting_date}
              </div>
              <div className="detail">
                <label>Duration:</label>
                <br />
                {placement.duration}
              </div>
              <div className="detail">
                <label>Deadline:</label>
                <br />
                {placement.next_stage_deadline}
              </div>
              <div className="detail">
                <label>Status:</label>
                <br />
                {statusLabels[placement.status]}
              </div>
              <div className="detail">
                <label>Application Link:</label>
                <br />
                <a
                  href={placement.placement_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Listing
                </a>
              </div>
              <div className="detail">
                <label>CV:</label>
                <br />
                {placement.cv && (
                  <a
                    href={placement.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View CV
                  </a>
                )}
              </div>
              <div className="detail">
                <label>Cover Letter:</label>
                <br />
                {placement.cover_letter && (
                  <a
                    href={placement.cover_letter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Cover Letter
                  </a>
                )}
              </div>
              <div className="detail">
                <label>Contact:</label>
                <br />
                {placement.contact}
              </div>
              <div className="detail">
                <label>Date Applied:</label>
                <br />
                {placement.date_applied}
              </div>
              <div className="detail">
                <label>Desc</label>
                <br />
                {placement.description}
              </div>
            </div>
            {!isDashboard &&
              (
               <div id="buttons">
              <button onClick={() => onDelete(placement.id)}>Delete</button>
              <button
                onClick={() => {
                  setEditing(true);
                }}
              >
                Edit
              </button>
            </div> 
              )}
          </div>
        </div>
      )}
      
      {editing && (
        <div className={`${showModal ? "" : "hidden"} ${modalType}`}>
          <div id="modal-window">
            <button id="close-button" onClick={closeModal}>
              X
            </button>
            <h2 id="general-title">Placement Details</h2>
            <div id="modal-content">
              <div className="detail">
                <label>Company:</label>
                <br />
                <input
                  type="text"
                  id="company"
                  className="input-field"
                  name="company"
                  required
                  onChange={(e) => setCompany(e.target.value)}
                  value={company}
                  placeholder={placement.company}
                />
              </div>
              <div className="detail">
                <label>Role:</label>
                <br />
                <input
                  type="text"
                  id="role"
                  className="input-field"
                  name="role"
                  required
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                  placeholder={placement.role}
                />
              </div>
              <div className="detail">
                <label>Salary:</label>
                <br />
                <input
                  type="number"
                  id="salary"
                  className="input-field"
                  name="salary"
                  onChange={(e) => setSalary(e.target.value)}
                  value={salary}
                  placeholder={placement.salary}
                  required
                />
              </div>
              <div className="detail">
                <label>Starting Date:</label>
                <br />
                <input
                  type="date"
                  id="startingDate"
                  className="input-field"
                  name="startingDate"
                  onChange={(e) => setStartingDate(e.target.value)}
                  value={startingDate}
                />
              </div>
              <div className="detail">
                <label>Duration:</label>
                <br />
                <input
                  type="number"
                  id="duration"
                  className="input-field"
                  name="duration"
                  onChange={(e) => setDuration(e.target.value)}
                  value={duration}
                  placeholder={placement.duration}
                  required
                />
              </div>
              <div className="detail">
                <label>Deadline:</label>
                <br />
                <input
                  type="date"
                  id="deadline"
                  className="input-field"
                  name="deadline"
                  onChange={(e) => setDeadline(e.target.value)}
                  value={deadline}
                />
              </div>
              <div className="detail">
                <label>Status:</label>
                <br />
                <select
                  id="status"
                  name="status"
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                  placeholder={placement.status}
                  required
                >
                  <option value="">Select a status</option>
                  {statusDropdown.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="detail">
                <label>Application Link:</label>
                <br />
                <input
                  type="url"
                  id="applicationLink"
                  className="input-field"
                  name="applicationLink"
                  placeholder={placement.placement_link}
                  onChange={(e) => setApplicationLink(e.target.value)}
                  value={applicationLink}
                />
              </div>
              <div className="detail">
                <label>CV:</label>
                <br />
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  onChange={(e) => setCv(e.target.files[0])}
                />
              </div>
              <div className="detail">
                <label>Cover Letter:</label>
                <br />
                <input
                  type="file"
                  id="coverLetter"
                  name="coverLetter"
                  onChange={(e) => setCoverLetter(e.target.files[0])}
                />
              </div>
              <div className="detail">
                <label>Contact:</label>
                <br />
                <input
                  type="text"
                  id="contact"
                  className="input-field"
                  name="contact"
                  onChange={(e) => setContact(e.target.value)}
                  value={contact}
                  placeholder={placement.contact}
                />
              </div>
              <div className="detail">
                <label>Date Applied:</label>
                <br />
                <input
                  type="date"
                  id="dateApplied"
                  className="input-field"
                  name="dateApplied"
                  onChange={(e) => setDateApplied(e.target.value)}
                  value={dateApplied}
                  placeholder={placement.description2}
                />
              </div>
            </div>
            <div className="textarea">
              <label>Description:</label>
              <br />
              <textarea
                type="text"
                id="description"
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </div>
            <div id="buttons">
              <button
                onClick={() => {
                  setConfirmation(true)
                }}
              >
                Save
              </button>
              <button
              onClick={() => {
                setEditing(false);
              }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmation && (
          <ConfirmationModal
          func={() => updatePlacement(placement.id, getPlacements, setShowModal)}
          method={"edit"}
          type={"Placement"}
          onClose={() => setConfirmation(false)}
          setEditing = {setEditing}
          ></ConfirmationModal>
        )}
    </div>
  );
}

export default PlacementModal;
