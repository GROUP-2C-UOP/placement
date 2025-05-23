import { useState } from "react";
import "../styles/ToDo.css";
import PlacementModal from "./PlacementModal";
import { icons } from "../constants";
import ConfirmationModal from "./ConfirmationModal";
import api from "../api";

/**
 * Displays and manages individual todo items -- similair structure to placement component
 * 
 * Props:
 * - todo: todo object containing relevant data
 * - onDelete: handles todo deletion
 * - getToDos: handles fetching all todos
 * - isDashboard: Boolean indicating if on dashboard
 */
function ToDo({
  todo,
  onDelete,
  getToDos,
  company,
  setCompany,
  role,
  setRole,
  salary,
  setSalary,
  startingDate,
  setStartingDate,
  duration,
  setDuration,
  deadline,
  setDeadline,
  applicationLink,
  setApplicationLink,
  dateApplied,
  setDateApplied,
  status,
  setStatus,
  cv,
  setCv,
  coverLetter,
  setCoverLetter,
  contact,
  setContact,
  description,
  setDescription,
  isDashboard,
  type,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showCheckOff, setShowCheckOff] = useState(false);

  const spacing = type === "dashboard" ? "tdds" : "to-do-home-spacing"
  const checkOffContSpacing = type === "dashboard" ? "dashboard-checkoff-cont" : "checkoff-container"

  //similiar to placement component, calculates days remaning to apply for the to do placement
  const calculateRemaining = (placement) => {
    const today = new Date();
    const deadlineDate = new Date(placement.next_stage_deadline);
    const timeDifference = deadlineDate - today;
    let daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? `${daysRemaining} Days` : "Deadline Passed";
  };

  const openModal = (todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  /**
   * Converts todo object to a placement object by creating new placement record
   * Uses current date as application date
   */
  const createPlacement = () => {
    const formData = new FormData();
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    console.log(selectedTodo.starting_date);
    const fields = {
      company: selectedTodo.company,
      role: selectedTodo.role,
      salary: selectedTodo.salary || "",
      starting_date: selectedTodo.starting_date || "",
      duration: selectedTodo.duration || "",
      next_stage_deadline: "",
      placement_link: selectedTodo.applicationLink || "",
      date_applied: formattedToday,
      status: "applied",
      contact: "",
      cv: "",
      cover_letter: "",
      description: selectedTodo.description || "",
    };

    for (const [key, value] of Object.entries(fields)) {
      if (value) {
        formData.append(key, value);
      }
    }

    api
      .post("/api/placements/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 201) {
          console.log("Placement created successfully");
          setShowModal(false);
          getToDos();
        } else {
          alert("Error creating placement");
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div id="td-cont">
      <div className="gen-cont">
        <div
          className={checkOffContSpacing}
          onClick={() => {
            setSelectedTodo(todo);
            setShowCheckOff(true);
          }}
        ></div>
        <div className="todo-container-home" onClick={() => openModal(todo)}>
          <table>
            <thead className={spacing}>
              <tr>
                <th>{todo.company}</th>
                <th>{todo.role}</th>
                <th>{calculateRemaining(todo)}</th>
                {type !== "dashboard" && (
                  <th className="task-description">
                    {todo.description === "null" ? "" : todo.description}
                  </th>
                )}
              </tr>
            </thead>
          </table>
        </div>
      </div>

      {showModal && (
        <PlacementModal
          placement={selectedTodo}
          closeModal={closeModal}
          showModal={showModal}
          statusLabels={icons}
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
          setContact={setContact}
          description={description}
          setDescription={setDescription}
          createPlacement={() => {}}
          toClose={closeModal}
          getPlacements={getToDos}
          setShowModal={setShowModal}
          isDashboard={isDashboard}
          type="todo"
          onDelete={() => onDelete(selectedTodo.id)}
        />
      )}

      {showCheckOff && (
        <ConfirmationModal
          func={() => {
            createPlacement();
            onDelete(selectedTodo.id);
          }}
          method={"complete"}
          type={"Application"}
          onClose={() => {
            setShowCheckOff(false);
          }}
          setEditing={null}
        />
      )}
    </div>
  );
}

export default ToDo;
