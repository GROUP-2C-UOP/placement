import "../styles/AddModal.css";
import { useEffect, useState } from "react";

function AddModal({
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
  setDescription,
  createPlacement,
  toClose,
}) {
  const statusDropdown = [
    { label: "Applied", value: "applied" },
    { label: "Phone Interview", value: "phone_interview" },
    { label: "Face to Face Interview", value: "face_to_face_interview" },
    { label: "Assessment", value: "assessment" },
    { label: "Rejected", value: "rejected" },
    { label: "Withdrawn", value: "withdrawn" },
    { label: "Offer Made", value: "offer_made" },
  ];

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
    resetForm();
  }, []);

  const [fadeOutSave, setFadeOutSave] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFadeOutSave(true);
    setTimeout(() => {
      createPlacement(e);

      console.log("Company:", company);
      console.log("Role:", role);
      console.log("Salary:", salary);
      console.log("Starting Date:", startingDate);
      console.log("Duration:", duration);
      console.log("Deadline:", deadline);
      console.log("Application Link:", applicationLink);
      console.log("Date Applied:", dateApplied);
      console.log("Status:", status);
      console.log("CV:", cv ? cv.name : "No file uploaded");
      console.log(
        "Cover Letter:",
        coverLetter ? coverLetter.name : "No file uploaded"
      );
      console.log("Contact:", contact);
      console.log("Description:", description);
    }, 100);
  };

  const [fadeOut, setFadeOut] = useState(false);
  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      toClose();
    }, 100);
  };

  return (
    <div id="add-container">
      <div className={`add-placement ${fadeOut ? "fade-out" : ""} ${fadeOutSave ? "fade-out-save" : ""}`}>
        <h2 id="title">Add Placement</h2>
        <p>(Fields marked with * are required)</p>
        <button id="close-modal" className="close-button" onClick={handleClose}>
          <img src="src/assets/close.svg" />
        </button>
        <form onSubmit={handleSubmit}>
          <div className="grid-container">
            <div className="input-field">
              <label htmlFor="company">Company*</label>
              <input
                type="text"
                id="company"
                name="company"
                required
                onChange={(e) => setCompany(e.target.value)}
                value={company}
              />
            </div>
            <div className="input-field">
              <label htmlFor="role">Role*</label>
              <input
                type="text"
                id="role"
                name="role"
                required
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>
            <div className="input-field">
              <label htmlFor="dateApplied">Date Applied*</label>
              <input
                type="date"
                id="dateApplied"
                name="dateApplied"
                onChange={(e) => setDateApplied(e.target.value)}
                value={dateApplied}
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="status">Status*</label>
              <select
                id="status"
                name="status"
                onChange={(e) => setStatus(e.target.value)}
                value={status}
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
            <div className="input-field">
              <label htmlFor="deadline">Deadline for Status</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                onChange={(e) => setDeadline(e.target.value)}
                value={deadline}
              />
            </div>
            <div className="input-field">
              <label htmlFor="salary">Salary</label>
              <input
                type="number"
                id="salary"
                name="salary"
                onChange={(e) => setSalary(e.target.value)}
                value={salary}
              />
            </div>
            <div className="input-field">
              <label htmlFor="duration">Duration</label>
              <input
                type="number"
                id="duration"
                name="duration"
                onChange={(e) => setDuration(e.target.value)}
                value={duration}
              />
            </div>
            <div className="input-field">
              <label htmlFor="startingDate">Starting Date</label>
              <input
                type="date"
                id="startingDate"
                name="startingDate"
                onChange={(e) => setStartingDate(e.target.value)}
                value={startingDate}
              />
            </div>
            <div className="input-field">
              <label htmlFor="applicationLink">Application Link</label>
              <input
                type="url"
                id="applicationLink"
                name="applicationLink"
                onChange={(e) => setApplicationLink(e.target.value)}
                value={applicationLink}
              />
            </div>
            <div className="input-field">
              <label htmlFor="contact">Their Contact</label>
              <input
                type="text"
                id="contact"
                name="contact"
                onChange={(e) => setContact(e.target.value)}
                value={contact}
              />
            </div>
            <div className="input-field">
              <label htmlFor="cv">CV</label>
              <input
                type="file"
                id="cv"
                name="cv"
                onChange={(e) => setCv(e.target.files[0])}
              />
            </div>
            <div className="input-field">
              <label htmlFor="coverLetter">Cover Letter</label>
              <input
                type="file"
                id="coverLetter"
                name="coverLetter"
                onChange={(e) => setCoverLetter(e.target.files[0])}
              />
            </div>
          </div>
          <div id="desc-cont">
            <label htmlFor="description">Note</label>
            <textarea
              type="text"
              id="description"
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
          <button
            id="add-placement-button"
            className="save-button"
            type="submit"
          >
            <img src="src/assets/save.svg" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddModal;
