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
  isDashboard,
}) {
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const containerClass = isDashboard
    ? "placement-container-dashboard"
    : "placement-container-home";
  const spacingClass = isDashboard
    ? "dashboard-spacing"
    : "home-spacing";

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

    if (
      placement.status === "rejected" ||
      placement.status === "hired" ||
      placement.status === "offer_made"
    ) {
      return "N/A";
    }
    if (daysRemaining < 0) {
      return "Deadline passed";
    }
    if (daysRemaining === 0) {
      return "Today";
    }
    if (daysRemaining === 1) {
      return `1 Day`;
    }

    return `${daysRemaining} Days`;
  };

  const getDeadlineClass = (placement) => {
    const remainingTime = calculateRemaining(placement);

    if (remainingTime === "Today" || remainingTime === "1 Day") {
      return "red";
    }
    if (remainingTime === "Deadline passed" || remainingTime === "N/A") {
      return "";
    }

    const daysRemaining = parseInt(remainingTime);

    if (daysRemaining < 3) {
      return "red";
    }
    if (daysRemaining <= 5) {
      return "orange";
    }
    return "green";
  };

  return (
    <>
      <div
        className={containerClass}
        onClick={() => {
          openModal(placement);
          console.log(placement);
        }}
      >
        <table>
          <thead className={spacingClass}>
            <tr className="table-row">
              <th className="placement-company">{placement.company}</th>
              {!isDashboard && (
                <th className="placement-role">{placement.role}</th>
              )}

              <th className="placement-status">
                {statusLabels[placement.status]}
              </th>
              <th
                className={`placement-deadline ${getDeadlineClass(placement)}`}
              >
                {calculateRemaining(placement)}
              </th>
              {!isDashboard && (
                <th className="task-description">{placement.description}</th>
              )}
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
