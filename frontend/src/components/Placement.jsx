import "../styles/Placement.css";
import { useState } from "react";
import PlacementModal from "./PlacementModal";
import { icons } from "../constants";

/**
 * Placement component that displays individual placement cards; all brought together within placementspage.jsx
 * 
 * Props:
 * - placement: Object containing all placement data
 * - onDelete: fucntion for placement deletion
 * - statusLabels: Object mapping status values to display labels
 * - company...description: State values and setters for placement attributes
 * - createPlacement: function for creating new placements inherited from parent
 * - toClose: Function for closing the modal inherited from parent
 * - getPlacements: function for getting all the placements; inherited from parent
 * - isDashboard: Boolean indicating if placmeent is displayed on dashboard
 * - placementType: String indicating placement status type; todo vs actual placement
 */
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
  placementType,
}) {
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  //dynamically setting the classes based on whether it the placement is displayed on the dashboard or not
  const containerClass = isDashboard
    ? "placement-container-dashboard"
    : "placement-container-home";
  const spacingClass = isDashboard ? "dashboard-spacing" : "home-spacing";
  const placementTypeSpacing =
    placementType === "rejected"
      ? "rejected-spacing"
      : placementType === "accepted"
      ? "accepted-spacing"
      : "home-spacing";

  const openModal = (placement) => {
    setSelectedPlacement(placement);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  //function for calculating the days remaining for the deadline; takes the placement object containing the deadline info and returns a formatted remaining time string in days
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
    if (placement.next_stage_deadline === null) {
      return "N/A"
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

  //function for determining the css class based on deadline, for applying the appropriate colour to the days remaining column
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
          <thead className={`${spacingClass} ${placementTypeSpacing}`}>
            <tr className="table-row">
              <th className="placement-company">{placement.company}</th>
              {!isDashboard && (
                <th className="placement-role">{placement.role}</th>
              )}
              {placementType !== "rejected" && placementType !== "accepted" && (
                <>
                  <th id="icon-cont" className="placement-status">
                    <img
                      src={icons[placement.status].src}
                      id={icons[placement.status].id}
                      className={icons[placement.status].class}
                      title={icons[placement.status].title}
                    />
                  </th>
                  <th
                    className={`placement-deadline ${getDeadlineClass(
                      placement
                    )}`}
                  >
                    {calculateRemaining(placement)}
                  </th>
                </>
              )}
              {placementType === "accepted" && (
                <>
                  <th className="placement-status">
                    {placement.starting_date}
                  </th>
                </>
              )}
              {!isDashboard && (
                <th className="task-description">
                  {placement.description === "null"
                    ? ""
                    : placement.description}
                </th>
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
            pplied={dateApplied}
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
            isDashboard={isDashboard}
            type = "placement"
            onDelete={() => onDelete(selectedPlacement.id)}
          />
        )}
      </div>
    </>
  );
}

export default Placement;
