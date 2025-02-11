

function FilterModal({ setShowFilter, placementsInProgress }) {
  const placementCompanies = new Set();

  for (const placement of placementsInProgress) {
    placementCompanies.add(placement.company);
  }

  return (
    <div>
      <div id="modal-window" className="update">
        <button className="close-button" onClick={() => setShowFilter(false)}>
          <img src="src/assets/close.svg" alt="Close" />
        </button>
        <h2>Filter Placements</h2>
        {[...placementCompanies].map((company) => (
          <label key={company}>
            <input type="checkbox" />
            {company}
          </label>
        ))}

        <div id="update-buttons">
          <button
            className="save-button"
            onClick={() => console.log([...placementCompanies])}
          >
            <img src="src/assets/save.svg" alt="Save" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
