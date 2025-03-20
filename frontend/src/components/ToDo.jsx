import { useState } from "react";
import "../styles/ToDo.css";
import PlacementModal from "./PlacementModal";
import { icons } from "../constants";

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
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const calculateRemaining = (placement) => {
    const today = new Date();
    const deadlineDate = new Date(placement.next_stage_deadline);
    const timeDifference = deadlineDate - today;
    let daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return `${daysRemaining} Days`;
  };

  const openModal = (todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div id="td-cont">
      <div className="gen-cont">
        <div className="checkoff-container" onClick={() => {alert("CHECK OFF NEEDS TO BE IMPLEMENTED")}}></div>
        <div className="todo-container-home" onClick={() => openModal(todo)}>
          <table>
            <thead className="to-do-home-spacing">
              <tr>
                <th>{todo.company}</th>
                <th>{todo.role}</th>
                <th>{calculateRemaining(todo)}</th>
                <th className="task-description">
                  {todo.description === "null" ? "" : todo.description}
                </th>
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
          isDashboard={false}
          type="todo"
          onDelete={() => onDelete(selectedTodo.id)}
        />
      )}
    </div>
  );
}

export default ToDo;
