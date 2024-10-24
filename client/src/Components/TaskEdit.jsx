import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import API_BASE_URL from '../config'; // Assuming you've created a config file for the base URL

const TaskEdit = () => {
  const { id } = useParams();  // Get the task ID from URL params
  const navigate = useNavigate();
  
  const [task, setTask] = useState({
    name: '',
    tags: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch the task data from the API based on the task ID
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
        const data = await response.json();
        setTask({
          name: data.name || '',  
          tags: data.tags || ''  
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task data:", error);
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      // Perform save logic by sending a PUT request to the API
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });
      if (response.ok) {
        console.log("Task updated successfully");
        // After save, redirect back to task list
        navigate('/');
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value
    }));
  };

  const handleTagsChange = (event) => {
    setTask((prevTask) => ({
      ...prevTask,
      tags: event.target.value // Keep it as a comma-separated string
    }));
  };

  if (loading) {
    return <p>Loading task data...</p>;
  }

  return (
    <div className="container mt-4">
      <Header />
      <h2>Edit Task</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label">Task Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={task.name}  // Ensure it's always a controlled component
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <input
            type="text"
            className="form-control"
            name="tags"
            value={task.tags}  // Ensure it's always a controlled component
            onChange={handleTagsChange}
          />
        </div>
        <button type="submit" className="btn btn-success">Save Changes</button>
      </form>
    </div>
  );
};

export default TaskEdit;
