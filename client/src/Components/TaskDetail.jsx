import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';

function TaskDetail() {
  const { id } = useParams(); // Get the task ID from the URL
  const [task, setTask] = useState(null); // State to hold task details

  // Mock data for demonstration purposes
  const mockTasks = [
    { id: '1', name: 'Task 1', tags: ['work', 'urgent'] },
    { id: '2', name: 'Task 2', tags: ['personal', 'low'] },
  ];

  useEffect(() => {
    // Replace this with your actual data fetching logic
    const fetchedTask = mockTasks.find(task => task.id === id);
    setTask(fetchedTask);
  }, [id]); // Dependency array includes id to re-fetch on change

  if (!task) {
    return <div>Loading...</div>; // Show a loading state while fetching
  }

  return (
    <div className="container mt-4">
      <Header />
      <h2>Task Details: {task.name}</h2>
      <p><strong>Tags:</strong> {task.tags.join(', ')}</p>
      <h4>Activity Intervals</h4>
      {/* Activity intervals table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {/* Replace with activity interval data */}
          <tr>
            <td>2024-10-22 08:00</td>
            <td>2024-10-22 10:00</td>
            <td>2 hours</td>
          </tr>
        </tbody>
      </table>
      <button className="btn btn-primary mt-3">Add Activity Interval</button>
    </div>
  );
}

export default TaskDetail;
