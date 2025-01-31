import "../styles/PlacementModal.css";
import { statusLabels } from "../constants";

function PlacementModal({ placement, closeModal, showModal, statusLabels, onDelete }) {
  return (
    <div id="modal-container" className={showModal ? "" : "hidden"}>
      <div id="modal-window">
        <button id="close-button" onClick={closeModal}>
          X
        </button>
        <h2 id="general-title">Placement Details</h2>
        <div id="modal-content">
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
              <a href={placement.cv} target="_blank" rel="noopener noreferrer">
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
        </div>
        <div id="buttons">
          <button onClick={() => onDelete(placement.id)}>Delete</button>
          <button onClick={() => alert("TBI")}>Edit</button>
        </div>
      </div>
    </div>
  );
}

export default PlacementModal;
