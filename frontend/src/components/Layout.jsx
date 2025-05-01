import { useLocation } from "react-router-dom";
import "../styles/Layout.css";
import NavBar from "./NavBar";


/**
 * Layout wrapper for all pages (explicitly excluding login and register pages) to include the navbar without repetitively importing in each individual page
 */
function Layout({ children }) {
  const location = useLocation();
  const hideNavPages = ["/login", "/register"];

  return (
    <div>
      {!hideNavPages.includes(location.pathname) && <NavBar />}
      <main>{children}</main>
    </div>
  );
}

export default Layout;
