import "../styles/PlacementModal.css";
import { statusLabels } from "../constants";
import { useState, useEffect } from "react";
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
  const [confirmation, setConfirmation] = useState(false);
  const [update, setUpdate] = useState(false);
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

  const resetForm = () => {
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
  };

  useEffect(() => {
    if (editing && !isDashboard) {
      resetForm();
    }
  }, [editing]);

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
          getPlacements();
          setShowModal(false);
          resetForm();
        } else alert("Something went wrong, try again.");
      })
      .catch((error) => {
        console.error("Update failed", error);
        alert("Failed, check console");
      });
  };

  useEffect(() => {
    if (showModal && !isDashboard) {
      setDescription(
        placement.description === "null" ? "" : placement.description
      );
      setStatus(placement.status);
      setDeadline(placement.next_stage_deadline);
    }
  }, [showModal, placement.description, placement.status, placement.deadline]);

  return (
    <div>
      {!editing && (
        <div className={`${showModal ? "" : "hidden"} ${modalType}`}>
          <div
            id="modal-window"
            className={isDashboard ? "dashboard-modal-window" : ""}
          >
            <button class="close-button" onClick={closeModal}>
              <img src="src/assets/close.svg" />
            </button>
            {!isDashboard && (
              <>
                <button
                  id="edit-button"
                  onClick={() => {
                    setEditing(true);
                  }}
                >
                  <img src="src/assets/edit.svg" />
                </button>
                <button
                  id="delete-button"
                  onClick={() => {
                    setConfirmation(true);
                  }}
                >
                  <img src="src/assets/bin.svg" />
                </button>
              </>
            )}
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
                {placement.salary === "null" ? "" : placement.salary || ""}
              </div>
              <div className="detail">
                <label>Starting Date:</label>
                <br />
                {placement.starting_date === "null"
                  ? ""
                  : new Date(placement.starting_date).toLocaleDateString(
                      "en-GB"
                    ) || ""}
              </div>
              <div className="detail">
                <label>Duration:</label>
                <br />
                {placement.duration === "null" ? "" : placement.duration || ""}
              </div>
              <div className="detail">
                <label>Deadline:</label>
                <br />
                {placement.next_stage_deadline === "null"
                  ? ""
                  : new Date(placement.next_stage_deadline).toLocaleDateString(
                      "en-GB"
                    ) || ""}
              </div>
              <div className="detail">
                <label>Status:</label>
                <br />
                {statusLabels[placement.status]}
              </div>
              <div className="detail">
                <label>Application Link:</label>
                <br />
                {placement.placement_link &&
                placement.placement_link !== "null" ? (
                  <a
                    href={placement.placement_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Listing
                  </a>
                ) : (
                  ""
                )}
              </div>
              <div className="detail">
                <label>CV:</label>
                <br />
                {placement.cv && placement.cv !== "null" ? (
                  <a
                    href={placement.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View CV
                  </a>
                ) : (
                  ""
                )}
              </div>
              <div className="detail">
                <label>Cover Letter:</label>
                <br />
                {placement.cover_letter && placement.cover_letter !== "null" ? (
                  <a
                    href={placement.cover_letter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Cover Letter
                  </a>
                ) : (
                  ""
                )}
              </div>
              <div className="detail">
                <label>Contact:</label>
                <br />
                {placement.contact === "null" ? "" : placement.contact || ""}
              </div>
              <div className="detail">
                <label>Date Applied:</label>
                <br />
                {new Date(placement.date_applied).toLocaleDateString("en-GB")}
              </div>
              {placement.description && placement.description !== "null" && (
                <div className="detail" id="note-on-modal">
                  <label>Note</label>
                  <br />
                  {placement.description}
                </div>
              )}
            </div>
            {!isDashboard && (
              <div id="buttons">
                <button
                  id="update-button"
                  onClick={() => {
                    setUpdate(true);
                  }}
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {update && (
        <div className={`${showModal ? "" : "hidden"} ${modalType}`}>
          <div id="modal-window" className="update">
            <button
              class="close-button"
              onClick={() => {
                setUpdate(false);
              }}
            >
              <img src="src/assets/close.svg" />
            </button>
            <h2 id="general-title">Update Stage</h2>
            <div id="modal-content" className="updateChoicesDiv">
              <div className="detailU">
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
              <div className="detailU">
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
            </div>
            <div className="textarea">
              <label>Note:</label>
              <br />
              <textarea
                type="text"
                id="description"
                name="description"
                onChange={(e) =>
                  setDescription(e.target.value === "" ? null : e.target.value)
                }
                value={description}
              />
            </div>
            <div id="update-buttons">
              <button
                className="save-button"
                onClick={() => {
                  updatePlacement(placement.id, getPlacements, setShowModal);
                  console.log(placement.description);
                }}
              >
                <img src="src/assets/save.svg" />
              </button>
            </div>
          </div>
        </div>
      )}
      {editing && (
        <div className={`${showModal ? "" : "hidden"} ${modalType}`}>
          <div id="modal-window" className="editing-window">
            <button
              class="close-button"
              onClick={() => {
                setEditing(false);
              }}
            >
              <img src="src/assets/close.svg" />
            </button>
            <h2 id="general-title">Placement Details</h2>
            <div id="modal-content">
              <div className="detailU">
                <label>Company:</label>

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
              <div className="detailU">
                <label>Role:</label>

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
              <div className="detailU">
                <label>Salary:</label>

                <input
                  type="number"
                  id="salary"
                  className="input-field"
                  name="salary"
                  onChange={(e) => setSalary(e.target.value)}
                  value={salary}
                  placeholder={
                    placement.salary === "null" ? "" : placement.salary || ""
                  }
                  required
                />
              </div>
              <div className="detailU">
                <label>Starting Date:</label>

                <input
                  type="date"
                  id="startingDate"
                  className="input-field"
                  name="startingDate"
                  onChange={(e) => setStartingDate(e.target.value)}
                  value={startingDate}
                />
              </div>
              <div className="detailU">
                <label>Duration:</label>

                <input
                  type="number"
                  id="duration"
                  className="input-field"
                  name="duration"
                  onChange={(e) => setDuration(e.target.value)}
                  value={duration}
                  placeholder={
                    placement.duration === "null"
                      ? ""
                      : placement.duration || ""
                  }
                  required
                />
              </div>
              <div className="detailU">
                <label>Application Link:</label>

                <input
                  type="url"
                  id="applicationLink"
                  className="input-field"
                  name="applicationLink"
                  placeholder={
                    placement.placement_link === "null"
                      ? ""
                      : placement.placement_link || ""
                  }
                  onChange={(e) => setApplicationLink(e.target.value)}
                  value={applicationLink}
                />
              </div>
              <div className="detailU">
                <label>Change CV:</label>
                {placement.cv && (
                  <div>
                    <a
                      href={placement.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View existing CV
                    </a>
                  </div>
                )}
                <br />
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  onChange={(e) => setCv(e.target.files[0])}
                />
              </div>
              <div className="detailU">
                <label>Change Cover Letter:</label>
                {placement.cover_letter && (
                  <div>
                    <a
                      href={placement.cover_letter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View existing Cover Letter
                    </a>
                  </div>
                )}
                <br />
                <input
                  type="file"
                  id="coverLetter"
                  name="coverLetter"
                  onChange={(e) => setCoverLetter(e.target.files[0])}
                />
              </div>
              <div className="detailU">
                <label>Contact:</label>

                <input
                  type="text"
                  id="contact"
                  className="input-field"
                  name="contact"
                  onChange={(e) => setContact(e.target.value)}
                  value={contact}
                  placeholder={
                    placement.contact === "null" ? "" : placement.contact || ""
                  }
                />
              </div>
              <div className="detailU">
                <label>Date Applied:</label>
                <input
                  type="date"
                  id="dateApplied"
                  className="input-field"
                  name="dateApplied"
                  onChange={(e) => setDateApplied(e.target.value)}
                  value={dateApplied}
                  placeholder={placement.date_applied}
                />
              </div>
            </div>
            <div id="buttons">
              <button
                className="save-button"
                onClick={() => {
                  setConfirmation(true);
                }}
              >
                <img src="src/assets/save.svg" />
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmation && (
        <ConfirmationModal
          func={
            editing
              ? () => updatePlacement(placement.id, getPlacements, setShowModal)
              : onDelete
          }
          method={editing ? "edit" : "delete"}
          type={"Placement"}
          onClose={() => setConfirmation(false)}
          setEditing={setEditing}
        />
      )}
    </div>
  );
}

export default PlacementModal;
