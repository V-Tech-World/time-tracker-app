import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import API_BASE_URL from "../config";

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [tags, setTags] = useState([]);
  const [startTimeActivities, setStartTimeActivities] = useState([]);
  const [endTimeActivities, setEndTimeActivities] = useState([]);

  const fetchTask = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
      const task = await response.json();
      setTask(task[0]);

      const tagIds = task[0].tags.split(',').map(tagId => tagId.trim());
      const tagPromises = tagIds.map(async tagId => {
        const tagResponse = await fetch(`${API_BASE_URL}/tags/${tagId}`);
        return tagResponse.json();
      });
      const tagsData = await Promise.all(tagPromises);
      setTags(tagsData.flat());
    } catch (error) {
      console.error("Error fetching task or tags:", error);
    }
  };

  const fetchIntervals = async () => {
    try {
      const [startResponse, endResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/timesfortask/${id}/0`),
        fetch(`${API_BASE_URL}/timesfortask/${id}/1`)
      ]);

      const intervalsStart = await startResponse.json();
      const intervalsEnd = await endResponse.json();

      setStartTimeActivities(intervalsStart.map(interval => ({
        id: interval.id,
        timestamp: new Date(interval.timestamp),
        type: 0
      })));

      setEndTimeActivities(intervalsEnd.map(interval => ({
        id: interval.id,
        timestamp: new Date(interval.timestamp),
        type: 1
      })));
    } catch (error) {
      console.error("Error fetching intervals:", error);
    }
  };

  useEffect(() => {
    fetchTask();
    fetchIntervals();
  }, [id]);

  const calculateDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const duration = (end - start) / 1000; // duration in seconds
    return duration > 0 ? `${duration} seconds` : "N/A";
  };

  const handleDeleteTimestamp = async (timestampId) => {
    try {
      await fetch(`${API_BASE_URL}/timestamps/${timestampId}`, {
        method: "DELETE"
      });
      fetchIntervals(); // Refresh intervals after deletion
    } catch (error) {
      console.error("Error deleting timestamp:", error);
    }
  };

  const handleUpdateTimestamp = async (timestampId, newTimestamp) => {
    try {
      await fetch(`${API_BASE_URL}/timestamps/${timestampId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: newTimestamp,
          task: id,
          type: newTimestamp.type // type should be 0 or 1 based on start or end
        })
      });
      fetchIntervals(); // Refresh intervals after update
    } catch (error) {
      console.error("Error updating timestamp:", error);
    }
  };

  const handleAddInterval = () => {
    console.log(tags);
    console.log(task);
    console.log(startTimeActivities);
    console.log(endTimeActivities);
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container vh-100">
      <Header />
      <h2>Task Details: {task.name}</h2>
      <p><strong>Tags: {tags.map(tag => tag.name).join(', ')}</strong></p>
      <h4>Activity Intervals</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {startTimeActivities.map((start, index) => {
            const end = endTimeActivities[index];
            return (
              <tr key={start.id}>
                <td>{start.timestamp.toLocaleString()}</td>
                <td>{end ? end.timestamp.toLocaleString() : "N/A"}</td>
                <td>{calculateDuration(start.timestamp, end?.timestamp)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteTimestamp(start.id)}
                  >
                    Delete Start
                  </button>
                  {end && (
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDeleteTimestamp(end.id)}
                    >
                      Delete End
                    </button>
                  )}
                  <button
                    className="btn btn-secondary btn-sm ms-2"
                    onClick={() => handleUpdateTimestamp(start.id, prompt("Enter new start time", start.timestamp))}
                  >
                    Update Start
                  </button>
                  {end && (
                    <button
                      className="btn btn-secondary btn-sm ms-2"
                      onClick={() => handleUpdateTimestamp(end.id, prompt("Enter new end time", end.timestamp))}
                    >
                      Update End
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="btn btn-primary mt-3" onClick={handleAddInterval}>Add Activity Interval</button>
    </div>
  );
}

export default TaskDetail;
