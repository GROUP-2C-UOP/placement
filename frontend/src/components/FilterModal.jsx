import { useState } from "react";
import { Range } from "react-range";

function FilterModal({ setShowFilter, placementsInProgress }) {
  const placementRoles = new Set();

  for (const placement of placementsInProgress) {
    placementRoles.add(placement.role);
  }

  const days = [];

  for (const placement of placementsInProgress) {
    const today = new Date();
    const deadlineDate = new Date(placement.next_stage_deadline);
    const timeDifference = deadlineDate - today;
    let daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    days.push(daysRemaining);
  }

  const [showRoles, setShowRoles] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const minRange = Math.min(...days);
  const maxRange = Math.max(...days);

  // Define the values state for the Range component (two values for two thumbs)
  const [values, setValues] = useState([minRange, maxRange]); // Set initial values to minRange and maxRange

  return (
    <div>
      <div id="modal-window" className="update">
        <button className="close-button" onClick={() => setShowFilter(false)}>
          <img src="src/assets/close.svg" alt="Close" />
        </button>
        <h2>Filter Placements</h2>
        <button
          onClick={() => {
            setShowRoles(!showRoles);
          }}
        >
          By Role
        </button>
        {showRoles &&
          [...placementRoles].map((role) => (
            <label key={role}>
              <input type="checkbox" />
              {role}
            </label>
          ))}
        <button
          onClick={() => {
            setShowSlider(!showSlider);
          }}
        >
          By Days Remaining
        </button>
        {showSlider && (
          <div>
            <Range
              label="Select your value"
              step={1}
              min={minRange}
              max={maxRange}
              values={values}
              onChange={(newValues) => setValues(newValues)}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "6px",
                    width: "100%",
                    backgroundColor: "#ccc",
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props, index }) => (
                <div
                  {...props}
                  key={props.key}
                  style={{
                    ...props.style,
                    height: "22px",
                    width: "22px",
                    backgroundColor: index === 0 ? "#999" : "#666", // Different colors for each thumb
                  }}
                />
              )}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Min: {values[0]}</span>
              <span>Max: {values[1]}</span>
            </div>
          </div>
        )}
        <div id="update-buttons">
          <button
            className="save-button"
            onClick={() => {
              console.log([...placementRoles]);
              console.log(minRange);
              console.log(maxRange);
            }}
          >
            <img src="src/assets/save.svg" alt="Save" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
