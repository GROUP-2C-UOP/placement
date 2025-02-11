import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/ToDoList.css";

const ToDoList = () => {
    // state to store all placements
    const [placements, setPlacements] = useState([]);

    // fetch placements from backend
    useEffect(() => {
        getPlacements();
    }, []);

    const getPlacements = () => {
        api
            .get("/api/placements/")
            .then((res) => res.data)
            .then((data) => {
                setPlacements(data);
            })
            .catch((err) => alert("Error fetching placements"));
    };

    const moveToActive = (id) => {
        api
            .patch(`/api/placements/update/${id}/`, { status: "active" }) 
            .then(() => {
                alert("Placement moved to Active Applications");
                getPlacements(); // refreshes the list
            })
            .catch((err) => alert("Error updating placement"));
    };

    const handleDelete = (id) => {
        api
            .delete(`/api/placements/delete/${id}/`)
            .then(() => {
                alert("Placement deleted");
                getPlacements();
            })
            .catch((err) => alert("Error deleting placement"));
    };

    return (
        <div className="todo-list-container">
            <h1>Your To-Do List</h1>

            <div className="todo-list">
                {placements.length === 0 ? <p>No placements to track.</p> : null}
                {placements
                    .filter((app) => app.status === "applied") // only shows to do applications
                    .map((app) => (
                        <div className="todo-item" key={app.id}>
                            <h3>{app.company} - {app.role}</h3>
                            <p>Date Added: {app.date_applied}</p>
                            <p>Application Deadline: {app.next_stage_deadline}</p>
                            <button onClick={() => moveToActive(app.id)}>Move to Active</button>
                            <button onClick={() => handleDelete(app.id)}>Delete</button>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ToDoList;
