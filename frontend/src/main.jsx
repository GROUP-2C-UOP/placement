import { StrictMode } from 'react' //for debugging and highlighting potential problems
import { createRoot } from 'react-dom/client' //for rendering of the react app
import App from './App.jsx' //the actual app we created -- serves as the root component

createRoot(document.getElementById('root')).render( //select html element with root and render the react application within it
  <StrictMode> 
    <App />
  </StrictMode>,
)

//app is wrapped in strict mode to highlight warnings and for debugging