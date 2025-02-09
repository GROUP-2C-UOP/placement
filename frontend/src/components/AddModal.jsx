import "../styles/AddModal.css";
import { useEffect } from "react";

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
    { label: "Offer Made", value: "offer_made" },
    { label: "Hired", value: "hired" },
    { label: "Withdrawn", value: "withdrawn" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    createPlacement(e);

    setCompany("");
    setRole("");
    setSalary("");
    setStartingDate("");
    setDuration("");
    setDeadline("");
    setStatus("");
    setApplicationLink("");
    setContact("");
    setDateApplied("");
    setDescription("");
  };

  return (
    <div id="add-container">
      <div className="add-placement">
        <h2>Add Placement</h2>
        <button id="close-modal" onClick={toClose}>
          X
        </button>
        <form onSubmit={handleSubmit}>
          <div className="grid-container">
            <div className="input-field">
              <label htmlFor="company">Company</label>
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
              <label htmlFor="role">Role</label>
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
              <label htmlFor="salary">Salary</label>
              <input
                type="number"
                id="salary"
                name="salary"
                onChange={(e) => setSalary(e.target.value)}
                value={salary}
                required
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
              <label htmlFor="duration">Duration</label>
              <input
                type="number"
                id="duration"
                name="duration"
                onChange={(e) => setDuration(e.target.value)}
                value={duration}
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="deadline">Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                onChange={(e) => setDeadline(e.target.value)}
                value={deadline}
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
              <label htmlFor="dateApplied">Date Applied</label>
              <input
                type="date"
                id="dateApplied"
                name="dateApplied"
                onChange={(e) => setDateApplied(e.target.value)}
                value={dateApplied}
              />
            </div>
            <div className="input-field">
              <label htmlFor="status">Status</label>
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
          </div>

          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            id="description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />

          <button id="add-placement-button" type="submit">
            Add Placement
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddModal;
