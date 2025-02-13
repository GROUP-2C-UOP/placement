import { useState, useEffect } from "react";
import api from "../api";
import Placement from "../components/Placement";
import { statusLabels } from "../constants";
import AddModal from "../components/AddModal";
import FilterModal from "../components/FilterModal";

import "../styles/Home.css";

function Home() {
  const [placements, setPlacements] = useState([]);
  const [placementsInProgress, setPlacementsInProgress] = useState([]);
  const [filteredPlacementsInProgress, setFilteredPlacementsInProgress] =
    useState([]);
  const [placementsRejected, setPlacementsRejected] = useState([]);
  const [placementsAccepted, setPlacementsAccepted] = useState([]);
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filterRoles, setFilterRoles] = useState([]);

  const [sortProgressPlacements, setSortProgressPlacements] = useState({
    key: null,
    ascending: true,
  });
  const [sortRejectedPlacements, setSortRejectedPlacements] = useState({
    key: null,
    ascending: true,
  });
  const [sortAccpetedPlacements, setSortAcceptedPlacements] = useState({
    key: null,
    ascending: true,
  });

  useEffect(() => {
    getPlacements();
  }, []);

  useEffect(() => {
    placementsInProg();
  }, [placements]);

  useEffect(() => {
    placementsRej();
  }, [placements]);

  useEffect(() => {
    placementsAcc();
  }, [placements]);

  useEffect(() => {
    filteredPlacementsInProg();
  }, [filterRoles]);

  const getPlacements = () => {
    api
      .get("/api/placements/")
      .then((res) => res.data)
      .then((data) => {
        setPlacements(data);
      })

      .catch((err) => alert(err));
  };

  const placementsInProg = () => {
    const pip = placements.filter(
      (placement) =>
        placement.status !== "rejected" && placement.status !== "offer_made"
    );
    setPlacementsInProgress(pip);
  };

  const filteredPlacementsInProg = () => {
    const pip = placements.filter(
      (placement) =>
        placement.status !== "rejected" &&
        placement.status !== "offer_made" &&
        filterRoles.includes(placement.role)
    );
    setFilteredPlacementsInProgress(pip);
  };

  const placementsRej = () => {
    const rej = placements.filter(
      (placement) => placement.status === "rejected"
    );
    setPlacementsRejected(rej);
  };

  const placementsAcc = () => {
    const acc = placements.filter(
      (placement) => placement.status === "offer_made"
    );
    setPlacementsAccepted(acc);
  };

  const deletePlacement = (id) => {
    api
      .delete(`/api/placements/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Placement deleted successfully");
        } else alert("Error deleting placement");
        getPlacements();
      })
      .catch((err) => alert(err));
  };

  const createPlacement = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("company", company || null);
    formData.append("role", role || null);
    formData.append("salary", salary || null);
    formData.append("starting_date", startingDate || null);
    formData.append("duration", duration || null);
    formData.append("next_stage_deadline", deadline || null);
    formData.append("placement_link", applicationLink || null);
    formData.append("date_applied", dateApplied || null);
    formData.append("status", status || "Applied");
    formData.append("contact", contact || null);
    formData.append("cv", cv || null);
    formData.append("cover_letter", coverLetter || null);
    formData.append("description", description || null);

    api
      .post("/api/placements/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 201) {
          alert("Placement created successfully");
          setShowAddModal(false);
          setShowAddButton(true);
          getPlacements();
        } else {
          alert("Error creating placement");
        }
      })
      .catch((err) => alert(err));
  };

  const sortByHeader = (header, type) => {
    let isAscending;
    let sortedPlacements;

    switch (type) {
      case "progress":
        isAscending =
          sortProgressPlacements.key === header
            ? !sortProgressPlacements.ascending
            : true;
        sortedPlacements = [...placementsInProgress].sort((a, b) => {
          if (typeof a[header] === "string") {
            return isAscending
              ? a[header].localeCompare(b[header])
              : b[header].localeCompare(a[header]);
          } else {
            return isAscending ? a[header] - b[header] : b[header] - a[header];
          }
        });
        setPlacementsInProgress(sortedPlacements);
        setSortProgressPlacements({ key: header, ascending: isAscending });
        break;

      case "rejected":
        isAscending =
          sortRejectedPlacements.key === header
            ? !sortRejectedPlacements.ascending
            : true;
        sortedPlacements = [...placementsRejected].sort((a, b) => {
          if (typeof a[header] === "string") {
            return isAscending
              ? a[header].localeCompare(b[header])
              : b[header].localeCompare(a[header]);
          } else {
            return isAscending ? a[header] - b[header] : b[header] - a[header];
          }
        });
        setPlacementsRejected(sortedPlacements);
        setSortRejectedPlacements({ key: header, ascending: isAscending });
        break;

      case "accepted":
        isAscending =
          sortAccpetedPlacements.key === header
            ? !sortAccpetedPlacements.ascending
            : true;
        sortedPlacements = [...placementsAccepted].sort((a, b) => {
          if (typeof a[header] === "string") {
            return isAscending
              ? a[header].localeCompare(b[header])
              : b[header].localeCompare(a[header]);
          } else {
            return isAscending ? a[header] - b[header] : b[header] - a[header];
          }
        });
        setPlacementsAccepted(sortedPlacements);
        setSortAcceptedPlacements({ key: header, ascending: isAscending });
        break;

      default:
        console.error("Invalid placement type for sorting");
        return;
    }
  };

  return (
    <div className="cont">
      <div id="content-container">
        <h1 className="placement-title">Placements</h1>
        <h2 className="placement-subtitle">
          In Progress
          <button id="filter-button" onClick={() => setShowFilter(true)}>
            <img src="/src/assets/filter.svg"></img>
          </button>
        </h2>
        <div className="header-containerrr">
          <table>
            <thead id="progress-headers">
              <tr className="single-row">
                <th
                  className="main-headers"
                  onClick={() => sortByHeader("company", "progress")}
                >
                  Company
                  {sortProgressPlacements.key === "company"
                    ? sortProgressPlacements.ascending
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="main-headers"
                  onClick={() => sortByHeader("role", "progress")}
                >
                  Role{" "}
                  {sortProgressPlacements.key === "role"
                    ? sortProgressPlacements.ascending
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="main-headers"
                  onClick={() => sortByHeader("status", "progress")}
                >
                  Status
                  {sortProgressPlacements.key === "status"
                    ? sortProgressPlacements.ascending
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="main-headers"
                  onClick={() =>
                    sortByHeader("next_stage_deadline", "progress")
                  }
                >
                  Deadline
                  {sortProgressPlacements.key === "next_stage_deadline"
                    ? sortProgressPlacements.ascending
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="main-headers"
                  onClick={() => sortByHeader("description", "progress")}
                >
                  Notes{" "}
                  {sortProgressPlacements.key === "description"
                    ? sortProgressPlacements.ascending
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="placement-type">
          {!isFiltered &&
            placementsInProgress.map((placement) => (
              <Placement
                placementType={"progress"}
                isDashboard={false}
                placement={placement}
                statusLabels={statusLabels}
                onDelete={deletePlacement}
                key={placement.id}
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
                description={description}
                setDescription={setDescription}
                setContact={setContact}
                getPlacements={getPlacements}
              />
            ))}
          {isFiltered &&
            filteredPlacementsInProgress.map((placement) => (
              <Placement
                placementType={"progress"}
                isDashboard={false}
                placement={placement}
                statusLabels={statusLabels}
                onDelete={deletePlacement}
                key={placement.id}
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
                description={description}
                setDescription={setDescription}
                setContact={setContact}
                getPlacements={getPlacements}
              />
            ))}
        </div>

        <h2 className="placement-subtitle">
          <span>🔴</span>Rejected<span>🔴</span>
        </h2>
        <div className="placement-type"></div>
        <div className="header-containerrr">
          <table>
            <thead id="rejected-headers">
              <tr className="single-row">
                <th
                  className="main-headers"
                  onClick={() => sortByHeader("company", "rejected")}
                >
                  Company
                  {sortRejectedPlacements.key === "company"
                    ? sortRejectedPlacements.ascending
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="main-headers"
                  onClick={() => sortByHeader("role", "rejected")}
                >
                  Role
                  {sortRejectedPlacements.key === "role"
                    ? sortRejectedPlacements.ascending
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="main-headers"
                  onClick={() => sortByHeader("description", "rejected")}
                >
                  Feedback
                  {sortRejectedPlacements.key === "description"
                    ? sortRejectedPlacements.ascending
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="placement-type">
          {placementsRejected.map((placement) => (
            <Placement
              placementType={"rejected"}
              isDashboard={false}
              placement={placement}
              statusLabels={statusLabels}
              onDelete={deletePlacement}
              key={placement.id}
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
              description={description}
              setDescription={setDescription}
              setContact={setContact}
              getPlacements={getPlacements}
            />
          ))}
        </div>
        <h2 className="placement-subtitle">
          <span>🟢</span>Accepted<span>🟢</span>
        </h2>
        <div className="placement-type"></div>
        <div className="header-containerrr">
          <table>
            <thead id="accepted-headers">
              <tr className="single-row">
                <th
                  className="main-headers"
                  onClick={() => sortByHeader("company", "accepted")}
                >
                  Company{" "}
                  {sortAccpetedPlacements.key === "company"
                    ? sortAccpetedPlacements.ascending
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="main-headers"
                  onClick={() => sortByHeader("role", "accepted")}
                >
                  Role{" "}
                  {sortAccpetedPlacements.key === "role"
                    ? sortAccpetedPlacements.ascending
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="main-headers"
                  onClick={() => sortByHeader("starting_date", "accepted")}
                >
                  Starting{" "}
                  {sortAccpetedPlacements.key === "starting_date"
                    ? sortAccpetedPlacements.ascending
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="main-headers"
                  onClick={() => sortByHeader("description", "accepted")}
                >
                  Notes{" "}
                  {sortAccpetedPlacements.key === "description"
                    ? sortAccpetedPlacements.ascending
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="placement-type">
          {placementsAccepted.map((placement) => (
            <Placement
              placementType={"accepted"}
              isDashboard={false}
              placement={placement}
              statusLabels={statusLabels}
              onDelete={deletePlacement}
              key={placement.id}
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
              description={description}
              setDescription={setDescription}
              setContact={setContact}
              getPlacements={getPlacements}
            />
          ))}
        </div>
      </div>
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
          createPlacement={createPlacement}
          toClose={() => {
            setShowAddModal(false);
            setShowAddButton(true);
          }}
        ></AddModal>
      )}
      {showAddButton && (
        <button
          id="add-button"
          onClick={() => {
            setShowAddModal(true);
            setShowAddButton(false);
          }}
        >
          <img src="src/assets/add.svg" />
        </button>
      )}
      {showFilter && (
        <FilterModal
          setShowFilter={setShowFilter}
          placementsInProgress={placementsInProgress}
          setFilterRoles={setFilterRoles}
          setIsFiltered={setIsFiltered}
          filteredPlacementsInProg={filteredPlacementsInProg}
        ></FilterModal>
      )}
    </div>
  );
}

export default Home;
