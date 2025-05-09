import { useEffect } from "react";
import "../styles/Error.css";

/**
 * Displays error message that automatically disappears after 3 seconds, for usability purposes
 *
 * Params:
 * - message: error text to be displayed
 * - setShowError: useState function used to hide component
 */
function ErrorMessage({ message, setShowError }) {
    useEffect(() => {
        const timer = setTimeout(() => {
          setShowError(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }, [setShowError]);
    
  return (
    <div id="message-container">
      <button
        id="close-button"
        onClick={() => {
          setShowError(false);
        }}
      >
        <img src="src/assets/close.svg" />
      </button>
      <div>
        <p id="message">{message}</p>
      </div>
    </div>
  );
}

export default ErrorMessage;


