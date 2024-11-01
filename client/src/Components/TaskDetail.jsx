import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import API_BASE_URL from "../config";

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [tags, setTags] = useState([]);
  const [intervals, setIntervals] = useState([]);
  const [editingTimestamp, setEditingTimestamp] = useState({ id: null, value: '' });
  const [newTimestamp, setNewTimestamp] = useState({ start: '', end: '' });
  const [error, setError] = useState('');

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

      const startActivities = await startResponse.json();
      const endActivities = await endResponse.json();

      const allActivities = [
        ...startActivities.map(activity => ({ ...activity, type: 0 })),
        ...endActivities.map(activity => ({ ...activity, type: 1 }))
      ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const pairedIntervals = [];
      let currentStart = null;

      allActivities.forEach(activity => {
        if (activity.type === 0) {
          currentStart = activity;
        } else if (currentStart) {
          pairedIntervals.push({
            start: currentStart,
            end: activity
          });
          currentStart = null;
        }
      });

      if (currentStart) {
        pairedIntervals.push({ start: currentStart, end: null });
      }

      setIntervals(pairedIntervals);
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
    const duration = (new Date(end.timestamp) - new Date(start.timestamp)) / 1000;
    return duration > 0 ? `${duration} seconds` : "N/A";
  };

  const handleAddTimestamp = async () => {
    const start = new Date(newTimestamp.start);
    const end = new Date(newTimestamp.end);

    if (!newTimestamp.start || !newTimestamp.end) {
      setError("Both start and end times are required.");
      return;
    }

    if (isNaN(start) || isNaN(end)) {
      setError("Invalid date format. Please enter valid start and end times.");
      return;
    }

    if (start >= end) {
      setError("Start time must be before the end time.");
      return;
    }

    setError('');

    try {
      // Add start timestamp
      await fetch(`${API_BASE_URL}/timestamps`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: newTimestamp.start, task: id, type: '0' })
      });
      
      // Add end timestamp
      await fetch(`${API_BASE_URL}/timestamps`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: newTimestamp.end, task: id, type: '1' })
      });

      setNewTimestamp({ start: '', end: '' });
      fetchIntervals();
    } catch (error) {
      console.error("Error adding timestamps:", error);
    }
  };

  const handleDeleteTimestamp = async (timestampId) => {
    try {
      await fetch(`${API_BASE_URL}/timestamps/${timestampId}`, {
        method: "DELETE"
      });
      fetchIntervals();
    } catch (error) {
      console.error("Error deleting timestamp:", error);
    }
  };

  const handleEditTimestamp = (id, currentTimestamp) => {
    setEditingTimestamp({ id, value: currentTimestamp });
  };

  const handleSaveTimestamp = async (timestampId) => {
    const newTimestampDate = new Date(editingTimestamp.value);
    const isValidDate = !isNaN(newTimestampDate);
    if (!isValidDate) {
      alert("Invalid date format. Please enter a valid date and time.");
      return;
    }
  
    const interval = intervals.find(
      interval => interval.start?.id === timestampId || interval.end?.id === timestampId
    );
  
    if (interval) {
      if (interval.start && timestampId === interval.end?.id) {
        const startTimestampDate = new Date(interval.start.timestamp);
        if (newTimestampDate <= startTimestampDate) {
          alert("End time must be after the start time. Please enter a valid end time.");
          return;
        }
      }
  
      if (interval.end && timestampId === interval.start?.id) {
        const endTimestampDate = new Date(interval.end.timestamp);
        if (newTimestampDate >= endTimestampDate) {
          alert("Start time must be before the end time. Please enter a valid start time.");
          return;
        }
      }
    }
  
    try {
      await fetch(`${API_BASE_URL}/timestamps/${timestampId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: editingTimestamp.value, task: id, type: editingTimestamp.type })
      });
      fetchIntervals();
      setEditingTimestamp({ id: null, value: '' });
    } catch (error) {
      console.error("Error updating timestamp:", error);
    }
  };
  

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container vh-100">
      <Header />
      <h2>Task Details: {task.name}</h2>
      <p><strong>Tags: {tags.map(tag => tag.name).join(', ')}</strong></p>

      {/* New Timestamp Form */}
      <div className="my-3">
        <h4>Add New Interval</h4>
        <div>
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={newTimestamp.start}
            onChange={(e) => setNewTimestamp({ ...newTimestamp, start: e.target.value })}
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={newTimestamp.end}
            onChange={(e) => setNewTimestamp({ ...newTimestamp, end: e.target.value })}
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button className="btn btn-primary mt-2" onClick={handleAddTimestamp}>
          Add Interval
        </button>
      </div>

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
          {intervals.map((interval, index) => (
            <tr key={index}>
              <td>
                {editingTimestamp.id === interval.start?.id ? (
                  <input
                    type="datetime-local"
                    value={editingTimestamp.value}
                    onChange={(e) => setEditingTimestamp({ ...editingTimestamp, value: e.target.value })}
                  />
                ) : (
                  interval.start ? new Date(interval.start.timestamp).toLocaleString() : "N/A"
                )}
              </td>
              <td>
                {editingTimestamp.id === interval.end?.id ? (
                  <input
                    type="datetime-local"
                    value={editingTimestamp.value}
                    onChange={(e) => setEditingTimestamp({ ...editingTimestamp, value: e.target.value })}
                  />
                ) : (
                  interval.end ? new Date(interval.end.timestamp).toLocaleString() : "N/A"
                )}
              </td>
              <td>{calculateDuration(interval.start, interval.end)}</td>
              <td>
                {interval.start && (
                  <>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteTimestamp(interval.start.id)}
                    >
                      Delete Start
                    </button>
                    <button
                      className="btn btn-secondary btn-sm ms-2"
                      onClick={() => handleEditTimestamp(interval.start.id, interval.start.timestamp)}
                    >
                      Edit Start
                    </button>
                  </>
                )}
                {interval.end && (
                  <>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDeleteTimestamp(interval.end.id)}
                    >
                      Delete End
                    </button>
                    <button
                      className="btn btn-secondary btn-sm ms-2"
                      onClick={() => handleEditTimestamp(interval.end.id, interval.end.timestamp)}
                    >
                      Edit End
                    </button>
                  </>
                )}
                {editingTimestamp.id === interval.start?.id && (
                  <button
                    className="btn btn-success btn-sm ms-2"
                    onClick={() => handleSaveTimestamp(interval.start.id)}
                  >
                    Save
                  </button>
                )}
                {editingTimestamp.id === interval.end?.id && (
                  <button
                    className="btn btn-success btn-sm ms-2"
                    onClick={() => handleSaveTimestamp(interval.end.id)}
                  >
                    Save
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskDetail;
