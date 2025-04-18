import "../styles/AddModal.css";
import { useEffect, useState } from "react";

/**
 * Function for creating new placements and todo objects through a form
 * 
 * Params:
 * UseState variables passed from parent function - Relevant to placements and todo objects e.g company = company of placement and todo object
 * create parameter = function to trigger necessary endpoint to create placement/todo object
 * toClose parameter = function to attatch to the close button in order to remove the AddModal from the screen
 * type parameter = variable used to dictate what fields should be displayed (some placement fields aren't necessary for a todo object)
 */


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
  create,
  toClose,
  type,
}) {
  // Dropdown options for the "status" field
  const statusDropdown = [
    { label: "Applied", value: "applied" },
    { label: "Phone Interview", value: "phone_interview" },
    { label: "Face to Face Interview", value: "face_to_face_interview" },
    { label: "Assessment", value: "assessment" },
    { label: "Rejected", value: "rejected" },
    { label: "Withdrawn", value: "withdrawn" },
    { label: "Offer Made", value: "offer_made" },
  ];

  /**
   * Determines the CSS class name for the modal
   * toDoModal is "todo-mod" if type is "todo" otherwise its an empty string 
   */
  const todoModal = type === "todo" ? "todo-mod" : ""

  /**
   * Resets all form fields to their initial state
   * Ensures that the form is cleared when the modal is opened since we are reusing UseState variables from the parent function
   */
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

  /**
   * Runs the resetForm function when the component is rendered
   * Ensures the form is cleared every time the modal is displayed
   */
  useEffect(() => {
    resetForm();
  }, []);

  /**
   * State to control the fade-out animation when submitting a form successfully
   */
  const [fadeOutSave, setFadeOutSave] = useState(false);

    /**
   * Handles the form submission
   * 
   * e param - The event object from the form submission. 
   * e.preventDefault() - Prevents the default form submit behaviour (e.g. page load)
   * setFadeOutSave(true)- Triggers a fade-out animation by setting fadeOutSave to true
   * setTimeout(...  ) - Waits 100ms (for animation effect), then calls the create function passed from the parent
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setFadeOutSave(true);
    setTimeout(() => {
      create(e);
    }, 100);
  };

   /**
   * State to control the fade-out animation when closing the modal
   */
  const [fadeOut, setFadeOut] = useState(false);
  
   /**
   * Handles behaviour when closing modal
   * 
   * setFadeOut(true) - Sets fadeOut to true to trigger the fade-out animation
   * setTimeout(...  ) - Waits 100ms before calling the toClose function from parent to remove the modal from the screen
   */
  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      toClose();
    }, 100);
  };

  /**
   * Local state variables to handle the label attatched to the CV and CoverLetter fields
   */
  const [cvName, setCvName] = useState("Choose CV");
  const [coverLetterName, setCoverLetterName] = useState("Choose Cover Letter");

  /**
   * Handles change event for CV file input
   * 
   * Extracts file from the input and updates cv state from props with the selected file
   * Updates cvName state to show file name on the associated label
   */
  const handleCvChange = (e) => {
    const file = e.target.files[0];
    setCv(file);
    setCvName(file ? file.name : "Choose CV");
  };

  /**
   * Handles change event for Cover Letter file input
   * 
   * Extracts file from the input and updates cover letter state from props with the selected file
   * Updates coverLetterName state to show file name on the associated label
   */
  const handleCoverLetterChange = (e) => {
    const file = e.target.files[0];
    setCoverLetter(file);
    setCoverLetterName(file ? file.name : "Choose Cover Letter");
  };


  return (
    <div id="add-container">
      <div
        className={`add-placement ${fadeOut ? "fade-out" : ""} ${
          fadeOutSave ? "fade-out-save" : ""
        } ${todoModal}`}
      >
        <h2 id="title">Add Placement</h2>
        <p>(Fields marked with * are required)</p>
        <button id="close-modal" className="close-button" onClick={handleClose}>
          <img src="src/assets/close.svg" />
        </button>
        <form onSubmit={handleSubmit} id="add-placement-form">
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
            {type === "placement" && (
              <>
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
              <label htmlFor="deadline">Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                onChange={(e) => setDeadline(e.target.value)}
                value={deadline}
                
              />
            </div>
            </>
            )}
            {type === "todo" && (
              <div className="input-field">
              <label htmlFor="deadline">Deadline*</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                onChange={(e) => setDeadline(e.target.value)}
                value={deadline}
                required
              />
            </div>
            )}
            {type === "placememt" && (
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
            )}
            
            <div className="input-field">
              <label htmlFor="salary">Salary</label>
              <input
                type="number"
                id="salary"
                name="salary"
                onChange={(e) => setSalary(e.target.value)}
                onBlur={(e) => {
                  let value = parseInt(e.target.value, 10);
                  if (isNaN(value) || value < 0) value = "";
                  setSalary(value);
                }}
                value={salary}
                min="0"
              />
            </div>
            <div className="input-field">
              <label htmlFor="duration">Duration (Months)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                onChange={(e) => setDuration(e.target.value)}
                onBlur={(e) => {
                  let value = parseInt(e.target.value, 10);
                  if (isNaN(value) || value < 0) value = "";
                  setSalary(value);
                }}
                value={duration}
                min="0"
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
            {type === "placement" && (
              <>
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
              <label htmlFor="cv" className="label-button">
                {cvName}
              </label>
              <input
                type="file"
                id="cv"
                className="hide"
                name="cv"
                onChange={handleCvChange}
              />
            </div>
            <div className="input-field">
              <label htmlFor="coverLetter">Cover Letter</label>
              <label htmlFor="coverLetter" className="label-button">
                {coverLetterName}
              </label>
              <input
                type="file"
                id="coverLetter"
                className="hide"
                name="coverLetter"
                onChange={handleCoverLetterChange}
              />
            </div>
            </>
            )
          }
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
