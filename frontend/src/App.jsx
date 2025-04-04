//IMPORT ALL THE PAGES FROM THEIR RESPECCTIVE FILES

import react from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; //for navigation between pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import PlacementsPage from "./pages/PlacementsPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import ToDoPage from "./pages/ToDoPage";
import Account from "./pages/Account";

//function to handle user logout -- clears local storage removing access and refresh tokens and redirects to login page
function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

//function for registration, first clear storage removing tokens then take user to the registration page
function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

//the main application component thaty defines the routing structure between pages
function App() {
  return (
    <BrowserRouter> {/* enables routing within application*/}
      <Routes> {/* defines different routes within the app */}
        <Route
          path="/placements" //the path within the url that loads the element
          element={  //define the element to be rendered
            <ProtectedRoute> {/* wrapped in protected route that prohibits user from accessing the route if they do not have a valid access token, this is for security so non registered users cant access authorised pages */}
              <Layout> {/* wrapped in layout so the navbar doesnt have to be loaded within every single page*/}
                <PlacementsPage /> {/* the actual page that should be rendered */}
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <Layout>
                <Statistics />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/todo"
          element={
            <ProtectedRoute>
              <Layout>
                <ToDoPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Layout>
                <Account />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} /> {/* not wrapped in layout or protectedroute as users dont have to be authorised to access this page and the page doesnt need a navbar */}
        <Route path="/logout" element={<Logout />} /> {/* not wrapped in layout or protectedroute as users dont have to be authorised to access this page and the page doesnt need a navbar */}
        <Route path="/register" element={<RegisterAndLogout />} /> {/* not wrapped in layout or protectedroute as users dont have to be authorised to access this page and the page doesnt need a navbar */}
        <Route path="*" element={<NotFound />} /> {/* everything else that hasnt been defined just takes the user to the 404 not found page */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
