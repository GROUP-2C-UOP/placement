import { useLocation } from "react-router-dom";
import "../styles/Layout.css";
import NavBar from "./NavBar";

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
