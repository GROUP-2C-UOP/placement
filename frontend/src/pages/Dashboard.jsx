import "../styles/Dashboard.css";
import api from "../api";
import Placement from "../components/Placement";
import { statusLabels } from "../constants";
import { useState, useEffect } from "react";
import { Link } from "react-router";

function Dashboard() {
  useEffect(() => {
    getUser();
    getPlacements();
  }, []);

  const [name, setName] = useState("");
  const [placements, setPlacements] = useState([]);
  const isDashboard = true;

  const getUser = () => {
    api
      .get("/api/user/getname/")
      .then((res) => res.data)
      .then((data) => {
        const firstName =
          data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1);
        setName(firstName);
      })
      .catch((err) => alert(err));
  };

  const getPlacements = () => {
    //NOTE: IN DOC TALK AB HOW GETTING ALL FUNC IS INEEFICIENT AND BAD IF WE ONLY WANT 3
    api
      .get("/api/placements/") //get all placements
      .then((res) => res.data) //extract data from response object
      .then((data) => {
        const today = new Date(); //get todays date

        const sortedPlacements = data
          .filter((p) => {
            //filter with placement parameter
            const deadlineDate = new Date(p.next_stage_deadline); //get placement deadline date
            return (
              p.status !== "rejected" && //include if status is not rejected
              p.status !== "hired" && //include if...
              p.status !== "offer_made" && //include if...
              deadlineDate >= today //include if deadline date of placement is greater than today
            );
          })
          .sort(
            (
              a,
              b // sort function takes 2 objects, placement a and placement b
            ) =>
              new Date(a.next_stage_deadline) - new Date(b.next_stage_deadline) // used to sort, if the result is negative a is put before b and if positive vice versa
          )
          .slice(0, 5); //take the top 5 ones
        console.log(sortedPlacements);
        setPlacements(sortedPlacements);
      })
      .catch((err) => alert(err));
  };

  return (
    <div id="container">
      <header id="welcome">Welcome {name}</header>
      <header id="dashboard">Your Dashboard</header>
      <div id="main-container">
        <header id="deadlines-header">Upcoming deadlines</header>
        <header id="applications-header">Applications To Do</header>
        <div id="div-container">
          <div id="placement-container">
            <div id="top">
              <header>Company</header>
              <header>Type</header>
              <header>Days</header>
            </div>
            <div id="placements">
              {placements.map((placement) => (
                <Placement
                  isDashboard={isDashboard}
                  placement={placement}
                  statusLabels={statusLabels}
                  key={placement.id}
                  company={placement.company}
                  role={placement.role}
                  salary={placement.salary}
                  startingDate={placement.startingDate}
                  duration={placement.duration}
                  deadline={placement.deadline}
                  applicationLink={placement.applicationLink}
                  dateApplied={placement.dateApplied}
                  status={placement.status}
                  cv={placement.cv}
                  coverLetter={placement.coverLetter}
                  contact={placement.contact}
                  description={placement.description}
                />
              ))}
              <div id="bottom">
                {placements.length === 0 && (
                  <Link to="/placements">
                    <button id="see-all">Add Placement</button>
                  </Link>
                )}
                {placements.length > 0 && (
                  <Link to="/placements">
                    <button id="see-all">See All</button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div id="todo-container"></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
