import { useState } from "react";

function ToDo({ todo }) {
  return (
    <div>
      <input type="checkbox" />
      <p>{todo.company}</p>
      <p>{todo.role}</p>
      <p>{todo.next_stage_deadline}</p>
    </div>
  );
}

export default ToDo;
