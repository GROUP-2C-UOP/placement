import "../styles/AddModal.css";

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

  return (
    <div id="add-container">
      <div className="add-placement">
        <h2>Add Placement</h2>
        <button id="close-modal" onClick={toClose}>
          X
        </button>
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
            required
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
            required
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
          <label htmlFor="status">Status</label>
          <br />
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
          <br />
          <label htmlFor="cv">CV</label>
          <br />
          <input
            type="file"
            id="cv"
            name="cv"
            onChange={(e) => setCv(e.target.files[0])}
          />
          <br />
          <label htmlFor="coverLetter">Cover Letter</label>
          <br />
          <input
            type="file"
            id="coverLetter"
            name="coverLetter"
            onChange={(e) => setCoverLetter(e.target.files[0])}
          />
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
          <button id="add-placement-button" type="submit">
            Add Placement
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddModal;
