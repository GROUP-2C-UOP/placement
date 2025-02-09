import "../styles/ConfirmationModal.css"

function ConfirmationModal({ func, method, type, onClose, setEditing }) {
  const handleConfirm = () => {
    if (func) {
      func();
      onClose()
    }
    if (method === "edit"){
        setEditing(false)
    }
  };

  return (
    <div id="overlay">
      <div id="m-container">
        <div id="q">
          <p>
            Are you sure you want to {method} this {type}?
          </p>
        </div>
        <div id="b">
          <button className="conf-buttons" onClick={handleConfirm}>Confirm</button>
          <button className="conf-buttons" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
