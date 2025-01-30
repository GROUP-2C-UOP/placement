import "../styles/Placement.css";

function Placement({ placement, onDelete }) {

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
    <div className="placement-container">
      <div className="placement-single">
        <p className="placement-company">{placement.company}</p>
        <p className="placement-role">{placement.role}</p>
        <p className="placement-salary">{placement.salary}</p>
        <p className="placement-starting-date">{placement.starting_date}</p>
        <p className="placement-duration">{placement.duration}</p>
        <p className="placement-deadline">{placement.next_stage_deadline}</p>
        <p className="placement-application-link">
          <a
            href={placement.placement_link}
            target="blank"
            rel="noopener noreferrer"
          >
            {placement.placement_link}
          </a>
        </p>
        <p className="placement-date-applied">{placement.date_applied}</p>
        <p className="placement-status">{statusLabels[placement.status]}</p>
        {placement.cv && (
          <p className="placement-cv">
            <a href={placement.cv} target="_blank" rel="noopener noreferrer">CV</a>
          </p>
        )}
        {placement.cover_letter && (
          <p className="placement-cover-letter">
            <a href={placement.cover_letter} target="_blank" rel="noopener noreferrer">Cover Letter</a>
          </p>
        )}
        <p className="placement-contact">{placement.contact}</p>

        <button
          className="delete-button"
          onClick={() => onDelete(placement.id)}
        >
          Delete
        </button>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

export default Placement;
