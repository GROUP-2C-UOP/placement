import "../styles/Placement.css";
import { useEffect, useState } from "react";
import PlacementModal from "./PlacementModal";

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

  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (placement) => {
    setSelectedPlacement(placement);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="placement-container" onClick={() => openModal(placement)}>
        <table>
          <thead className="placement-single">
            <tr className="table-row">
              <th className="placement-company">{placement.company}</th>
              <th className="placement-role">{placement.role}</th>
              <th className="placement-salary">{placement.salary}</th>
              <th className="placement-duration">{placement.duration}</th>
              <th className="placement-status">
                {statusLabels[placement.status]}
              </th>
              <th className="placement-contact">{placement.contact}</th>
              <th
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(placement.id);
                }}
              >
                Delete
              </th>
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
          ></PlacementModal>
        )}
      </div>
    </>
  );
}

export default Placement;
