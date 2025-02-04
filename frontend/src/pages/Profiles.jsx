function profileStats() {
  let statistics = [
    "No. of applications sent",
    "Progress made on each application",
    "Acception / rejection rates",
    "Placement map",
  ];
  statistics = [];

  if (statistics.length === 0)
    return (
      <>
        <h1>Profile Example</h1>
        <p>No stats could be loaded</p>
      </>
    );

  return (
    <>
      <h1>Profile Example</h1>
      <ul className="Profile-statistics">
        {statistics.map((statistic) => (
          <li key={statistic}>{statistic}</li>
        ))}
      </ul>
    </>
  );
}

export default profileStats;
