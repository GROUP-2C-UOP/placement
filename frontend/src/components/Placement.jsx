import "../styles/Placement.css";
import { useState } from "react";
import PlacementModal from "./PlacementModal";

function Placement({
  placement,
  onDelete,
  statusLabels,
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
  getPlacements,
}) {
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (placement) => {
    setSelectedPlacement(placement);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const calculateRemaining = (placement) => {
    const today = new Date();
    const deadlineDate = new Date(placement.next_stage_deadline);
    const timeDifference = deadlineDate - today;
    let daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (placement.status === "rejected" || placement.status === "hired" || placement.status === "offer_made") {
      daysRemaining = "N/A"
    } 
    else if
    (daysRemaining < 0) {
      daysRemaining = "Deadline passed"
    }
    else if (daysRemaining === 0) {
      daysRemaining = "Today"
    }
    else if (daysRemaining === 1) {
      daysRemaining = `${daysRemaining} Day`
    } else {
      daysRemaining = `${daysRemaining} Days`
    }

    return daysRemaining;
  };

  return (
    <>
      <div
        className="placement-container"
        onClick={() => {
          openModal(placement);
          console.log(placement);
        }}
      >
        <table>
          <thead className="placement-single">
            <tr className="table-row">
              <th className="placement-company">{placement.company}</th>
              <th className="placement-role">{placement.role}</th>
              <th className="placement-status">
                {statusLabels[placement.status]}
              </th>
              <th className="placement-deadline">
                {calculateRemaining(placement)}
              </th>
              <th className="task-description">{placement.description}</th>
            </tr>
          </thead>
        </table>
      </div>
      <div>
        {showModal && (
          <PlacementModal
            placement={selectedPlacement}
            closeModal={closeModal}
            showModal={showModal}
            statusLabels={statusLabels}
            company={company}
            setCompany={setCompany}
            role={role}
            setRole={setRole}
            salary={salary}
            setSalary={setSalary}
            startingDate={startingDate}
            setStartingDate={setStartingDate}
            duration={duration}
            setDuration={setDuration}
            deadline={deadline}
            setDeadline={setDeadline}
            applicationLink={applicationLink}
            setApplicationLink={setApplicationLink}
            dateApplied={dateApplied}
            setDateApplied={setDateApplied}
            status={status}
            setStatus={setStatus}
            cv={cv}
            setCv={setCv}
            coverLetter={coverLetter}
            setCoverLetter={setCoverLetter}
            contact={contact}
            setContact={setContact}
            description={description}
            setDescription={setDescription}
            createPlacement={createPlacement}
            toClose={toClose}
            getPlacements={getPlacements}
            setShowModal={setShowModal}
            onDelete={() => onDelete(selectedPlacement.id)}
          />
        )}
      </div>
    </>
  );
}

export default Placement;
