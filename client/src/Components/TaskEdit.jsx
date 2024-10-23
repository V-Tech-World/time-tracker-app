// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Header from './Header';

// const TaskEdit = () => {
//   const { id } = useParams();  // Get the task ID from URL params
//   const navigate = useNavigate();
  
//   const [task, setTask] = useState({
//     name: '',
//     tags: []
//   });

//   const [loading, setLoading] = useState(true);

//   // Simulate fetching task data based on the task ID
//   useEffect(() => {
//     const fetchTask = async () => {
//       try {
//         // Replace with your API call or data fetching logic
//         const response = await fetch(`/api/tasks/${id}`);
//         const data = await response.json();
        
//         // Set the task state with fetched data
//         setTask({
//           name: data.name,
//           tags: data.tags
//         });
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching task:", error);
//       }
//     };

//     fetchTask();
//   }, [id]);

//   const handleSave = async (event) => {
//     event.preventDefault();

//     // Send the updated task data to the server/API
//     try {
//       await fetch(`/api/tasks/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(task)
//       });

//       // Redirect back to the task list after saving
//       navigate('/');
//     } catch (error) {
//       console.error("Error updating task:", error);
//     }
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setTask((prevTask) => ({
//       ...prevTask,
//       [name]: value
//     }));
//   };

//   const handleTagsChange = (event) => {
//     setTask((prevTask) => ({
//       ...prevTask,
//       tags: event.target.value.split(',')
//     }));
//   };

//   if (loading) {
//     return <p>Loading task data...</p>;
//   }

//   return (
//     <div className="container mt-4">
//       <Header />
//       <h2>Edit Task</h2>
//       <form onSubmit={handleSave}>
//         <div className="mb-3">
//           <label className="form-label">Task Name</label>
//           <input
//             type="text"
//             className="form-control"
//             name="name"
//             value={task.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Tags</label>
//           <input
//             type="text"
//             className="form-control"
//             value={task.tags.join(', ')}
//             onChange={handleTagsChange}
//           />
//         </div>
//         <button type="submit" className="btn btn-success">Save Changes</button>
//       </form>
//     </div>
//   );
// };

// export default TaskEdit;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';

const TaskEdit = () => {
  const { id } = useParams();  // Get the task ID from URL params
  const navigate = useNavigate();
  
  const [task, setTask] = useState({
    name: '',
    tags: []
  });

  const [loading, setLoading] = useState(true);

  // Mock data for demonstration purposes
  const mockTasks = [
    { id: '1', name: 'Task 1', tags: ['work', 'urgent'] },
    { id: '2', name: 'Task 2', tags: ['personal', 'low'] },
  ];

  // Simulate fetching task data based on the task ID
  useEffect(() => {
    const fetchTask = () => {
      // Simulate fetching the task from mock data
      const fetchedTask = mockTasks.find(task => task.id === id);
      if (fetchedTask) {
        setTask({
          name: fetchedTask.name,
          tags: fetchedTask.tags
        });
      }
      setLoading(false);
    };

    fetchTask();
  }, [id]);

  const handleSave = (event) => {
    event.preventDefault();
    
    // Here you can log the updated task to see the changes
    console.log("Updated Task Data:", task);

    // Redirect back to the task list after saving
    navigate('/');
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
      tags: event.target.value.split(',').map(tag => tag.trim())
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
            value={task.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <input
            type="text"
            className="form-control"
            value={task.tags.join(', ')}
            onChange={handleTagsChange}
          />
        </div>
        <button type="submit" className="btn btn-success">Save Changes</button>
      </form>
    </div>
  );
};

export default TaskEdit;
