import "../styles/ConfirmationModal.css";
import { useState } from "react";

function ConfirmationModal({
  func,
  method,
  type,
  onClose,
  setEditing,
  message,
}) {
  const [fadeOutConfirmation, setFadeOutConfirmation] = useState(false);

  const closeConf = () => {
    setFadeOutConfirmation(true);
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleConfirm = () => {
    if (func) {
      func();
      closeConf();
    }
  };

  return (
    <div
      id="overlay"
      className={`${fadeOutConfirmation ? "fade-out" : ""} ${
        method !== "complete" ? "blurred" : ""
      }`}
    >
      <div
        id="m-container"
        className={`${fadeOutConfirmation ? "fade-out" : ""} ${
          method === "complete" ? "blurred" : ""
        }`}
      >
        <div id="q">
          <p>
            Are you sure you want to {method} this {type}?
          </p>
          <p id="sub">{message || ""}</p>
        </div>
        <div id="b">
          <button className="conf-buttons" id="conf" onClick={handleConfirm}>
            Confirm
          </button>
          <button className="conf-buttons" id="dec" onClick={closeConf}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
