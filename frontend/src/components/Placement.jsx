import "../styles/Placement.css";

function Placement({ placement, onDelete }) {
  return (
    <div className="placement-container">
      <div className="placement-single">
        <p className="placement-company">{placement.company}</p>
        <p className="placement-role">{placement.role}</p>
        <p className="placement-salary">{placement.salary}</p>
        <p className="placement-starting-date">{placement.starting_date}</p>
        <p className="placement-duration">{placement.duration}</p>
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
