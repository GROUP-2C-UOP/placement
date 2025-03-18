import { useState } from "react";
import "../styles/ToDo.css";

function ToDo({ todo }) {
  const calculateRemaining = (placement) => {
    const today = new Date();
    const deadlineDate = new Date(placement.next_stage_deadline);
    const timeDifference = deadlineDate - today;
    let daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return `${daysRemaining} Days`;
  };

  return (
    <div className="gen-cont">
      <div className="checkoff-container"></div>
      <div className="todo-container-home">
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
  );
}

export default ToDo;
