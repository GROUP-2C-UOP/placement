import "../styles/FilterModal.css";
import { useState } from "react";

/**
 * Modal for handling filtering of placements and todos
 * 
 * Params:
 * - setShowFilter: useState function used to hide modal
 * - placementsInProgress: list, used for both todos and placements (all todos and placements are filtered by status in parent component)
 * - setFilterRoles: useState function to update selected roles to filter by
 * - setIsFiltered: useState function to toggle if the placements are filtered
 * - filteredPlacementsInProgress: current list of filtered placements/todos (used to pre-check boxes)
 */
function FilterModal({
  setShowFilter,
  placementsInProgress,
  setFilterRoles,
  setIsFiltered,
  filteredPlacementsInProgress, 
}) {
  //Set of unique roles from the current placements/todos
  const placementRoles = new Set(placementsInProgress.map((p) => p.role));

  //States for fade out animation and selected roles
  const [fadeOutFilter, setFadeOutFilter] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(
    new Set(filteredPlacementsInProgress?.map((p) => p.role) || []) 
  );

    /**
   * Toggles selection of a role checkbox
   * 
   * Takes the clicked role and either adds it to or removes it from the selectedRoles set, then updates the state with the new selection.
   */
  const handleRoleChange = (role) => {
    const newSelectedRoles = new Set(selectedRoles);
    if (newSelectedRoles.has(role)) {
      newSelectedRoles.delete(role);
    } else {
      newSelectedRoles.add(role);
    }
    setSelectedRoles(newSelectedRoles);
  };

  /**
   * Saves selected roles and applies filter
   * 
   * If no roles selected, raises an alert
   * Otherwise triggers the fadeout animation and after 100ms, updates filter with the selected roles, sets the filter state to true and closes the filter modal
   */
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

  /**
   * Logic for closing the filter modal
   * 
   * Triggers the fadeout animation and after 100ms sets showFilter to false to close the modal
   */
  const handleCloseFilter = () => {
    setFadeOutFilter(true);
    setTimeout(() => {
      setShowFilter(false);
    }, 100);
  };

  /**
   * Logic for clear button which clears all selected roles, resetting the filter
   * 
   * Triggers the fade out animation and after 100ms. resets the selected roles, clears the filterroles list, sets isFiltered to false and closes the filter modal
   */
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
      <div id="filter-modal-window" className={fadeOutFilter ? "fade-out-filter" : ""}>
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
                  checked={selectedRoles.has(role)} 
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
