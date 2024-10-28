import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import API_BASE_URL from '../config';

const ManageTags = () => {
  const [newTagName, setNewTagName] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const navigate = useNavigate();

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tags`);
        const tagsData = await response.json();
        setAvailableTags(tagsData);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleAddNewTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName })
      });

      if (response.ok) {
        alert("Tag added successfully");
        setNewTagName('');
        // Reload tags after adding a new one
        const tagsResponse = await fetch(`${API_BASE_URL}/tags`);
        const tagsData = await tagsResponse.json();
        setAvailableTags(tagsData);
      } else {
        console.error("Failed to add new tag");
      }
    } catch (error) {
      console.error("Error adding new tag:", error);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await fetch(`${API_BASE_URL}/tags/${tagId}`, { method: 'DELETE' });
      setAvailableTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  return (
    <div className="container vh-100">
      <Header />
      <h2 className="text-center mb-4">Manage Tags</h2>
      <form className="bg-light p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label">Tag Name</label>
          <input
            type="text"
            className="form-control"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            required
            placeholder="Enter tag name"
          />
        </div>
        <button
          type="button"
          className="btn btn-success mt-2"
          onClick={handleAddNewTag}
        >
          Add Tag
        </button>
        <button
          type="button"
          className="btn btn-secondary mt-2 ms-2"
          onClick={() => navigate('/')}
        >
          Back
        </button>
      </form>

      <h3 className="mt-4">Existing Tags</h3>
      <ul className="list-group">
        {availableTags.map((tag) => (
          <li key={tag.id} className="list-group-item d-flex justify-content-between align-items-center">
            {tag.name}
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteTag(tag.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageTags;
