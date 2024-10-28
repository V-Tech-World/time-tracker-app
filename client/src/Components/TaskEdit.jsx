import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import API_BASE_URL from '../config';

const TaskEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    name: '',
    tags: []
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [tagNames, setTagNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch the task data and available tags
  useEffect(() => {
    const fetchTaskAndTags = async () => {
      try {
        const taskResponse = await fetch(`${API_BASE_URL}/tasks/${id}`);
        const taskData = await taskResponse.json();
        const taskDetails = taskData[0] || {}; 

        setTask({
          name: taskDetails.name || '',
          tags: taskDetails.tags ? taskDetails.tags.split(',') : []
        });

        const tagsResponse = await fetch(`${API_BASE_URL}/tags`);
        const tagsData = await tagsResponse.json();
        setAvailableTags(tagsData);

        const names = tagsData.reduce((acc, tag) => {
          acc[tag.id] = tag.name;
          return acc;
        }, {});
        setTagNames(names);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchTaskAndTags();
  }, [id]);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: task.name,
          tags: task.tags.join(',')
        })
      });
      if (response.ok) {
        setSuccessMessage('Task updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
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

  const handleTagToggle = (tagId) => {
    setTask((prevTask) => ({
      ...prevTask,
      tags: prevTask.tags.includes(tagId)
        ? prevTask.tags.filter((tag) => tag !== tagId)
        : [...prevTask.tags, tagId]
    }));
  };

  if (loading) {
    return <p>Loading task data...</p>;
  }

  return (
    <div className="container vh-100">
      <Header />
      <h2 className="text-center mb-4">Edit Task</h2>

      {successMessage && (
        <div className="alert alert-success text-center">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-light p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label">Task Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={task.name}
            onChange={handleChange}
            required
            placeholder="Enter task name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tags</label>
          <div>
            {availableTags.map((tag) => (
              <div key={tag.id} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`tag-${tag.id}`}
                  checked={task.tags.includes(String(tag.id))}
                  onChange={() => handleTagToggle(String(tag.id))}
                />
                <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                  {tagNames[tag.id]}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-success">Save Changes</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Back</button>
        </div>
      </form>
    </div>
  );
};

export default TaskEdit;
