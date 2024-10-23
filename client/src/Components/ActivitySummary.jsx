import Header from "./Header";

function ActivitySummary() {
  return (
    <div className="container">
      <Header />
      <h2>Activity Summary</h2>
      {/* Date filter input */}
      <div className="mb-3">
        <label className="form-label">Select Date Range</label>
        <input type="date" className="form-control" />
      </div>
      {/* Activity Summary Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Task</th>
            <th>Total Active Time</th>
          </tr>
        </thead>
        <tbody>
          {/* Replace with summary data */}
          <tr>
            <td>Task 1</td>
            <td>4 hours</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ActivitySummary;
