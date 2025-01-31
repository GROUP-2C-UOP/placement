import "../styles/Placement.css";
import { useState } from "react";
import PlacementModal from "./PlacementModal";

function Placement({ placement, onDelete, statusLabels}) {
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
            onDelete={() => {onDelete(selectedPlacement.id)}}
          ></PlacementModal>
        )}
      </div>
    </>
  );
}

export default Placement;
