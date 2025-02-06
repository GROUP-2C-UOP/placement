function profileStats() {
  let statistics = [
    "No. of applications sent",
    "Progress made on each application",
    "Acception / rejection rates",
    "Placement map",
  ];
  statistics = [];

  return (
    <>
      <h1>Profile Example</h1>
      {statistics.length === 0 && <p>No stats found</p>}
      <ul className="Profile-statistics">
        {statistics.map((statistic) => (
          <li key={statistic}>{statistic}</li>
        ))}
      </ul>
    </>
  );
}

export default profileStats;
