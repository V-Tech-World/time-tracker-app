import Header from "./Header";
import { useState } from 'react';

function TaskAdd() {
  const [name, setName] = useState('');
  const [tags, setTags] = useState([]);
  const handleSave = (e) => {
    e.preventDefault();
    // Handle save functionality here, e.g., calling an API to save the task
  };

  return (
    <div className="container vh-100">
      <Header />
      <h2>{ 'Add New Task'}</h2>
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


export default TaskAdd;
