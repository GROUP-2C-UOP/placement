import "../styles/ConfirmationModal.css";
import { useState } from "react";

/**
 * Displays a popup to confirm imporant actions (e.g deleting or updating a placement)
 *
 * Params:
 * - func: function to execute when user confirms the action 
 * - method: string describing the action ("delete", "complete") to specify what the pop up should say
 * - type: string representing what is being affected ("placement", "application") to specify what the pop up should say
 * - onClose: function to close the pop up if the action is not confirmed
 * - message: message to show below the main confirmation text 
 */

function ConfirmationModal({
  func,
  method,
  type,
  onClose,
  message,
}) {
  //State for triggering the fade out animation
  const [fadeOutConfirmation, setFadeOutConfirmation] = useState(false);

  /**
   * Handles closing the modal with a fade-out animation
   * After 100ms the modal is closed
   */
  const closeConf = () => {
    setFadeOutConfirmation(true);
    setTimeout(() => {
      onClose();
    }, 100);
  };

  /**
   * Called when user confirms action
   * If func exists, it is called, and the modal is closed
   */
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
