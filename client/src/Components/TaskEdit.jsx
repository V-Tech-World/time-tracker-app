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
  const [newTagName, setNewTagName] = useState('');
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

        // Initialize tagNames state from the fetched tags
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

  // Handle Save
  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
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

  // Handle input changes for task name
  const handleChange = (event) => {
    const { name, value } = event.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value
    }));
  };

  // Handle adding a new tag
  const handleAddNewTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newTagName })
      });
      const newTag = await response.json();

      // Update availableTags, task tags, and tagNames state with the new tag
      setAvailableTags((prevTags) => [...prevTags, newTag]);
      setTask((prevTask) => ({
        ...prevTask,
        tags: [...prevTask.tags, String(newTag.id)]
      }));
      setTagNames((prevTagNames) => ({
        ...prevTagNames,
        [newTag.id]: newTag.name
      }));

      setNewTagName('');
    } catch (error) {
      console.error("Error adding new tag:", error);
    }
  };

  // Handle deleting a tag
  const handleDeleteTag = async (tagId) => {
    try {
      await fetch(`${API_BASE_URL}/tags/${tagId}`, {
        method: 'DELETE'
      });

      // Remove the tag from availableTags, task tags, and tagNames
      setAvailableTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
      setTask((prevTask) => ({
        ...prevTask,
        tags: prevTask.tags.filter((tag) => tag !== tagId)
      }));
      setTagNames((prevTagNames) => {
        const updatedTagNames = { ...prevTagNames };
        delete updatedTagNames[tagId];
        return updatedTagNames;
      });
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  // Toggle tag selection
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

      {/* Success Message */}
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
                <button
                  type="button"
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDeleteTag(tag.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Add New Tag</label>
          <div className="d-flex">
            <input
              type="text"
              className="form-control"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter new tag name"
            />
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={handleAddNewTag}
            >
              Add Tag
            </button>
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
