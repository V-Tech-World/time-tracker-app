import Header from "./Header"
import  { useState } from 'react';
import PropTypes from 'prop-types';

function TaskAdd ({ isEditing, task }) {
  const [name, setName] = useState(task?.name || '');
  const [tags, setTags] = useState(task?.tags || []);

  const handleSave = () => {
    // Handle save functionality
  };

  return (
    <div className="container mt-4">
      <Header />
      <h2>{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
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
          <input
            type="text"
            className="form-control"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(','))}
          />
        </div>
        <button type="submit" className="btn btn-success">Save</button>
      </form>
    </div>
  );
}
TaskAdd.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  task: PropTypes.shape({
    name: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  })
};

export default  TaskAdd
