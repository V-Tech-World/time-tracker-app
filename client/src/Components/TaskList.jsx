import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import API_BASE_URL from '../config'; // Assuming you've created a config file for the base URL

function TaskList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        const data = await response.json();
        setTasks(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleEdit = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

  const handleViewDetails = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="container">
      <Header />
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h1>Task List</h1>
        <button className="btn btn-primary" onClick={() => navigate('/add-task')}>Add New Task</button>
      </div>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Tags</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? tasks.map(task => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>
                {task.tags.split(',').map(tag => (
                  <span key={tag} className="badge bg-secondary me-1">
                    Tag {tag}
                  </span>
                ))}
              </td>
              <td>Active</td>
              <td>
                <button className="btn btn-info btn-sm" onClick={() => handleEdit(task.id)}>Edit</button>
                <button className="btn btn-danger btn-sm">Delete</button>
                <button className="btn btn-secondary btn-sm" onClick={() => handleViewDetails(task.id)}>View Details</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4">No tasks found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
