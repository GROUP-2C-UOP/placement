import "../styles/Dashboard.css";
import api from "../api";
import Placement from "../components/Placement";
import ToDo from "../components/ToDo";
import { statusLabels } from "../constants";
import { useState, useEffect } from "react";
import { Link } from "react-router";

function Dashboard() {
  useEffect(() => {
    getUser();
    getPlacements();
    getToDos();
  }, []);

  const [name, setName] = useState("");
  const [placements, setPlacements] = useState([]);
  const [todos, setToDos] = useState([]);
  const isDashboard = true;

  const getUser = () => {
    api
      .get("/api/account/name/")
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
        const today = new Date().toISOString().split("T")[0]; //date only, no time stamp

        const sortedPlacements = data
          .filter((p) => {
            //filter with placement parameter
            const deadlineDate = new Date(p.next_stage_deadline)
              .toISOString()
              .split("T")[0]; //get placement deadline date
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
          .slice(0, 4); //take the top 5 ones
        console.log(sortedPlacements);
        setPlacements(sortedPlacements);
      })
      .catch((err) => alert(err));
  };

  const getToDos = () => {
    api
      .get("/api/todos/")
      .then((res) => res.data)
      .then((data) => {
        const today = new Date().toISOString().split("T")[0];

        const filteredData = data.filter((t) => {
          const deadlineDate = new Date(t.next_stage_deadline)
            .toISOString()
            .split("T")[0];
          return deadlineDate >= today;
        }).sort((a,b) => new Date(a.next_stage_deadline) - new Date(b.next_stage_deadline))

        const limitedData = filteredData.slice(0, 4);
        setToDos(limitedData);

        console.log(limitedData);
      })
      .catch((err) => alert(err));
  };

  const deleteToDo = (id) => {
    api
      .delete(`/api/todos/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          console.log("ToDo deleted successfully");
        } else alert("Error deleting Todo");
        getToDos();
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    console.log("Updated todos:", todos);
  }, [todos]);

  return (
    <div id="container">
      <header id="welcome">Welcome {name}</header>
      <header id="dashboard">Your Dashboard</header>
      <div id="main-container">
       
        
        <div id="div-container">
          <div id="placement-container">
          <header id="deadlines-header">Upcoming deadlines</header>
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
                    <button id="add" className="no-select">
                      <img src="src/assets/add.svg" />
                    </button>
                  </Link>
                )}
                {placements.length > 0 && (
                  <Link to="/placements">
                    <button id="see">
                      <img src="src/assets/ellipses.svg" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div id="todo-container">
          <header id="applications-header">Applications To Do</header>
            <div id="top-todo">
              <header>Company</header>
              <header>Role</header>
              <header>Days</header>
            </div>
            <div id="todos">
              {todos.map((todo) => (
                <ToDo
                  isDashboard={true}
                  todo={todo}
                  statusLabels={statusLabels}
                  key={todo.id}
                  company={todo.company}
                  role={todo.role}
                  salary={todo.salary}
                  startingDate={todo.startingDate}
                  duration={todo.duration}
                  deadline={todo.deadline}
                  applicationLink={todo.applicationLink}
                  description={todo.description}
                  onDelete={deleteToDo}
                  getToDos={getToDos}
                  type="dashboard"
                />
              ))}
              <div id="bottom">
                {todos.length === 0 && (
                  <Link to="/todo">
                    <button id="add" className="no-select">
                      <img src="src/assets/add.svg" />
                    </button>
                  </Link>
                )}
                {todos.length > 0 && (
                  <Link to="/todo">
                    <button id="see">
                      <img src="src/assets/ellipses.svg" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
