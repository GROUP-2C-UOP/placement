import "../styles/NavBar.css";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div id="navbar-container">
      <div id="title-container">
        <img src="../src/assets/react.svg"></img>
        Career Compass
        </div>
      <div id="header-container">
        <Link to="/">Dashboard</Link>
        <Link to="/placements">Placements</Link>
        <a href="#">To-Do</a>
        <a href="#">Statistics</a>
        <a href="#">Profile</a>
      </div>
    </div>
  );
}

export default NavBar;

{/* <Placement
              isDashboard={false}
              placement={placement}
              statusLabels={statusLabels}
              onDelete={deletePlacement}
              key={placement.id}
              company={company}
              setCompany={setCompany}
              role={role}
              setRole={setRole}
              salary={salary}
              setSalary={setSalary}
              startingDate={startingDate}
              setStartingDate={setStartingDate}
              duration={duration}
              setDuration={setDuration}
              deadline={deadline}
              setDeadline={setDeadline}
              applicationLink={applicationLink}
              setApplicationLink={setApplicationLink}
              dateApplied={dateApplied}
              setDateApplied={setDateApplied}
              status={status}
              setStatus={setStatus}
              cv={cv}
              setCv={setCv}
              coverLetter={coverLetter}
              setCoverLetter={setCoverLetter}
              contact={contact}
              description={description}
              setDescription={setDescription}
              setContact={setContact}
              getPlacements={getPlacements}
            /> */}