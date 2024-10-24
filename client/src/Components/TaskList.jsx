import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import API_BASE_URL from '../config'; // Assuming you've created a config file for the base URL
import '../css/taskList.css'; 

function TaskList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState(''); // State for the notepad

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

  // Delete Task 
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setTasks(tasks.filter(task => task.id !== taskId));
          alert("Task deleted successfully");
        } else {
          console.error("Failed to delete task:", response.statusText);
          alert("Failed to delete task. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("An error occurred while deleting the task.");
      }
    }
  };

  const handleEdit = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

  const handleViewDetails = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  if (loading) {
    return <div className="text-center mt-4"><strong>Loading tasks...</strong></div>;
  }

  return (
    <div className="container mt-4">
      <Header />
      <div className="d-flex justify-content-between mb-4">
        <div className="w-75">
          <h1 className="text-primary">Task List</h1>
          <button className="btn btn-primary" onClick={() => navigate('/add-task')}>Add New Task</button>
          
          <div className="card shadow mt-3">
            <div className="card-body">
              <table className="table table-striped">
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
                    <tr key={task.id} className="hover-shadow">
                      <td>{task.name}</td>
                      <td>
                        {task.tags.split(',').map(tag => (
                          <span key={tag} className="badge bg-secondary me-1">
                            {tag.trim()}
                          </span>
                        ))}
                      </td>
                      <td><span className="badge bg-success">Active</span></td>
                      <td>
                        <button className="btn btn-info btn-sm me-1" onClick={() => handleEdit(task.id)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        <button className="btn btn-secondary btn-sm ms-1" onClick={() => handleViewDetails(task.id)}>View Details</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center">No tasks found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar for Notepad, Watch, and Calendar */}
        <div className="w-25 ms-4">
          <div className="card shadow mb-4">
            <div className="card-body">
              <h5 className="card-title">Notepad</h5>
              <textarea
                className="form-control"
                rows="10"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your notes here..."
              ></textarea>
            </div>
          </div>

          <div className="card shadow mb-4">
            <div className="card-body">
              <h5 className="card-title">Watch</h5>
              <div id="watch" className="text-center">
                {/* Add your watch functionality here */}
                <h4>{new Date().toLocaleTimeString()}</h4>
              </div>
            </div>
          </div>

          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Calendar</h5>
              <div id="calendar" className="text-center">
                {/* Add a simple calendar here */}
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskList;
















