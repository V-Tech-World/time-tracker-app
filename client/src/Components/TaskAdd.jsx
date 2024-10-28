import Header from "./Header";
import { useState, useEffect } from 'react';
import Select from 'react-select';
import API_BASE_URL from '../config';

function TaskAdd() {
  const [name, setName] = useState('');
  const [tags, setTags] = useState([]); // Selected tags
  const [allTags, setAllTags] = useState([]); // Available tags

  // Fetch all tags on component mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/tags`)
      .then((response) => response.json())
      .then((data) => setAllTags(data.map(tag => ({ value: tag.id, label: tag.name }))))
      .catch((error) => console.error('Error fetching tags:', error));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    const selectedTags = tags.map(tag => tag.value).join(','); // Format tags as a comma-separated string of IDs

    const newTask = {
      name: name,
      tags: selectedTags,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        // Handle successful save, e.g., navigate to task list or reset form
        setName('');
        setTags([]);
        alert('Task added successfully');
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="container vh-100">
      <Header />
      <h2>Add New Task</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label">Task Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <Select
            isMulti
            value={tags}
            onChange={setTags}
            options={allTags}
            placeholder="Select tags..."
          />
        </div>
        <button type="submit" className="btn btn-success">Save</button>
      </form>
    </div>
  );
}

export default TaskAdd;
