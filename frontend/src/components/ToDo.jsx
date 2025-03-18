import { useState } from "react";

function ToDo({ todo }) {
  return (
    <div>
      <input type="checkbox" />
      <table>
        <thead>
            <tr>
                <th>{todo.company}</th>
                <th>{todo.role}</th>
                <th>{todo.next_stage_deadline}</th>
                <th className="task-description">
                  {todo.description === "null"
                    ? ""
                    : todo.description}
                </th>
            </tr>
        </thead>
      </table>
    </div>
  );
}

export default ToDo;
