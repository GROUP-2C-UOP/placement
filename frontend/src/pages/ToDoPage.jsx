import { useState, useEffect } from "react";
import api from "../api";
import Placement from "../components/Placement";
import { statusLabels } from "../constants";
import AddModal from "../components/AddModal";
import FilterModal from "../components/FilterModal";
import NotificationsPopUp from "../components/NotificationPopUp";
import ToDo from "../components/ToDo";
import "../styles/ToDoPage.css";

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
  const [sortToDo, setSortToDo] = useState({ key: null, ascending: true });
  const [showFilter, setShowFilter] = useState(false);
  const [filterRoles, setFilterRoles] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredToDos, setFilteredToDos] = useState([]);
  const [notificationsOn, setNotificationsOn] = useState("");
  const [showNoti, setShowNoti] = useState(false);
  const [showSingleNoti, setShowSingleNoti] = useState(false);
  const [singleNotification, setSingleNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [toShowNotifications, setToShowNotifications] = useState([]);

  useEffect(() => {
    getToDos();
  }, []);

  useEffect(() => {
    getNotificationStatus();
  }, []);

  useEffect(() => {
    getNotifications(); //called twice due to strictmode -- makes two notifications. strict mode needs to be disabled in main.jsx
  }, [notificationsOn]);

  useEffect(() => {
    getNotifications();
  }, [toDos]);

  useEffect(() => {
    filteredPlacementsInProg();
  }, [filterRoles]);

  const getToDos = () => {
    api
      .get("/api/todos/")
      .then((res) => res.data)
      .then((data) => {
        SetToDos(data);
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
          getToDos();
        } else {
          alert("Error creating todo");
        }
      })
      .catch((err) => alert(err));
  };

  const deleteToDo = (id) => {
    api
      .delete(`/api/todos/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          console.log(`ToDo ID:, ${id}`);
          console.log("ToDo deleted successfully");
        } else alert("Error deleting Todo");
        getToDos();
      })
      .catch((err) => alert(err));
  };

  const sortToDoList = (header) => {
    let isAscending = sortToDo.key === header ? !sortToDo.ascending : true;

    const handleNull = (value, isAscending) => {
      if (value === "null" || value === "" || value === null) {
        return isAscending ? "zzzzzzz" : "";
      }
      return value;
    };

    const sortedToDos = [...toDos].sort((a, b) => {
      const aValue = handleNull(a[header], isAscending);
      const bValue = handleNull(b[header], isAscending);

      if (typeof a[header] === "string") {
        return isAscending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return isAscending ? a[header] - b[header] : b[header] - a[header];
      }
    });

    SetToDos(sortedToDos);
    setSortToDo({ key: header, ascending: isAscending });
  };

  const filteredPlacementsInProg = () => {
    const pip = toDos.filter((todo) => filterRoles.includes(todo.role));
    setFilteredToDos(pip);
  };

  const getNotificationStatus = () => {
    api
      .get(`/api/account/notification/status/`)
      .then((res) => res.data)
      .then((data) => {
        const status = data.notification_enabled;
        setNotificationsOn(status);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const getNotifications = () => {
    if (notificationsOn) {
      api
        .get("/api/notifications/")
        .then((res) => res.data)
        .then((data) => {
          setNotifications(data);

          const filteredNotifications = data.filter(
            (notification) => !notification.shown
          );
          setToShowNotifications(filteredNotifications);

          console.log(data);
          console.log(`to show notifications`, filteredNotifications);

          if (filteredNotifications.length > 1) {
            setSingleNotification(null);
            setShowSingleNoti(false);
            setShowNoti(true);
          } else if (filteredNotifications.length === 1) {
            setSingleNotification(filteredNotifications[0]);
            setShowSingleNoti(true);
            setShowNoti(false);
          }
        })
        .catch((err) => alert(err));
    }
  };

  return (
    <div>
      <h1 id="todo-title">To Do</h1>
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
      <div id="to-dos-container">
        <button
          id="filter-button-todo"
          className="no-select"
          onClick={() => setShowFilter(true)}
        >
          <img src="/src/assets/filter.svg"></img>
        </button>
        <table id="idk">
          <thead id="todo-header-container">
            <tr>
              <th
                onClick={() => {
                  sortToDoList("company");
                }}
                className="no-select"
              >
                Company{" "}
                {sortToDo.key === "company"
                  ? sortToDo.ascending
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                onClick={() => {
                  sortToDoList("role");
                }}
                className="no-select"
              >
                Role
                {sortToDo.key === "role"
                  ? sortToDo.ascending
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                onClick={() => {
                  sortToDoList("next_stage_deadline");
                }}
                className="no-select"
              >
                Deadline
                {sortToDo.key === "next_stage_deadline"
                  ? sortToDo.ascending
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                onClick={() => {
                  sortToDoList("description");
                }}
                className="no-select"
              >
                Notes{" "}
                {sortToDo.key === "description"
                  ? sortToDo.ascending
                    ? "▲"
                    : "▼"
                  : ""}{" "}
              </th>
            </tr>
          </thead>
        </table>
        {!isFiltered &&
          toDos.map((todo) => (
            <ToDo
              todo={todo}
              key={todo.id}
              onDelete={deleteToDo}
              getToDos={getToDos}
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
              isDashboard={false}
            />
          ))}
        {isFiltered &&
          filteredToDos.map((todo) => (
            <ToDo
              todo={todo}
              key={todo.id}
              onDelete={deleteToDo}
              getToDos={getToDos}
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
              isDashboard={false}
            />
          ))}
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
            type="todo"
          ></AddModal>
        )}
      </div>
      {showFilter && (
        <FilterModal
          setShowFilter={setShowFilter}
          placementsInProgress={toDos}
          setFilterRoles={setFilterRoles}
          setIsFiltered={setIsFiltered}
          filteredPlacementsInProgress={filteredToDos}
        ></FilterModal>
      )}
      {showSingleNoti && (
        <NotificationsPopUp
          setShowSingleNoti={setShowSingleNoti}
          singleNotification={singleNotification}
          company={singleNotification.company}
          role={singleNotification.role}
          days={singleNotification.days}
          status={singleNotification.status}
        ></NotificationsPopUp>
      )}
      {showNoti && (
        <NotificationsPopUp
          setShowNoti={setShowNoti}
          toShowNotifications={toShowNotifications}
          type={"multi"}
        ></NotificationsPopUp>
      )}
    </div>
  );
}

export default ToDoPage;
