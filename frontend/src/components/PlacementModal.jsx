import "../styles/PlacementModal.css";

function PlacementModal({ placement, closeModal, showModal }) {
  const statusLabels = {
    applied: "Applied",
    phone_interview: "Phone Interview",
    face_to_face_interview: "Face to Face Interview",
    assessment: "Assessment",
    rejected: "Rejected",
    offer_made: "Offer Made",
    hired: "Hired",
    withdrawn: "Withdrawn",
  };

  return (
    <div id="modal-container" className={showModal ? "" : "hidden"}>
      <div id="modal-window">
        <button id="close-button" onClick={closeModal}>
          X
        </button>
        <div id="modal-content">
          <h2>Placement Details</h2>
          <p>
            <strong>Company:</strong> {placement.company}
          </p>
          <p>
            <strong>Role:</strong> {placement.role}
          </p>
          <p>
            <strong>Salary:</strong> {placement.salary}
          </p>
          <p>
            <strong>Starting Date:</strong> {placement.starting_date}
          </p>
          <p>
            <strong>Duration:</strong> {placement.duration}
          </p>
          <p>
            <strong>Deadline:</strong> {placement.next_stage_deadline}
          </p>
          <p>
            <strong>Status:</strong> {statusLabels[placement.status]}
          </p>
          <p>
            <strong>Application Link:</strong>{" "}
            <a
              href={placement.placement_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Listing
            </a>
          </p>
          {placement.cv && (
            <p>
              <strong>CV:</strong>{" "}
              <a href={placement.cv} target="_blank" rel="noopener noreferrer">
                View CV
              </a>
            </p>
          )}
          {placement.cover_letter && (
            <p>
              <strong>Cover Letter:</strong>{" "}
              <a
                href={placement.cover_letter}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Cover Letter
              </a>
            </p>
          )}
          <p>
            <strong>Contact:</strong> {placement.contact}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlacementModal;

{
  /*  */
}
