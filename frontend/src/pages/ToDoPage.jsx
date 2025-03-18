import { useState, useEffect } from "react";
import api from "../api";
import Placement from "../components/Placement";
import { statusLabels } from "../constants";
import AddModal from "../components/AddModal";
import FilterModal from "../components/FilterModal";
import NotificationsPopUp from "../components/NotificationPopUp";

function ToDoPage() {
  const [toDos, SetToDos] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [duration, setDuration] = useState("");
  const [deadline, setDeadline] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [status, setStatus] = useState("");
  const [cv, setCv] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getToDos()
  }, [])

  const getToDos = () => {
    api
      .get("/api/todos/")
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
      })

      .catch((err) => alert(err));
  };

  const createToDo = (e) => {
    e.preventDefault();
    const formData = new FormData();

    const fields = {
      company,
      role,
      salary,
      starting_date: startingDate,
      duration,
      next_stage_deadline: deadline,
      placement_link: applicationLink,
      date_applied: dateApplied,
      status: status,
      contact,
      cv,
      cover_letter: coverLetter,
      description,
    };

    for (const [key, value] of Object.entries(fields)) {
      if (value) {
        formData.append(key, value);
      }
    }

    api
      .post("/api/todos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 201) {
          console.log("TODO created successfully");
          setShowAddModal(false);
          setShowAddButton(true);
          getToDos()
        } else {
          alert("Error creating todo");
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <h1>TO DO</h1>
      <button
        id="add-button"
        className="no-select"
        onClick={() => {
          setShowAddModal(true);
          setShowAddButton(false);
        }}
      >
        <img src="src/assets/add.svg" />
      </button>
      {showAddModal && (
        <AddModal
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
          create={createToDo}
          toClose={() => {
            setShowAddModal(false);
            setShowAddButton(true);
          }}
          type="placement"
        ></AddModal>
      )}
    </div>
  );
}

export default ToDoPage;
