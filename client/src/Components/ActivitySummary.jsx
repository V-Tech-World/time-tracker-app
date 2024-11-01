import { useState, useEffect } from "react";
import Header from "./Header";
import API_BASE_URL from "../config";
import axios from "axios";
import { DateTime } from "luxon";

function ActivitySummary() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [totalTime, setTotalTime] = useState({});

  useEffect(() => {
    // Fetch tasks and calculate total time for each
    const fetchData = async () => {
      try {
        const tasksRes = await axios.get(`${API_BASE_URL}/tasks`);
        const tasks = tasksRes.data;

        const timeData = await calculateTotalTime(tasks);
        setTasks(tasks);
        setTotalTime(timeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const calculateTotalTime = async (tasks) => {
    const taskTimeData = {};
  
    for (const task of tasks) {
      try {
        const [startRes, endRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/timesfortask/${task.id}/0`),
          axios.get(`${API_BASE_URL}/timesfortask/${task.id}/1`)
        ]);
  
        const startTimestamps = startRes.data;
        const endTimestamps = endRes.data;
  
        const filteredStart = startTimestamps.filter(ts => filterByDate(ts.timestamp));
        const filteredEnd = endTimestamps.filter(ts => filterByDate(ts.timestamp));
  
        let totalDuration = 0;
  
        // Ensure only valid pairs are processed
        const pairCount = Math.min(filteredStart.length, filteredEnd.length);
  
        for (let i = 0; i < pairCount; i++) {
          const start = filteredStart[i];
          const end = filteredEnd[i];
  
          if (start && end) {
            const startTime = DateTime.fromFormat(start.timestamp, "yyyy-MM-dd HH:mm:ss.SSS");
            const endTime = DateTime.fromFormat(end.timestamp, "yyyy-MM-dd HH:mm:ss.SSS");
  
            const duration = endTime.diff(startTime, "minutes").minutes;
            totalDuration += duration;
          }
        }
  
        taskTimeData[task.id] = totalDuration || 0;

        // Log if there are unmatched start or end timestamps
        if (filteredStart.length !== filteredEnd.length) {
          console.warn(`Task ${task.id} - Unmatched start/end timestamps`);
        }
        
      } catch (error) {
        console.error(`Error fetching timestamps for task ${task.id}:`, error);
        taskTimeData[task.id] = 0; // Default to 0 on error
      }
    }
  
    return taskTimeData;
  };
  
  const filterByDate = (timestamp) => {
    const timestampDate = DateTime.fromFormat(timestamp, "yyyy-MM-dd HH:mm:ss.SSS").toISODate();

    if (!startDate && !endDate) return true; // Include all if no date range selected

    const isWithinRange =
        (!startDate || timestampDate >= DateTime.fromISO(startDate).toISODate()) &&
        (!endDate || timestampDate <= DateTime.fromISO(endDate).toISODate());

    console.log(`Filtering timestamp ${timestamp}: ${isWithinRange ? "Included" : "Excluded"}`);
    return isWithinRange;
  };

  const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <div className="container vh-100">
      <Header />
      <h2>Activity Summary</h2>
      <div className="mb-3">
        <label className="form-label">Select Date Range</label>
        <input
          type="date"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="form-control mt-2"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div>
        <h3>Total Time Spent on Tasks</h3>
        <ul>
          {tasks.map((task) => {
            const timeSpent = totalTime[task.id] || 0;
            return (
              <li key={task.id}>
                <strong>{task.name}:</strong> {timeSpent > 0 ? formatDuration(timeSpent) : "No time recorded"}
              </li>
            );
          })}
        </ul>
      </div>
      <button onClick={() => console.log(totalTime)}>test</button>
    </div>
  );
}

export default ActivitySummary;
