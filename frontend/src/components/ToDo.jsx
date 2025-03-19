import { useState } from "react";
import "../styles/ToDo.css";
import PlacementModal from "./PlacementModal";
import { icons } from "../constants";

function ToDo({ todo }) {
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
        <div className="checkoff-container"></div>
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
          company={todo.company}
          setCompany={() => {}}
          role={todo.role}
          setRole={() => {}}
          salary={todo.salary}
          setSalary={() => {}}
          startingDate={todo.starting_date}
          setStartingDate={() => {}}
          duration={todo.duration}
          setDuration={() => {}}
          deadline={todo.next_stage_deadline}
          setDeadline={() => {}}
          applicationLink={todo.placement_link}
          setApplicationLink={() => {}}
          dateApplied={todo.date_applied}
          setDateApplied={() => {}}
          status={todo.status}
          setStatus={() => {}}
          cv={todo.cv}
          setCv={() => {}}
          coverLetter={null}
          setCoverLetter={() => {}}
          contact={todo.contact}
          setContact={() => {}}
          description={todo.description}
          setDescription={() => {}}
          createPlacement={() => {}}
          toClose={closeModal}
          getPlacements={() => {}}
          setShowModal={setShowModal}
          isDashboard={false}
          type="todo"
          onDelete={() => {}}
        />
      )}
    </div>
  );
}

export default ToDo;
