import "../styles/FilterModal.css";
import { useState } from "react";

function FilterModal({
  setShowFilter,
  placementsInProgress,
  setFilterRoles,
  setIsFiltered,
  filteredPlacementsInProg,
}) {
  const placementRoles = new Set();

  for (const placement of placementsInProgress) {
    placementRoles.add(placement.role);
  }

  const [selectedRoles, setSelectedRoles] = useState(new Set());
  const [fadeOutFilter, setFadeOutFilter] = useState(false);

  const handleRoleChange = (role) => {
    const newSelectedRoles = new Set(selectedRoles);
    if (newSelectedRoles.has(role)) {
      newSelectedRoles.delete(role);
    } else {
      newSelectedRoles.add(role);
    }
    setSelectedRoles(newSelectedRoles);
  };

  const handleSave = () => {
    if (selectedRoles.size === 0) {
      alert("Please select at least one role.");
    } else {
      setFadeOutFilter(true);
      setTimeout(() => {
        setFilterRoles([...selectedRoles]);
        setIsFiltered(true);
        setShowFilter(false);
      }, 100);
    }
  };

  const handleCloseFilter = () => {
    setFadeOutFilter(true);
    setTimeout(() => {
      setShowFilter(false);
    }, 100);
  };

  const handleClearFilter = () => {
    setFadeOutFilter(true);
    setTimeout(() => {
      setSelectedRoles(new Set());
      setFilterRoles([]);
      setIsFiltered(false);
      setShowFilter(false);
    }, 100);
  };

  return (
    <div id="overlay" className={fadeOutFilter ? "fade-out-filter" : ""}>
      <div
        id="filter-modal-window"
        className={fadeOutFilter ? "fade-out-filter" : ""}
      >
        <button className="close-button" onClick={handleCloseFilter}>
          <img src="src/assets/close.svg" alt="Close" />
        </button>
        <button className="clear-filter" onClick={handleClearFilter}>
          <img src="src/assets/clear.svg" />
        </button>
        <h2>Filter Placements</h2>
        <div id="filter-options">
          <p>By Role</p>
          <div id="roles">
            {[...placementRoles].map((role) => (
              <label key={role}>
                <input
                  type="checkbox"
                  onChange={() => handleRoleChange(role)}
                />
                {role}
              </label>
            ))}
          </div>
        </div>
        <div id="update-buttons">
          <button className="save-button filt-but" onClick={handleSave}>
            <img src="src/assets/save.svg" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
